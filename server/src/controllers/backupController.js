import Profile from '../models/Profile.js';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Certification from '../models/Certification.js';
import Testimonial from '../models/Testimonial.js';
import ContactMessage from '../models/ContactMessage.js';
import Analytics from '../models/Analytics.js';
import User from '../models/User.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create a backup of all portfolio data
 */
export const createBackup = async (req, res) => {
  try {
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: {
        profile: await Profile.find().lean(),
        skills: await Skill.find().lean(),
        projects: await Project.find().lean(),
        experience: await Experience.find().lean(),
        education: await Education.find().lean(),
        certifications: await Certification.find().lean(),
        testimonials: await Testimonial.find().lean(),
        contactMessages: await ContactMessage.find().lean(),
        analytics: await Analytics.find().lean(),
        // Don't include user passwords in backup
        users: await User.find().select('-password').lean(),
      },
    };

    // Create backups directory if it doesn't exist
    const backupsDir = path.join(__dirname, '../../backups');
    try {
      await fs.access(backupsDir);
    } catch {
      await fs.mkdir(backupsDir, { recursive: true });
    }

    // Save backup to file
    const filename = `backup-${Date.now()}.json`;
    const filepath = path.join(backupsDir, filename);
    await fs.writeFile(filepath, JSON.stringify(backup, null, 2));

    res.json({
      success: true,
      message: 'Backup created successfully',
      data: {
        filename,
        timestamp: backup.timestamp,
        size: JSON.stringify(backup).length,
        backup, // Include backup data in response for download
      },
    });
  } catch (error) {
    console.error('Backup creation error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'BACKUP_FAILED',
        message: 'Failed to create backup',
        details: error.message,
      },
    });
  }
};

/**
 * Restore portfolio data from backup
 */
export const restoreBackup = async (req, res) => {
  try {
    const { backup } = req.body;

    if (!backup || !backup.data) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_BACKUP',
          message: 'Invalid backup data provided',
        },
      });
    }

    // Validate backup structure
    const requiredCollections = [
      'profile',
      'skills',
      'projects',
      'experience',
      'education',
      'certifications',
      'testimonials',
    ];

    for (const collection of requiredCollections) {
      if (!backup.data[collection]) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_BACKUP',
            message: `Missing required collection: ${collection}`,
          },
        });
      }
    }

    // Create a restore point before restoring
    const restorePoint = {
      timestamp: new Date().toISOString(),
      data: {
        profile: await Profile.find().lean(),
        skills: await Skill.find().lean(),
        projects: await Project.find().lean(),
        experience: await Experience.find().lean(),
        education: await Education.find().lean(),
        certifications: await Certification.find().lean(),
        testimonials: await Testimonial.find().lean(),
      },
    };

    const restorePointsDir = path.join(__dirname, '../../backups/restore-points');
    try {
      await fs.access(restorePointsDir);
    } catch {
      await fs.mkdir(restorePointsDir, { recursive: true });
    }

    const restorePointFile = path.join(
      restorePointsDir,
      `restore-point-${Date.now()}.json`
    );
    await fs.writeFile(restorePointFile, JSON.stringify(restorePoint, null, 2));

    // Restore data (excluding users and sensitive data)
    const collections = [
      { model: Profile, data: backup.data.profile },
      { model: Skill, data: backup.data.skills },
      { model: Project, data: backup.data.projects },
      { model: Experience, data: backup.data.experience },
      { model: Education, data: backup.data.education },
      { model: Certification, data: backup.data.certifications },
      { model: Testimonial, data: backup.data.testimonials },
    ];

    for (const { model, data } of collections) {
      if (data && data.length > 0) {
        // Clear existing data
        await model.deleteMany({});
        
        // Insert backup data (remove _id to let MongoDB generate new ones)
        const cleanData = data.map(item => {
          // eslint-disable-next-line no-unused-vars
          const { _id, __v, ...rest } = item;
          return rest;
        });
        
        await model.insertMany(cleanData);
      }
    }

    res.json({
      success: true,
      message: 'Backup restored successfully',
      data: {
        restoredAt: new Date().toISOString(),
        restorePointFile: path.basename(restorePointFile),
        collectionsRestored: collections.length,
      },
    });
  } catch (error) {
    console.error('Backup restore error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'RESTORE_FAILED',
        message: 'Failed to restore backup',
        details: error.message,
      },
    });
  }
};

/**
 * List available backups
 */
export const listBackups = async (req, res) => {
  try {
    const backupsDir = path.join(__dirname, '../../backups');
    
    try {
      await fs.access(backupsDir);
    } catch {
      return res.json({
        success: true,
        data: {
          backups: [],
          count: 0,
        },
      });
    }

    const files = await fs.readdir(backupsDir);
    const backupFiles = files.filter(file => file.startsWith('backup-') && file.endsWith('.json'));

    const backups = await Promise.all(
      backupFiles.map(async (file) => {
        const filepath = path.join(backupsDir, file);
        const stats = await fs.stat(filepath);
        
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
        };
      })
    );

    // Sort by creation date, newest first
    backups.sort((a, b) => b.created - a.created);

    res.json({
      success: true,
      data: {
        backups,
        count: backups.length,
      },
    });
  } catch (error) {
    console.error('List backups error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LIST_FAILED',
        message: 'Failed to list backups',
        details: error.message,
      },
    });
  }
};

/**
 * Delete a backup file
 */
export const deleteBackup = async (req, res) => {
  try {
    const { filename } = req.params;

    // Validate filename to prevent directory traversal
    if (!filename || filename.includes('..') || !filename.startsWith('backup-')) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FILENAME',
          message: 'Invalid backup filename',
        },
      });
    }

    const backupsDir = path.join(__dirname, '../../backups');
    const filepath = path.join(backupsDir, filename);

    await fs.unlink(filepath);

    res.json({
      success: true,
      message: 'Backup deleted successfully',
      data: {
        filename,
      },
    });
  } catch (error) {
    console.error('Delete backup error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_FAILED',
        message: 'Failed to delete backup',
        details: error.message,
      },
    });
  }
};
