import path from 'path';
import { AppError } from './errorHandler.js';

/**
 * Validate image file
 */
export const validateImage = (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded', 400, 'NO_FILE'));
  }

  const allowedTypes = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(req.file.originalname).toLowerCase();

  if (!allowedTypes.includes(ext)) {
    return next(
      new AppError(
        'Invalid file type. Only JPEG, PNG, and WebP images are allowed',
        400,
        'INVALID_FILE_TYPE'
      )
    );
  }

  // Check file size (5MB)
  if (req.file.size > 5 * 1024 * 1024) {
    return next(
      new AppError('File size too large. Maximum size is 5MB', 413, 'FILE_TOO_LARGE')
    );
  }

  next();
};

/**
 * Validate document file
 */
export const validateDocument = (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded', 400, 'NO_FILE'));
  }

  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(req.file.originalname).toLowerCase();

  if (!allowedTypes.includes(ext)) {
    return next(
      new AppError(
        'Invalid file type. Only PDF, DOC, and DOCX documents are allowed',
        400,
        'INVALID_FILE_TYPE'
      )
    );
  }

  // Check file size (10MB)
  if (req.file.size > 10 * 1024 * 1024) {
    return next(
      new AppError('File size too large. Maximum size is 10MB', 413, 'FILE_TOO_LARGE')
    );
  }

  next();
};

/**
 * Validate multiple images
 */
export const validateMultipleImages = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError('No files uploaded', 400, 'NO_FILES'));
  }

  const allowedTypes = ['.jpg', '.jpeg', '.png', '.webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  for (const file of req.files) {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedTypes.includes(ext)) {
      return next(
        new AppError(
          `Invalid file type for ${file.originalname}. Only JPEG, PNG, and WebP images are allowed`,
          400,
          'INVALID_FILE_TYPE'
        )
      );
    }

    if (file.size > maxSize) {
      return next(
        new AppError(
          `File ${file.originalname} is too large. Maximum size is 5MB`,
          413,
          'FILE_TOO_LARGE'
        )
      );
    }
  }

  next();
};

/**
 * Optional file validation (doesn't fail if no file)
 */
export const optionalImageValidation = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  validateImage(req, res, next);
};

export const optionalDocumentValidation = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  validateDocument(req, res, next);
};
