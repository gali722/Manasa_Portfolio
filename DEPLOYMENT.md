# Deployment Guide

This guide covers deploying the Manasa Gali Portfolio application to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

1. **MongoDB Atlas Account** - Database is already configured
   - Cluster: `cluster0.dnkaath.mongodb.net`
   - Database: `portfolio`
   - User: `galimanasa3_db_user`

2. **Gmail App Password** - For email functionality
   - Email: `galimanasa3@gmail.com`
   - App Password: Available in design document

3. **Hosting Accounts**
   - Backend: Railway, Render, or Heroku
   - Frontend: Vercel or Netlify

4. **Domain Name** (Optional)
   - Example: `manasagali.com`
   - API subdomain: `api.manasagali.com`

## Environment Configuration

### Backend Environment Variables

Create these environment variables in your hosting service:

```bash
NODE_ENV=production
PORT=5000

# MongoDB Atlas
MONGODB_URI=mongodb+srv://galimanasa3_db_user:smVLcE2OvnypjpPK@cluster0.dnkaath.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=portfolio

# JWT Secrets (Generate strong random strings)
JWT_SECRET=<generate-strong-secret-32-chars-minimum>
JWT_REFRESH_SECRET=<generate-strong-secret-32-chars-minimum>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Encryption Key (Generate with: node scripts/encryptData.js --generate-key)
ENCRYPTION_KEY=<64-character-hex-string>

# Email Configuration
EMAIL_USER=galimanasa3@gmail.com
EMAIL_APP_PASSWORD=dvho uffq zvqd ycgt
EMAIL_FROM_NAME=Manasa Gali
EMAIL_FROM_ADDRESS=galimanasa3@gmail.com

# Frontend URL (Update with your domain)
FRONTEND_URL=https://manasagali.com
CORS_ORIGIN=https://manasagali.com

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Security
TRUST_PROXY=true
```

### Frontend Environment Variables

Create these environment variables in your hosting service:

```bash
VITE_API_URL=https://api.manasagali.com
VITE_SITE_URL=https://manasagali.com
VITE_APP_NAME=Manasa Gali Portfolio
```

### Generating Secure Secrets

**Generate Encryption Key:**

```bash
cd server
node scripts/encryptData.js --generate-key
```

**Generate JWT Secrets:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Encrypt Email Password (Optional):**

```bash
cd server
node scripts/encryptData.js --encrypt-email-password
```

## Backend Deployment

### Option 1: Railway

1. **Install Railway CLI:**

   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway:**

   ```bash
   railway login
   ```

3. **Initialize Project:**

   ```bash
   cd server
   railway init
   ```

4. **Set Environment Variables:**

   ```bash
   railway variables set NODE_ENV=production
   railway variables set MONGODB_URI="mongodb+srv://..."
   # Set all other variables from the list above
   ```

5. **Deploy:**

   ```bash
   railway up
   ```

6. **Get Deployment URL:**
   ```bash
   railway domain
   ```

### Option 2: Render

1. **Create New Web Service** on [Render Dashboard](https://dashboard.render.com/)

2. **Connect Repository:**
   - Connect your GitHub repository
   - Select the `server` directory as root

3. **Configure Service:**
   - **Name:** manasa-portfolio-api
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free or Starter

4. **Add Environment Variables:**
   - Go to Environment tab
   - Add all variables from the list above

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete

### Option 3: Heroku

1. **Install Heroku CLI:**

   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku:**

   ```bash
   heroku login
   ```

3. **Create App:**

   ```bash
   cd server
   heroku create manasa-portfolio-api
   ```

4. **Set Environment Variables:**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="mongodb+srv://..."
   # Set all other variables
   ```

5. **Deploy:**
   ```bash
   git subtree push --prefix server heroku main
   ```

### Backend Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB Atlas connection tested
- [ ] Email service credentials verified
- [ ] CORS origin set to frontend URL
- [ ] File upload directory configured
- [ ] API endpoints accessible
- [ ] Health check endpoint working

## Frontend Deployment

### Option 1: Vercel

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**

   ```bash
   vercel login
   ```

3. **Deploy:**

   ```bash
   cd client
   vercel
   ```

4. **Configure Project:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Set Environment Variables:**
   - Go to Project Settings > Environment Variables
   - Add:
     - `VITE_API_URL`: Your backend URL
     - `VITE_SITE_URL`: Your frontend URL
     - `VITE_APP_NAME`: Manasa Gali Portfolio

6. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Install Netlify CLI:**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**

   ```bash
   netlify login
   ```

3. **Initialize Site:**

   ```bash
   cd client
   netlify init
   ```

4. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Set Environment Variables:**

   ```bash
   netlify env:set VITE_API_URL "https://api.manasagali.com"
   netlify env:set VITE_SITE_URL "https://manasagali.com"
   netlify env:set VITE_APP_NAME "Manasa Gali Portfolio"
   ```

6. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

### Frontend Deployment Checklist

- [ ] Environment variables configured
- [ ] API URL points to production backend
- [ ] Build completes successfully
- [ ] Static assets loading correctly
- [ ] Routing works (SPA fallback configured)
- [ ] Custom domain configured (if applicable)

## Custom Domain Setup

### Backend Domain (api.manasagali.com)

**For Railway:**

1. Go to your service settings
2. Click "Settings" > "Domains"
3. Add custom domain: `api.manasagali.com`
4. Add CNAME record in your DNS:
   - Name: `api`
   - Value: `<your-railway-domain>`

**For Render:**

1. Go to service settings
2. Click "Custom Domain"
3. Add: `api.manasagali.com`
4. Add CNAME record in your DNS:
   - Name: `api`
   - Value: `<your-render-domain>`

### Frontend Domain (manasagali.com)

**For Vercel:**

1. Go to Project Settings > Domains
2. Add domain: `manasagali.com`
3. Add DNS records:
   - Type: A, Name: @, Value: `76.76.21.21`
   - Type: CNAME, Name: www, Value: `cname.vercel-dns.com`

**For Netlify:**

1. Go to Site Settings > Domain Management
2. Add custom domain: `manasagali.com`
3. Add DNS records:
   - Type: A, Name: @, Value: `75.2.60.5`
   - Type: CNAME, Name: www, Value: `<your-site>.netlify.app`

## Post-Deployment Verification

### Automated Verification Script

Run the verification script:

```bash
node scripts/verify-deployment.js
```

### Manual Verification Checklist

#### Public Portfolio Features

- [ ] Homepage loads correctly
- [ ] Profile photo displays
- [ ] Professional summary visible
- [ ] Skills section displays with categories
- [ ] Projects section shows all projects
- [ ] Project search and filter work
- [ ] Experience timeline displays
- [ ] Education section visible
- [ ] Certifications display
- [ ] Testimonials carousel works
- [ ] Contact form submits successfully
- [ ] Resume download works
- [ ] Social media links work
- [ ] Theme toggle switches between light/dark
- [ ] All images load correctly
- [ ] Responsive design works on mobile
- [ ] Page load time < 3 seconds

#### Admin Features

- [ ] Admin login page accessible
- [ ] Login with credentials works
- [ ] Dashboard loads after login
- [ ] Profile management page works
- [ ] Can update profile information
- [ ] Can upload profile photo
- [ ] Can upload resume
- [ ] Skills management works (CRUD)
- [ ] Projects management works (CRUD)
- [ ] Experience management works (CRUD)
- [ ] Education management works (CRUD)
- [ ] Certifications management works (CRUD)
- [ ] Testimonials management works (CRUD)
- [ ] Analytics dashboard displays data
- [ ] Settings page accessible
- [ ] Logout works correctly

#### Email Functionality

- [ ] Contact form sends email to admin
- [ ] Visitor receives confirmation email
- [ ] Email templates render correctly
- [ ] Reply-to address is correct

#### Performance & SEO

- [ ] Run Lighthouse audit (target: 90+ score)
- [ ] Check Core Web Vitals
- [ ] Verify meta tags
- [ ] Check structured data
- [ ] Verify sitemap.xml accessible
- [ ] Verify robots.txt accessible

#### Security

- [ ] HTTPS enabled
- [ ] Security headers present
- [ ] CORS configured correctly
- [ ] Rate limiting works
- [ ] File upload validation works
- [ ] XSS protection active
- [ ] Authentication tokens secure

## Troubleshooting

### Backend Issues

**Database Connection Fails:**

```bash
# Check MongoDB Atlas IP whitelist
# Add 0.0.0.0/0 for all IPs or specific hosting provider IPs
```

**Email Not Sending:**

```bash
# Verify Gmail app password is correct
# Check if 2FA is enabled on Gmail account
# Verify EMAIL_APP_PASSWORD environment variable
```

**CORS Errors:**

```bash
# Verify CORS_ORIGIN matches frontend URL exactly
# Check FRONTEND_URL environment variable
# Ensure no trailing slashes in URLs
```

**File Upload Fails:**

```bash
# Check UPLOAD_DIR exists and is writable
# Verify MAX_FILE_SIZE is set correctly
# Check hosting provider file system permissions
```

### Frontend Issues

**API Calls Fail:**

```bash
# Verify VITE_API_URL is correct
# Check backend is running and accessible
# Verify CORS is configured on backend
```

**Build Fails:**

```bash
# Clear node_modules and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Environment Variables Not Working:**

```bash
# Ensure variables start with VITE_
# Rebuild after changing environment variables
# Check hosting provider environment variable syntax
```

### Performance Issues

**Slow Page Load:**

```bash
# Enable compression on backend
# Optimize images (use WebP format)
# Enable CDN for static assets
# Check database query performance
```

**High Memory Usage:**

```bash
# Check for memory leaks
# Optimize database queries
# Reduce image sizes
# Enable pagination for large datasets
```

## Monitoring & Maintenance

### Recommended Monitoring Tools

1. **Uptime Monitoring:**
   - UptimeRobot (free)
   - Pingdom
   - StatusCake

2. **Error Tracking:**
   - Sentry (optional)
   - LogRocket (optional)

3. **Analytics:**
   - Built-in analytics dashboard
   - Google Analytics (optional)

### Regular Maintenance Tasks

- **Weekly:**
  - Check error logs
  - Review analytics data
  - Test contact form
  - Verify email functionality

- **Monthly:**
  - Update dependencies
  - Review security advisories
  - Backup database
  - Check SSL certificate expiry

- **Quarterly:**
  - Run Lighthouse audit
  - Review and optimize performance
  - Update content
  - Test all features end-to-end

## Rollback Procedure

If deployment fails or issues arise:

1. **Backend Rollback:**

   ```bash
   # Railway
   railway rollback

   # Render
   # Use dashboard to rollback to previous deployment

   # Heroku
   heroku rollback
   ```

2. **Frontend Rollback:**

   ```bash
   # Vercel
   vercel rollback

   # Netlify
   # Use dashboard to rollback to previous deployment
   ```

3. **Database Rollback:**
   - Restore from MongoDB Atlas backup
   - Use backup/restore feature in admin panel

## Support

For issues or questions:

- Email: galimanasa3@gmail.com
- Check logs in hosting provider dashboard
- Review error messages in browser console
- Check network tab for API errors

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
