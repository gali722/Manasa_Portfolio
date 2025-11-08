/**
 * Cache Control Middleware
 * Sets appropriate cache headers for different types of responses
 */

/**
 * Cache static assets for a long time
 */
export const cacheStatic = (req, res, next) => {
  // Cache for 1 year
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  next();
};

/**
 * Cache API responses for a short time
 */
export const cacheAPI = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Cache for specified duration (default 5 minutes)
    res.set('Cache-Control', `public, max-age=${duration}, must-revalidate`);
    res.set('ETag', `W/"${Date.now()}"`);
    next();
  };
};

/**
 * No cache for sensitive or dynamic data
 */
export const noCache = (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
};

/**
 * Cache public data for moderate time
 */
export const cachePublic = (duration = 600) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    // Cache for specified duration (default 10 minutes)
    res.set('Cache-Control', `public, max-age=${duration}, s-maxage=${duration * 2}`);
    res.set('Vary', 'Accept-Encoding');
    next();
  };
};

/**
 * Conditional caching based on authentication
 */
export const conditionalCache = (publicDuration = 600, privateDuration = 60) => {
  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    // If authenticated, use shorter cache
    if (req.user) {
      res.set('Cache-Control', `private, max-age=${privateDuration}`);
    } else {
      res.set('Cache-Control', `public, max-age=${publicDuration}`);
    }
    next();
  };
};
