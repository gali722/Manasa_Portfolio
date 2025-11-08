import { body, param, query, validationResult } from 'express-validator';
import sanitizeHtml from 'sanitize-html';

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
          value: err.value,
        })),
      },
    });
  }
  next();
};

/**
 * Sanitize HTML content to prevent XSS
 */
export const sanitizeHtmlContent = (value) => {
  if (!value) return value;
  
  return sanitizeHtml(value, {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre'
    ],
    allowedAttributes: {
      'a': ['href', 'target', 'rel'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      'a': (tagName, attribs) => {
        return {
          tagName: 'a',
          attribs: {
            ...attribs,
            rel: 'noopener noreferrer',
            target: '_blank',
          },
        };
      },
    },
  });
};

/**
 * Custom sanitizer for rich text fields
 */
export const sanitizeRichText = (value) => {
  if (!value) return value;
  return sanitizeHtmlContent(value);
};

/**
 * Validation schemas for authentication
 */
export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  handleValidationErrors,
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Passwords do not match'),
  handleValidationErrors,
];

/**
 * Validation schemas for profile
 */
export const validateProfile = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .escape(),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters')
    .escape(),
  body('summary')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Summary cannot exceed 5000 characters')
    .customSanitizer(sanitizeRichText),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Please provide a valid phone number')
    .isLength({ max: 20 })
    .withMessage('Phone number cannot exceed 20 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters')
    .escape(),
  body('socialLinks.linkedin')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Please provide a valid LinkedIn URL'),
  body('socialLinks.github')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Please provide a valid GitHub URL'),
  body('socialLinks.twitter')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Please provide a valid Twitter URL'),
  body('socialLinks.medium')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Please provide a valid Medium URL'),
  body('socialLinks.stackoverflow')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Please provide a valid Stack Overflow URL'),
  body('yearsOfExperience')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Years of experience must be between 0 and 50'),
  handleValidationErrors,
];

/**
 * Validation schemas for skills
 */
export const validateSkill = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Skill name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Skill name must be between 1 and 100 characters')
    .escape(),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Category must be between 1 and 100 characters')
    .escape(),
  body('proficiency')
    .notEmpty()
    .withMessage('Proficiency is required')
    .isInt({ min: 0, max: 100 })
    .withMessage('Proficiency must be between 0 and 100'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Icon cannot exceed 200 characters'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a positive integer'),
  body('isVisible')
    .optional()
    .isBoolean()
    .withMessage('isVisible must be a boolean'),
  handleValidationErrors,
];

export const validateSkillUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Skill name must be between 1 and 100 characters')
    .escape(),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Category must be between 1 and 100 characters')
    .escape(),
  body('proficiency')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Proficiency must be between 0 and 100'),
  body('icon')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Icon cannot exceed 200 characters'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a positive integer'),
  body('isVisible')
    .optional()
    .isBoolean()
    .withMessage('isVisible must be a boolean'),
  handleValidationErrors,
];

/**
 * Validation schemas for projects
 */
export const validateProject = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters')
    .escape(),
  body('shortDescription')
    .trim()
    .notEmpty()
    .withMessage('Short description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Short description must be between 10 and 500 characters')
    .escape(),
  body('fullDescription')
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage('Full description cannot exceed 10000 characters')
    .customSanitizer(sanitizeRichText),
  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),
  body('technologies.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each technology name cannot exceed 50 characters')
    .escape(),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category cannot exceed 100 characters')
    .escape(),
  body('links.live')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Please provide a valid live demo URL'),
  body('links.github')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Please provide a valid GitHub URL'),
  body('links.demo')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Please provide a valid demo URL'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),
  handleValidationErrors,
];

/**
 * Validation schemas for experience
 */
export const validateExperience = [
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Company name must be between 2 and 200 characters')
    .escape(),
  body('position')
    .trim()
    .notEmpty()
    .withMessage('Position is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Position must be between 2 and 200 characters')
    .escape(),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters')
    .escape(),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Please provide a valid start date'),
  body('endDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Please provide a valid end date'),
  body('isCurrent')
    .optional()
    .isBoolean()
    .withMessage('isCurrent must be a boolean'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description cannot exceed 5000 characters')
    .customSanitizer(sanitizeRichText),
  body('responsibilities')
    .optional()
    .isArray()
    .withMessage('Responsibilities must be an array'),
  body('responsibilities.*')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Each responsibility cannot exceed 500 characters')
    .escape(),
  body('achievements')
    .optional()
    .isArray()
    .withMessage('Achievements must be an array'),
  body('achievements.*')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Each achievement cannot exceed 500 characters')
    .escape(),
  body('technologies')
    .optional()
    .isArray()
    .withMessage('Technologies must be an array'),
  body('technologies.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each technology name cannot exceed 50 characters')
    .escape(),
  handleValidationErrors,
];

/**
 * Validation schemas for education
 */
export const validateEducation = [
  body('institution')
    .trim()
    .notEmpty()
    .withMessage('Institution name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Institution name must be between 2 and 200 characters')
    .escape(),
  body('degree')
    .trim()
    .notEmpty()
    .withMessage('Degree is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Degree must be between 2 and 200 characters')
    .escape(),
  body('field')
    .trim()
    .notEmpty()
    .withMessage('Field of study is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Field must be between 2 and 200 characters')
    .escape(),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters')
    .escape(),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid start date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid end date'),
  body('gpa')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('GPA cannot exceed 20 characters')
    .escape(),
  body('coursework')
    .optional()
    .isArray()
    .withMessage('Coursework must be an array'),
  body('coursework.*')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Each course cannot exceed 200 characters')
    .escape(),
  body('achievements')
    .optional()
    .isArray()
    .withMessage('Achievements must be an array'),
  body('achievements.*')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Each achievement cannot exceed 500 characters')
    .escape(),
  handleValidationErrors,
];

/**
 * Validation schemas for certifications
 */
export const validateCertification = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Certification name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Certification name must be between 2 and 200 characters')
    .escape(),
  body('issuer')
    .trim()
    .notEmpty()
    .withMessage('Issuer is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Issuer must be between 2 and 200 characters')
    .escape(),
  body('issueDate')
    .notEmpty()
    .withMessage('Issue date is required')
    .isISO8601()
    .withMessage('Please provide a valid issue date'),
  body('expiryDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Please provide a valid expiry date'),
  body('credentialId')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Credential ID cannot exceed 200 characters')
    .escape(),
  body('verificationUrl')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Please provide a valid verification URL'),
  handleValidationErrors,
];

/**
 * Validation schemas for testimonials
 */
export const validateTestimonial = [
  body('authorName')
    .trim()
    .notEmpty()
    .withMessage('Author name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Author name must be between 2 and 100 characters')
    .escape(),
  body('authorTitle')
    .trim()
    .notEmpty()
    .withMessage('Author title is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Author title must be between 2 and 200 characters')
    .escape(),
  body('authorCompany')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Author company cannot exceed 200 characters')
    .escape(),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Testimonial content is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Content must be between 10 and 2000 characters')
    .escape(),
  body('linkedinUrl')
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'] })
    .withMessage('Please provide a valid LinkedIn URL'),
  body('relationship')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Relationship cannot exceed 100 characters')
    .escape(),
  body('isVisible')
    .optional()
    .isBoolean()
    .withMessage('isVisible must be a boolean'),
  handleValidationErrors,
];

/**
 * Validation schemas for contact form
 */
export const validateContactForm = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .escape(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters')
    .escape(),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
    .escape(),
  handleValidationErrors,
];

/**
 * Validation for MongoDB ObjectId
 */
export const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors,
];

/**
 * Validation for pagination
 */
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors,
];
