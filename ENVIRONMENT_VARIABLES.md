# Environment Variables Documentation

Complete reference for all environment variables used in the Manasa Gali Portfolio application.

## Table of Contents

- [Overview](#overview)
- [Server Environment Variables](#server-environment-variables)
- [Client Environment Variables](#client-environment-variables)
- [Environment-Specific Configurations](#environment-specific-configurations)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The application uses environment variables to configure different aspects of the system. Variables are stored in `.env` files and should never be committed to version control.

### File Locations

- **Server:** `server/.env`
- **Client:** `client/.env`

### Example Files

- **Server:** `server/.env.example`
- **Client:** `client/.env.example`

## Server Environment Variables

### Application Configuration

#### NODE_ENV

- **Description:** Application environment
- **Type:** String
- **Values:** `development`, `production`, `test`
- **Required:** Yes
- **Default:** `development`
- **Example:** `NODE_ENV=production`

#### PORT

- **Description:** Server port number
- **Type:** Number
- **Required:** No
- **Default:** `5000`
- **Example:** `PORT=5000`

### Database Configuration

#### MONGODB_URI

- **Description:** MongoDB connection string
- **Type:** String (Connection URI)
- **Required:** Yes
- **Format:** `mongodb+srv://username:password@cluster.mongodb.net/database`
- **Example:**
  ```
  MONGODB_URI=mongodb+srv://galimanasa3_db_user:smVLcE2OvnypjpPK@cluster0.dnkaath.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
  ```
- **Notes:**
  - Use MongoDB Atlas for production
  - Use local MongoDB for development: `mongodb://localhost:27017/portfolio`
  - Ensure IP whitelist is configured in MongoDB Atlas

#### DB_NAME

- **Description:** Database name (optional, can be in URI)
- **Type:** String
- **Required:** No
- **Default:** `portfolio`
- **Example:** `DB_NAME=portfolio`

### JWT Configuration

#### JWT_SECRET

- **Description:** Secret key for signing JWT access tokens
- **Type:** String
- **Required:** Yes
- **Security:** Must be strong and unique
- **Generation:** Use `openssl rand -base64 32`
- **Example:** `JWT_SECRET=your-super-secret-jwt-key-here-change-this`
- **Notes:**
  - Minimum 32 characters recommended
  - Use different secrets for dev and production
  - Never share or commit this value

#### JWT_REFRESH_SECRET

- **Description:** Secret key for signing JWT refresh tokens
- **Type:** String
- **Required:** Yes
- **Security:** Must be different from JWT_SECRET
- **Generation:** Use `openssl rand -base64 32`
- **Example:** `JWT_REFRESH_SECRET=your-refresh-token-secret-here-change-this`

#### JWT_EXPIRES_IN

- **Description:** Access token expiration time
- **Type:** String (time format)
- **Required:** No
- **Default:** `15m`
- **Format:** `Xs` (seconds), `Xm` (minutes), `Xh` (hours), `Xd` (days)
- **Example:** `JWT_EXPIRES_IN=15m`
- **Recommended:** 15-30 minutes for security

#### JWT_REFRESH_EXPIRES_IN

- **Description:** Refresh token expiration time
- **Type:** String (time format)
- **Required:** No
- **Default:** `7d`
- **Example:** `JWT_REFRESH_EXPIRES_IN=7d`
- **Recommended:** 7-30 days

### Encryption Configuration

#### ENCRYPTION_KEY

- **Description:** Key for encrypting sensitive data (email passwords, etc.)
- **Type:** String (32-byte hex)
- **Required:** Yes
- **Security:** Critical - must be kept secure
- **Generation:** Use `node scripts/encryptData.js --generate-key`
- **Format:** 64 hexadecimal characters (32 bytes)
- **Example:** `ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`
- **Notes:**
  - Generate unique key for each environment
  - Store securely (use secrets manager in production)
  - Losing this key means losing access to encrypted data

### Email Configuration

#### EMAIL_USER

- **Description:** Gmail email address for sending emails
- **Type:** String (email)
- **Required:** Yes
- **Example:** `EMAIL_USER=galimanasa3@gmail.com`
- **Notes:**
  - Must be a Gmail account
  - 2FA must be enabled
  - App password required (not regular password)

#### EMAIL_APP_PASSWORD

- **Description:** Gmail app password for SMTP authentication
- **Type:** String
- **Required:** Yes
- **Security:** Store encrypted in database after initial setup
- **Example:** `EMAIL_APP_PASSWORD=dvho uffq zvqd ycgt`
- **How to Generate:**
  1. Enable 2-factor authentication on Gmail
  2. Go to Google Account > Security > App Passwords
  3. Generate new app password for "Mail"
  4. Use the 16-character password (with or without spaces)
- **Notes:**
  - This is NOT your regular Gmail password
  - Can be revoked and regenerated anytime
  - Should be encrypted using the encryption utility

#### EMAIL_FROM_NAME

- **Description:** Display name for sent emails
- **Type:** String
- **Required:** No
- **Default:** `Manasa Gali`
- **Example:** `EMAIL_FROM_NAME=Manasa Gali`

#### EMAIL_FROM_ADDRESS

- **Description:** From email address (usually same as EMAIL_USER)
- **Type:** String (email)
- **Required:** No
- **Default:** Value of EMAIL_USER
- **Example:** `EMAIL_FROM_ADDRESS=galimanasa3@gmail.com`

### CORS Configuration

#### CORS_ORIGIN

- **Description:** Allowed origin for CORS requests
- **Type:** String (URL)
- **Required:** Yes
- **Example:**
  - Development: `CORS_ORIGIN=http://localhost:5173`
  - Production: `CORS_ORIGIN=https://manasagali.com`
- **Multiple Origins:** Separate with commas
  ```
  CORS_ORIGIN=https://manasagali.com,https://www.manasagali.com
  ```

#### FRONTEND_URL

- **Description:** Frontend application URL
- **Type:** String (URL)
- **Required:** Yes
- **Example:**
  - Development: `FRONTEND_URL=http://localhost:5173`
  - Production: `FRONTEND_URL=https://manasagali.com`
- **Usage:** Used in emails, redirects, and CORS

### File Upload Configuration

#### MAX_FILE_SIZE

- **Description:** Maximum file upload size in bytes
- **Type:** Number
- **Required:** No
- **Default:** `10485760` (10MB)
- **Example:** `MAX_FILE_SIZE=10485760`
- **Common Values:**
  - 5MB: `5242880`
  - 10MB: `10485760`
  - 20MB: `20971520`

#### UPLOAD_DIR

- **Description:** Directory for storing uploaded files
- **Type:** String (path)
- **Required:** No
- **Default:** `./uploads`
- **Example:** `UPLOAD_DIR=./uploads`
- **Notes:**
  - Relative to server root
  - Must have write permissions
  - Should be outside web root for security

### Rate Limiting Configuration

#### RATE_LIMIT_WINDOW_MS

- **Description:** Rate limit time window in milliseconds
- **Type:** Number
- **Required:** No
- **Default:** `900000` (15 minutes)
- **Example:** `RATE_LIMIT_WINDOW_MS=900000`

#### RATE_LIMIT_MAX_REQUESTS

- **Description:** Maximum requests per window
- **Type:** Number
- **Required:** No
- **Default:** `100`
- **Example:** `RATE_LIMIT_MAX_REQUESTS=100`

### Logging Configuration

#### LOG_LEVEL

- **Description:** Logging level
- **Type:** String
- **Required:** No
- **Default:** `info`
- **Values:** `error`, `warn`, `info`, `debug`
- **Example:** `LOG_LEVEL=info`

## Client Environment Variables

### API Configuration

#### VITE_API_URL

- **Description:** Backend API base URL
- **Type:** String (URL)
- **Required:** Yes
- **Example:**
  - Development: `VITE_API_URL=http://localhost:5000/api`
  - Production: `VITE_API_URL=https://api.manasagali.com/api`
- **Notes:**
  - Must include `/api` path
  - No trailing slash
  - Must match server CORS configuration

### Application Configuration

#### VITE_SITE_URL

- **Description:** Frontend application URL
- **Type:** String (URL)
- **Required:** Yes
- **Example:**
  - Development: `VITE_SITE_URL=http://localhost:5173`
  - Production: `VITE_SITE_URL=https://manasagali.com`
- **Usage:** Used for SEO, social sharing, canonical URLs

#### VITE_APP_NAME

- **Description:** Application name
- **Type:** String
- **Required:** No
- **Default:** `Manasa Gali Portfolio`
- **Example:** `VITE_APP_NAME=Manasa Gali Portfolio`
- **Usage:** Page titles, meta tags, branding

### Analytics Configuration (Optional)

#### VITE_GA_TRACKING_ID

- **Description:** Google Analytics tracking ID
- **Type:** String
- **Required:** No
- **Format:** `G-XXXXXXXXXX` or `UA-XXXXXXXXX-X`
- **Example:** `VITE_GA_TRACKING_ID=G-XXXXXXXXXX`
- **Notes:**
  - Only needed if using Google Analytics
  - Get from Google Analytics dashboard

### Feature Flags (Optional)

#### VITE_ENABLE_ANALYTICS

- **Description:** Enable/disable analytics tracking
- **Type:** Boolean
- **Required:** No
- **Default:** `true`
- **Example:** `VITE_ENABLE_ANALYTICS=true`

#### VITE_ENABLE_SERVICE_WORKER

- **Description:** Enable/disable service worker for PWA
- **Type:** Boolean
- **Required:** No
- **Default:** `false`
- **Example:** `VITE_ENABLE_SERVICE_WORKER=true`

## Environment-Specific Configurations

### Development Environment

**Server (.env):**

```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=dev-jwt-secret-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
ENCRYPTION_KEY=generate-with-encryption-script
EMAIL_USER=galimanasa3@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password
EMAIL_FROM_NAME=Manasa Gali
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
LOG_LEVEL=debug
```

**Client (.env):**

```bash
VITE_API_URL=http://localhost:5000/api
VITE_SITE_URL=http://localhost:5173
VITE_APP_NAME=Manasa Gali Portfolio
VITE_ENABLE_ANALYTICS=false
```

### Production Environment

**Server (.env):**

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=strong-random-secret-32-chars-minimum
JWT_REFRESH_SECRET=different-strong-random-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
ENCRYPTION_KEY=production-encryption-key-32-bytes
EMAIL_USER=galimanasa3@gmail.com
EMAIL_APP_PASSWORD=encrypted-app-password
EMAIL_FROM_NAME=Manasa Gali
CORS_ORIGIN=https://manasagali.com,https://www.manasagali.com
FRONTEND_URL=https://manasagali.com
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
LOG_LEVEL=info
```

**Client (.env.production):**

```bash
VITE_API_URL=https://api.manasagali.com/api
VITE_SITE_URL=https://manasagali.com
VITE_APP_NAME=Manasa Gali Portfolio
VITE_ENABLE_ANALYTICS=true
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

## Security Best Practices

### General Security

1. **Never Commit .env Files**
   - Add `.env` to `.gitignore`
   - Use `.env.example` for documentation
   - Never include actual secrets in example files

2. **Use Strong Secrets**
   - Minimum 32 characters for JWT secrets
   - Use cryptographically secure random generation
   - Different secrets for each environment

3. **Rotate Secrets Regularly**
   - Change JWT secrets every 90 days
   - Rotate encryption keys annually
   - Update email app passwords periodically

4. **Secure Storage**
   - Use environment variables in production
   - Consider secrets management services (AWS Secrets Manager, etc.)
   - Encrypt sensitive values in database

### Environment-Specific Security

#### Development

- Use different secrets than production
- Can use simpler secrets for convenience
- Still avoid committing to version control

#### Production

- Use strong, unique secrets
- Store in secure secrets manager
- Enable all security features
- Use HTTPS for all URLs
- Whitelist specific IPs in MongoDB Atlas

### Access Control

1. **Limit Access**
   - Only necessary team members should have access
   - Use role-based access for secrets
   - Audit access logs regularly

2. **Backup Secrets**
   - Keep encrypted backup of production secrets
   - Store in secure location (not in repository)
   - Document recovery procedures

## Troubleshooting

### Common Issues

#### "MongoDB connection failed"

- **Check:** MONGODB_URI is correct
- **Check:** IP address is whitelisted in MongoDB Atlas
- **Check:** Database user has correct permissions
- **Check:** Network connectivity

#### "JWT malformed" or "Invalid token"

- **Check:** JWT_SECRET matches between environments
- **Check:** Token hasn't expired
- **Check:** Token format is correct
- **Solution:** Clear cookies and login again

#### "Email sending failed"

- **Check:** EMAIL_USER is correct Gmail address
- **Check:** EMAIL_APP_PASSWORD is valid app password (not regular password)
- **Check:** 2FA is enabled on Gmail account
- **Check:** App password hasn't been revoked
- **Solution:** Generate new app password if needed

#### "CORS error"

- **Check:** CORS_ORIGIN matches frontend URL exactly
- **Check:** No trailing slashes in URLs
- **Check:** Protocol (http/https) is correct
- **Solution:** Update CORS_ORIGIN to match frontend

#### "File upload failed"

- **Check:** MAX_FILE_SIZE is sufficient
- **Check:** UPLOAD_DIR exists and has write permissions
- **Check:** File format is supported
- **Solution:** Increase size limit or check permissions

### Validation

#### Check Server Environment

```bash
cd server
node -e "require('dotenv').config(); console.log(process.env.NODE_ENV)"
```

#### Check Client Environment

```bash
cd client
npm run dev
# Check browser console for VITE_ variables
```

#### Test MongoDB Connection

```bash
cd server
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(err => console.error(err))"
```

### Getting Help

If you encounter issues:

1. **Check Logs**
   - Server logs for backend issues
   - Browser console for frontend issues
   - MongoDB Atlas logs for database issues

2. **Verify Configuration**
   - Compare with `.env.example`
   - Check for typos in variable names
   - Ensure all required variables are set

3. **Contact Support**
   - Email: galimanasa3@gmail.com
   - Include error messages
   - Describe steps to reproduce
   - **Never share actual secret values**

## Quick Reference

### Required Server Variables

```bash
NODE_ENV=production
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
ENCRYPTION_KEY=your-encryption-key
EMAIL_USER=your-email
EMAIL_APP_PASSWORD=your-app-password
CORS_ORIGIN=your-frontend-url
FRONTEND_URL=your-frontend-url
```

### Required Client Variables

```bash
VITE_API_URL=your-api-url
VITE_SITE_URL=your-site-url
```

### Generate Secrets

```bash
# JWT Secret
openssl rand -base64 32

# Encryption Key
cd server
node scripts/encryptData.js --generate-key
```

---

**Last Updated:** November 2025

**Version:** 1.0.0

**Support:** galimanasa3@gmail.com
