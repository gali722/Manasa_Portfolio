import User from '../models/User.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import bcrypt from 'bcryptjs';

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return tokens
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new AppError('Email and password are required', 400, 'MISSING_CREDENTIALS');
  }

  // Find user with password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  // Check if account is active
  if (!user.isActive) {
    throw new AppError('Account is inactive', 403, 'ACCOUNT_INACTIVE');
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.updateLastLogin();

  // Return tokens and user info
  res.json({
    success: true,
    data: {
      user: user.toSafeObject(),
      accessToken,
      refreshToken,
    },
  });
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400, 'MISSING_REFRESH_TOKEN');
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Find user and verify refresh token matches
  const user = await User.findById(decoded.userId).select('+refreshToken');

  if (!user) {
    throw new AppError('User not found', 401, 'USER_NOT_FOUND');
  }

  if (!user.isActive) {
    throw new AppError('Account is inactive', 403, 'ACCOUNT_INACTIVE');
  }

  if (user.refreshToken !== refreshToken) {
    throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  // Generate new tokens
  const tokens = generateTokens(user._id);

  // Update refresh token
  user.refreshToken = tokens.refreshToken;
  await user.save();

  res.json({
    success: true,
    data: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and invalidate refresh token
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate input
  if (!currentPassword || !newPassword) {
    throw new AppError('Current and new passwords are required', 400, 'MISSING_PASSWORDS');
  }

  if (newPassword.length < 8) {
    throw new AppError('New password must be at least 8 characters', 400, 'INVALID_PASSWORD');
  }

  // Find user with password
  const user = await User.findById(req.userId).select('+password');

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401, 'INVALID_PASSWORD');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  res.json({
    success: true,
    data: {
      user: user.toSafeObject(),
    },
  });
});
