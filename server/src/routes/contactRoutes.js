import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  submitContactForm,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { authenticate } from '../middleware/auth.js';
import { validateContactForm, validateObjectId, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// Rate limiter for contact form submissions
// 5 submissions per hour per IP address
const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many contact form submissions. Please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post('/public/contact', contactFormLimiter, validateContactForm, submitContactForm);

// Admin routes (protected)
router.get('/admin/contact', authenticate, validatePagination, getContactMessages);
router.put('/admin/contact/:id', authenticate, validateObjectId, updateContactMessageStatus);
router.delete('/admin/contact/:id', authenticate, validateObjectId, deleteContactMessage);

export default router;
