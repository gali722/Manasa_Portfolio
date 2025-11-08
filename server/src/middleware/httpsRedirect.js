/**
 * Middleware to enforce HTTPS in production
 * Redirects HTTP requests to HTTPS
 */
export const enforceHTTPS = (req, res, next) => {
  // Only enforce in production
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }
  
  // Check if request is already secure
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    return next();
  }
  
  // Redirect to HTTPS
  const httpsUrl = `https://${req.headers.host}${req.url}`;
  res.redirect(301, httpsUrl);
};

/**
 * Middleware to add additional security headers
 */
export const additionalSecurityHeaders = (req, res, next) => {
  // Prevent caching of sensitive data
  if (req.path.includes('/admin') || req.path.includes('/auth')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Permissions Policy (formerly Feature Policy)
  res.setHeader('Permissions-Policy', 
    'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
  );
  
  next();
};

/**
 * Middleware to set secure cookie options
 */
export const secureCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  };
};

export default {
  enforceHTTPS,
  additionalSecurityHeaders,
  secureCookieOptions,
};
