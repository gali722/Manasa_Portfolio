import sanitizeHtml from 'sanitize-html';

/**
 * Recursively sanitize object properties to prevent XSS attacks
 */
const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    // Basic XSS prevention - escape HTML entities
    return obj
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
};

/**
 * Middleware to sanitize request body, query, and params
 * This provides basic XSS protection by escaping HTML entities
 */
export const xssProtection = (req, res, next) => {
  try {
    // Skip sanitization for rich text fields that are handled by validation middleware
    const richTextFields = ['summary', 'description', 'fullDescription', 'content'];
    // Skip sanitization for URL fields and nested objects containing URLs
    const urlFields = ['socialLinks', 'links', 'url', 'verificationUrl', 'linkedinUrl'];
    // Skip sanitization for fields that may contain special characters like / or -
    const specialCharFields = ['gpa', 'credentialId'];
    // Skip sanitization for array fields that may contain special characters
    const arrayFields = ['achievements', 'responsibilities', 'coursework', 'technologies'];
    
    const skipSanitization = (obj, path = '') => {
      if (!obj || typeof obj !== 'object') return false;
      
      for (const field of richTextFields) {
        if (path.endsWith(field) || Object.prototype.hasOwnProperty.call(obj, field)) {
          return true;
        }
      }
      return false;
    };

    // Sanitize body (but skip rich text fields and URL fields as they're handled separately)
    if (req.body && typeof req.body === 'object') {
      const sanitizedBody = {};
      for (const key in req.body) {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) {
          // Skip rich text fields - they're sanitized by validation middleware
          // Skip URL fields - they're validated by validation middleware
          // Skip special char fields - they may contain / or - characters
          // Skip array fields - they're validated by validation middleware
          if (richTextFields.includes(key) || urlFields.includes(key) || specialCharFields.includes(key) || arrayFields.includes(key)) {
            sanitizedBody[key] = req.body[key];
          } else {
            sanitizedBody[key] = sanitizeObject(req.body[key]);
          }
        }
      }
      req.body = sanitizedBody;
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    console.error('XSS Protection Error:', error);
    next(error);
  }
};

/**
 * Sanitize HTML content for rich text fields
 * This allows safe HTML tags while removing dangerous content
 */
export const sanitizeRichTextContent = (content) => {
  if (!content || typeof content !== 'string') {
    return content;
  }

  return sanitizeHtml(content, {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'span', 'div'
    ],
    allowedAttributes: {
      'a': ['href', 'target', 'rel'],
      'span': ['class'],
      'div': ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: {
      a: ['http', 'https', 'mailto']
    },
    transformTags: {
      'a': (tagName, attribs) => {
        return {
          tagName: 'a',
          attribs: {
            href: attribs.href,
            rel: 'noopener noreferrer',
            target: '_blank',
          },
        };
      },
    },
    // Remove any script tags and event handlers
    disallowedTagsMode: 'discard',
    allowedClasses: {
      'span': ['highlight', 'bold', 'italic'],
      'div': ['content', 'section'],
    },
  });
};

export default xssProtection;
