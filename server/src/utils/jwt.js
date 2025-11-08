import jwt from 'jsonwebtoken';

/**
 * Generate access token
 */
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokens = (userId) => {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId),
  };
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    );
    
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }
    
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production'
    );
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
