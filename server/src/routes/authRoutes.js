import express from 'express';
import {
  login,
  refreshToken,
  logout,
  changePassword,
  getCurrentUser,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { validateLogin, validateChangePassword } from '../middleware/validation.js';

const router = express.Router();

// Public routes with rate limiting
router.post('/login', authLimiter, validateLogin, login);
router.post('/refresh', refreshToken);

// Protected routes
router.post('/logout', authenticate, logout);
router.post('/change-password', authenticate, validateChangePassword, changePassword);
router.get('/me', authenticate, getCurrentUser);

export default router;
