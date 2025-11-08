# Security Implementation Guide

This document outlines the security features implemented in the Manasa Portfolio backend API.

## Table of Contents

1. [Security Features](#security-features)
2. [Configuration](#configuration)
3. [Best Practices](#best-practices)
4. [Security Checklist](#security-checklist)

## Security Features

### 1. Input Validation and Sanitization

**Implementation:**

- Express-validator for comprehensive input validation
- Sanitize-html for rich text content sanitization
- XSS protection middleware for all user inputs
- MongoDB injection prevention through Mongoose

**Files:**

- `src/middleware/validation.js` - Validation schemas for all endpoints
- `src/middleware/xssProtection.js` - XSS protection middleware

**Usage:**

```javascript
import { validateContactForm } from './middleware/validation.js';
router.post('/contact', validateContactForm, submitContactForm);
```

### 2. Data Encryption

**Implementation:**

- AES-256-CBC encryption for sensitive data
- Encrypted email credentials
- Secure key management through environment variables

**Files:**

- `src/utils/encryption.js` - Core encryption/decryption functions
- `src/utils/configEncryption.js` - Configuration encryption utilities
- `scripts/encryptData.js` - CLI tool for encrypting data

**Generate Encryption Key:**

```bash
node scripts/encryptData.js --generate-key
```

**Encrypt Email Password:**

```bash
node scripts/encryptData.js --encrypt-email-password
```

### 3. HTTPS and Security Headers

**Implementation:**

- Helmet middleware for security headers
- HTTPS enforcement in production
- HSTS with preload
- Content Security Policy (CSP)
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options (MIME sniffing protection)
- Referrer Policy
- Permissions Policy

**Files:**

- `src/middleware/httpsRedirect.js` - HTTPS enforcement and additional headers
- `src/server.js` - Helmet configuration

**Security Headers Applied:**

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()...
Content-Security-Policy: default-src 'self'; ...
```

### 4. Authentication and Authorization

**Implementation:**

- JWT-based authentication
- Bcrypt password hashing (12 rounds)
- Secure session management
- Protected routes with authentication middleware

**Files:**

- `src/middleware/auth.js` - Authentication middleware
- `src/controllers/authController.js` - Authentication logic
- `src/utils/jwt.js` - JWT utilities

### 5. Rate Limiting

**Implementation:**

- API-wide rate limiting (100 requests/15 min)
- Authentication endpoint limiting (5 attempts/15 min)
- Contact form limiting (5 submissions/hour)

**Files:**

- `src/middleware/rateLimiter.js` - Rate limiting configuration

### 6. CORS Configuration

**Implementation:**

- Whitelist-based origin validation
- Credentials support
- Preflight caching
- Secure methods and headers

**Configuration:**

```javascript
// In .env
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

### 7. File Upload Security

**Implementation:**

- File type validation (whitelist)
- File size limits
- Secure file storage
- Filename sanitization

**Files:**

- `src/middleware/fileValidation.js` - File validation
- `src/config/multer.js` - Multer configuration

## Configuration

### Environment Variables

Required security-related environment variables:

```bash
# Encryption (64 hex characters - 32 bytes)
ENCRYPTION_KEY=your_64_character_hex_key_here

# JWT Secrets (minimum 32 characters)
JWT_SECRET=your_strong_jwt_secret_here
JWT_REFRESH_SECRET=your_strong_refresh_secret_here

# Email (can be encrypted)
EMAIL_APP_PASSWORD=your_encrypted_or_plain_password

# CORS
CORS_ORIGIN=https://yourdomain.com

# Production
NODE_ENV=production
```

### Generate Secure Secrets

**Encryption Key:**

```bash
node scripts/encryptData.js --generate-key
```

**JWT Secrets:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Best Practices

### 1. Environment Variables

- ✅ Never commit `.env` files to version control
- ✅ Use different secrets for development and production
- ✅ Rotate secrets periodically
- ✅ Use strong, random secrets (minimum 32 characters)
- ✅ Encrypt sensitive values before storing

### 2. Password Security

- ✅ Minimum 8 characters
- ✅ Require uppercase, lowercase, and numbers
- ✅ Hash with bcrypt (12+ rounds)
- ✅ Never log or expose passwords
- ✅ Implement account lockout after failed attempts

### 3. API Security

- ✅ Validate all inputs on the server side
- ✅ Sanitize user-generated content
- ✅ Use parameterized queries (Mongoose handles this)
- ✅ Implement rate limiting
- ✅ Log security events
- ✅ Keep dependencies updated

### 4. HTTPS/TLS

- ✅ Use HTTPS in production
- ✅ Enable HSTS
- ✅ Use TLS 1.2 or higher
- ✅ Obtain certificates from trusted CA
- ✅ Implement certificate pinning (optional)

### 5. Error Handling

- ✅ Don't expose stack traces in production
- ✅ Use generic error messages for authentication
- ✅ Log detailed errors server-side
- ✅ Implement proper error monitoring

### 6. Database Security

- ✅ Use encrypted connections
- ✅ Implement proper access controls
- ✅ Regular backups
- ✅ Use database indexes for performance
- ✅ Sanitize queries to prevent injection

## Security Checklist

### Pre-Deployment

- [ ] Generate new encryption key for production
- [ ] Generate new JWT secrets for production
- [ ] Encrypt email password
- [ ] Update CORS_ORIGIN to production domain
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Review and update CSP directives
- [ ] Test rate limiting
- [ ] Verify input validation on all endpoints
- [ ] Check file upload restrictions
- [ ] Review error messages (no sensitive data)
- [ ] Enable security logging
- [ ] Set up monitoring and alerts

### Post-Deployment

- [ ] Verify HTTPS is working
- [ ] Test HSTS headers
- [ ] Verify CORS configuration
- [ ] Test authentication flow
- [ ] Verify rate limiting is active
- [ ] Check security headers with tools:
  - [Security Headers](https://securityheaders.com/)
  - [SSL Labs](https://www.ssllabs.com/ssltest/)
  - [Mozilla Observatory](https://observatory.mozilla.org/)
- [ ] Run vulnerability scan
- [ ] Monitor logs for suspicious activity
- [ ] Set up automated security updates

### Regular Maintenance

- [ ] Rotate secrets every 90 days
- [ ] Update dependencies monthly
- [ ] Review access logs weekly
- [ ] Audit user accounts quarterly
- [ ] Test backup restoration quarterly
- [ ] Review and update security policies annually

## Security Incident Response

If you discover a security vulnerability:

1. **Do not** disclose it publicly
2. Document the issue with steps to reproduce
3. Assess the severity and impact
4. Develop and test a fix
5. Deploy the fix as soon as possible
6. Notify affected users if necessary
7. Document the incident and response

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

## Contact

For security concerns, please contact: galimanasa3@gmail.com
