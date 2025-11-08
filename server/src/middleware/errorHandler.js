/**
 * Custom Error Class
 */
export class AppError extends Error {
  constructor(message, statusCode, code = 'ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.code = err.code || 'INTERNAL_SERVER_ERROR';

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.statusCode = 404;
    error.code = 'INVALID_ID';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field} already exists`;
    error.statusCode = 409;
    error.code = 'DUPLICATE_ENTRY';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error.message = messages.join(', ');
    error.statusCode = 422;
    error.code = 'VALIDATION_ERROR';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
    error.code = 'INVALID_TOKEN';
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
    error.code = 'TOKEN_EXPIRED';
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error.message = 'File size too large';
      error.statusCode = 413;
      error.code = 'FILE_TOO_LARGE';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      error.message = 'Unexpected file field';
      error.statusCode = 400;
      error.code = 'INVALID_FILE_FIELD';
    } else {
      error.message = 'File upload error';
      error.statusCode = 400;
      error.code = 'FILE_UPLOAD_ERROR';
    }
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    error: {
      code: error.code,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err,
      }),
    },
  });
};

export default errorHandler;
