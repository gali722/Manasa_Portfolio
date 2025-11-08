import express from 'express';
import {
  getPublicTestimonials,
  getAdminTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  uploadAuthorPhoto,
  reorderTestimonials,
} from '../controllers/testimonialController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import { validateImage } from '../middleware/fileValidation.js';
import { validateTestimonial, validateObjectId } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/public/testimonials', getPublicTestimonials);

// Admin routes
router.get('/admin/testimonials', authenticate, getAdminTestimonials);
router.get('/admin/testimonials/:id', authenticate, validateObjectId, getTestimonial);
router.post('/admin/testimonials', authenticate, validateTestimonial, createTestimonial);
router.put('/admin/testimonials/:id', authenticate, validateObjectId, validateTestimonial, updateTestimonial);
router.delete('/admin/testimonials/:id', authenticate, validateObjectId, deleteTestimonial);
router.post(
  '/admin/testimonials/:id/photo',
  authenticate,
  upload.single('photo'),
  validateImage,
  uploadAuthorPhoto
);
router.put('/admin/testimonials/reorder', authenticate, reorderTestimonials);

export default router;
