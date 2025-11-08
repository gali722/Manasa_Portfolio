import express from 'express';
import {
  getPublicExperience,
  getAdminExperience,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  uploadCompanyLogo,
} from '../controllers/experienceController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import { validateImage } from '../middleware/fileValidation.js';
import { validateExperience, validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/public/experience', getPublicExperience);

// Admin routes
router.get('/admin/experience', authenticate, getAdminExperience);
router.get('/admin/experience/:id', authenticate, validateObjectId, getExperience);
router.post('/admin/experience', authenticate, validateExperience, createExperience);
router.put('/admin/experience/:id', authenticate, validateObjectId, validateExperience, updateExperience);
router.delete('/admin/experience/:id', authenticate, validateObjectId, deleteExperience);
router.post(
  '/admin/experience/:id/logo',
  authenticate,
  upload.single('logo'),
  validateImage,
  uploadCompanyLogo
);

export default router;
