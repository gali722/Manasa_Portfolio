# Server Scripts

This directory contains utility scripts for server management and security.

## Available Scripts

### seedDatabase.js

Database seeding script for initializing the portfolio with sample data and admin user.

**Seed Database:**

```bash
npm run seed
# or
node scripts/seedDatabase.js
```

**What it does:**

- Creates an admin user with default credentials
- Seeds profile information
- Adds sample skills across multiple categories
- Creates example projects
- Adds work experience entries
- Includes education history
- Adds professional certifications
- Creates testimonials

**Default Admin Credentials:**

- Email: `galimanasa3@gmail.com`
- Password: `Admin@123`

⚠️ **IMPORTANT:** Change the admin password immediately after first login!

**Prerequisites:**

- MongoDB connection configured in `.env`
- `MONGODB_URI` environment variable set

**Notes:**

- This script will clear all existing data before seeding
- Use with caution in production environments
- Recommended for initial setup and development only

### encryptData.js

CLI tool for encrypting sensitive data and managing encryption keys.

**Generate Encryption Key:**

```bash
node scripts/encryptData.js --generate-key
```

**Encrypt Email Password:**

```bash
node scripts/encryptData.js --encrypt-email-password
```

**Encrypt Custom Data:**

```bash
node scripts/encryptData.js "your-secret-data"
```

**Help:**

```bash
node scripts/encryptData.js --help
```

## Usage Notes

- Always run scripts from the server directory
- Ensure `.env` file is configured before running encryption scripts
- Never commit encrypted values to version control without proper key management
- Keep encryption keys secure and separate from the codebase

## Security Best Practices

1. Generate unique encryption keys for each environment
2. Store encryption keys in secure environment variables
3. Rotate encryption keys periodically
4. Use encrypted values for all sensitive configuration
5. Test encryption/decryption before deploying to production
