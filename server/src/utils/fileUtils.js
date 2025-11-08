import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Delete a file from the filesystem
 */
export const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      return resolve();
    }

    // Handle both absolute and relative paths
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(__dirname, '../../', filePath);

    fs.unlink(absolutePath, (err) => {
      if (err) {
        // Don't reject if file doesn't exist
        if (err.code === 'ENOENT') {
          console.log(`File not found: ${absolutePath}`);
          return resolve();
        }
        console.error(`Error deleting file: ${err.message}`);
        return reject(err);
      }
      console.log(`File deleted: ${absolutePath}`);
      resolve();
    });
  });
};

/**
 * Delete multiple files
 */
export const deleteFiles = async (filePaths) => {
  if (!Array.isArray(filePaths)) {
    return;
  }

  const deletePromises = filePaths.map((filePath) => deleteFile(filePath));
  await Promise.allSettled(deletePromises);
};

/**
 * Check if file exists
 */
export const fileExists = (filePath) => {
  return new Promise((resolve) => {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(__dirname, '../../', filePath);

    fs.access(absolutePath, fs.constants.F_OK, (err) => {
      resolve(!err);
    });
  });
};

/**
 * Get file info
 */
export const getFileInfo = (filePath) => {
  return new Promise((resolve, reject) => {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(__dirname, '../../', filePath);

    fs.stat(absolutePath, (err, stats) => {
      if (err) {
        return reject(err);
      }

      resolve({
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
      });
    });
  });
};

/**
 * Get file URL from path
 */
export const getFileUrl = (filePath, baseUrl) => {
  if (!filePath) {
    return null;
  }

  // If already a full URL, return as is
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  // Remove 'uploads/' prefix if present
  const cleanPath = filePath.replace(/^uploads\//, '');

  return `${baseUrl}/api/files/${cleanPath}`;
};

/**
 * Clean up orphaned files (files not referenced in database)
 * This should be run periodically as a maintenance task
 */
export const cleanupOrphanedFiles = async (referencedFiles, uploadDir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(uploadDir, { withFileTypes: true }, async (err, entries) => {
      if (err) {
        return reject(err);
      }

      const deletedFiles = [];

      for (const entry of entries) {
        if (entry.isDirectory()) {
          // Recursively clean subdirectories
          const subDir = path.join(uploadDir, entry.name);
          const subDeleted = await cleanupOrphanedFiles(referencedFiles, subDir);
          deletedFiles.push(...subDeleted);
        } else {
          const filePath = path.join(uploadDir, entry.name);
          const relativePath = path.relative(
            path.join(__dirname, '../../'),
            filePath
          );

          // Check if file is referenced
          if (!referencedFiles.includes(relativePath)) {
            try {
              await deleteFile(filePath);
              deletedFiles.push(relativePath);
            } catch (error) {
              console.error(`Failed to delete orphaned file: ${filePath}`, error);
            }
          }
        }
      }

      resolve(deletedFiles);
    });
  });
};

/**
 * Get MIME type from file extension
 */
export const getMimeType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };

  return mimeTypes[ext] || 'application/octet-stream';
};

/**
 * Sanitize filename
 */
export const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
};
