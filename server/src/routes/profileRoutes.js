import express from 'express';
import {
  getPublicProfile,
  getAdminProfile,
  updateProfile,
  uploadProfilePhoto,
  uploadResume,
} from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import { validateImage, validateDocument } from '../middleware/fileValidation.js';
import { validateProfile } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/public/profile', getPublicProfile);
router.get('/public/resume', (req, res) => {
  res.status(404).json({ success: false, error: { message: 'Resume not available' } });
});

// Admin routes
router.get('/admin/profile', authenticate, getAdminProfile);
router.put('/admin/profile', authenticate, validateProfile, updateProfile);
router.post(
  '/admin/profile/photo',
  authenticate,
  upload.single('photo'),
  validateImage,
  uploadProfilePhoto
);
router.post(
  '/admin/profile/resume',
  authenticate,
  upload.single('resume'),
  validateDocument,
  uploadResume
);

export default router;
