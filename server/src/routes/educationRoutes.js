import express from 'express';
import {
  getPublicEducation,
  getAdminEducation,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  uploadInstitutionLogo,
} from '../controllers/educationController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import { validateImage } from '../middleware/fileValidation.js';
import { validateEducation, validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/public/education', getPublicEducation);

// Admin routes
router.get('/admin/education', authenticate, getAdminEducation);
router.get('/admin/education/:id', authenticate, validateObjectId, getEducation);
router.post('/admin/education', authenticate, validateEducation, createEducation);
router.put('/admin/education/:id', authenticate, validateObjectId, validateEducation, updateEducation);
router.delete('/admin/education/:id', authenticate, validateObjectId, deleteEducation);
router.post(
  '/admin/education/:id/logo',
  authenticate,
  upload.single('logo'),
  validateImage,
  uploadInstitutionLogo
);

export default router;
