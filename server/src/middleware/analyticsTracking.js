import Analytics from '../models/Analytics.js';

/**
 * Middleware to track page views
 */
export const trackPageView = async (req, res, next) => {
  try {
    // Track page view asynchronously (don't block the request)
    Analytics.incrementCounter('pageViews').catch((error) => {
      console.error('Error tracking page view:', error);
    });

    next();
  } catch (error) {
    // Don't fail the request if analytics tracking fails
    console.error('Error in analytics tracking middleware:', error);
    next();
  }
};

/**
 * Middleware to track section views
 */
export const trackSectionView = (section) => {
  return async (req, res, next) => {
    try {
      // Track section view asynchronously
      Analytics.incrementCounter('sections', section).catch((error) => {
        console.error(`Error tracking ${section} section view:`, error);
      });

      next();
    } catch (error) {
      console.error('Error in section tracking middleware:', error);
      next();
    }
  };
};

/**
 * Track resume download
 */
export const trackResumeDownload = async () => {
  try {
    await Analytics.incrementCounter('resumeDownloads');
  } catch (error) {
    console.error('Error tracking resume download:', error);
  }
};

/**
 * Track contact form submission
 */
export const trackContactFormSubmission = async () => {
  try {
    await Analytics.incrementCounter('contactFormSubmissions');
  } catch (error) {
    console.error('Error tracking contact form submission:', error);
  }
};
