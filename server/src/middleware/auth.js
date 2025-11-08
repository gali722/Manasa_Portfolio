import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt.js';
import User from '../models/User.js';
import { AppError } from './errorHandler.js';

/**
 * Authentication middleware to protect routes
 */
export const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Find user
    const user = await User.findById(decoded.userId).select('-password -refreshToken');

    if (!user) {
      throw new AppError('User not found', 401, 'USER_NOT_FOUND');
    }

    if (!user.isActive) {
      throw new AppError('Account is inactive', 403, 'ACCOUNT_INACTIVE');
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    if (error.message === 'Token expired') {
      return next(new AppError('Token expired', 401, 'TOKEN_EXPIRED'));
    }
    if (error.message === 'Invalid token') {
      return next(new AppError('Invalid token', 401, 'INVALID_TOKEN'));
    }
    next(error);
  }
};

/**
 * Authorization middleware to check user role
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Insufficient permissions', 403, 'FORBIDDEN')
      );
    }

    next();
  };
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId).select('-password -refreshToken');
      
      if (user && user.isActive) {
        req.user = user;
        req.userId = user._id;
      }
    }

    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
};
