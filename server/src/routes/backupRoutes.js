import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createBackup,
  restoreBackup,
  listBackups,
  deleteBackup,
} from '../controllers/backupController.js';

const router = express.Router();

// All backup routes require authentication
router.use(authenticate);

// Create backup
router.post('/backup', createBackup);

// Restore from backup
router.post('/restore', restoreBackup);

// List available backups
router.get('/backups', listBackups);

// Delete a backup
router.delete('/backups/:filename', deleteBackup);

export default router;
