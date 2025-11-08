import express from 'express';
import {
  getPublicCertifications,
  getAdminCertifications,
  getCertification,
  createCertification,
  updateCertification,
  deleteCertification,
  uploadCertificationBadge,
} from '../controllers/certificationController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import { validateImage } from '../middleware/fileValidation.js';
import { validateCertification, validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/public/certifications', getPublicCertifications);

// Admin routes
router.get('/admin/certifications', authenticate, getAdminCertifications);
router.get('/admin/certifications/:id', authenticate, validateObjectId, getCertification);
router.post('/admin/certifications', authenticate, validateCertification, createCertification);
router.put('/admin/certifications/:id', authenticate, validateObjectId, validateCertification, updateCertification);
router.delete('/admin/certifications/:id', authenticate, validateObjectId, deleteCertification);
router.post(
  '/admin/certifications/:id/badge',
  authenticate,
  upload.single('badge'),
  validateImage,
  uploadCertificationBadge
);

export default router;
