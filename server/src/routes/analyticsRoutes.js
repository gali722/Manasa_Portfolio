import express from 'express';
import {
  getAnalytics,
  getAnalyticsSummary,
  exportAnalytics,
  trackPageView,
} from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/track', trackPageView);

// Admin routes
router.get('/admin', authenticate, getAnalytics);
router.get('/admin/summary', authenticate, getAnalyticsSummary);
router.get('/admin/export', authenticate, exportAnalytics);

export default router;
