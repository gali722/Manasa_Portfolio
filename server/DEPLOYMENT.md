# Backend Deployment Guide

This guide covers deploying the backend API to various hosting services.

## Prerequisites

- MongoDB Atlas cluster configured
- Gmail app password generated
- Environment variables prepared
- Code tested locally

## Hosting Service Options

### Option 1: Railway (Recommended)

**Pros:**

- Easy deployment from GitHub
- Automatic HTTPS
- Good free tier
- Built-in monitoring

**Steps:**

1. **Install Railway CLI:**

   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**

   ```bash
   railway login
   ```

3. **Initialize Project:**

   ```bash
   cd server
   railway init
   ```

4. **Link to GitHub (Optional):**
   - Connect your GitHub repository in Railway dashboard
   - Enable automatic deployments

5. **Set Environment Variables:**

   ```bash
   railway variables set NODE_ENV=production
   railway variables set PORT=5000
   railway variables set MONGODB_URI="mongodb+srv://galimanasa3_db_user:smVLcE2OvnypjpPK@cluster0.dnkaath.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0"
   railway variables set DB_NAME=portfolio
   railway variables set JWT_SECRET="<your-secret>"
   railway variables set JWT_REFRESH_SECRET="<your-secret>"
   railway variables set JWT_EXPIRES_IN=15m
   railway variables set JWT_REFRESH_EXPIRES_IN=7d
   railway variables set ENCRYPTION_KEY="<your-64-char-hex>"
   railway variables set EMAIL_USER=galimanasa3@gmail.com
   railway variables set EMAIL_APP_PASSWORD="dvho uffq zvqd ycgt"
   railway variables set EMAIL_FROM_NAME="Manasa Gali"
   railway variables set EMAIL_FROM_ADDRESS=galimanasa3@gmail.com
   railway variables set FRONTEND_URL="<your-frontend-url>"
   railway variables set CORS_ORIGIN="<your-frontend-url>"
   railway variables set MAX_FILE_SIZE=10485760
   railway variables set UPLOAD_DIR=./uploads
   railway variables set TRUST_PROXY=true
   ```

6. **Deploy:**

   ```bash
   railway up
   ```

7. **Get Deployment URL:**

   ```bash
   railway domain
   ```

8. **Add Custom Domain (Optional):**
   - Go to Railway dashboard
   - Click on your service
   - Go to Settings > Domains
   - Add custom domain: `api.manasagali.com`
   - Add CNAME record in your DNS provider

### Option 2: Render

**Pros:**

- Free tier available
- Automatic HTTPS
- Easy GitHub integration
- Good documentation

**Steps:**

1. **Create Account:**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service:**
   - Click "New +" > "Web Service"
   - Connect your repository
   - Select the repository

3. **Configure Service:**
   - **Name:** manasa-portfolio-api
   - **Root Directory:** server
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free or Starter

4. **Add Environment Variables:**
   - Go to "Environment" tab
   - Add all variables from `.env.production.example`
   - Click "Save Changes"

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the deployment URL

6. **Add Custom Domain (Optional):**
   - Go to service settings
   - Click "Custom Domain"
   - Add: `api.manasagali.com`
   - Add CNAME record in your DNS provider

### Option 3: Heroku

**Pros:**

- Mature platform
- Good documentation
- Many add-ons available

**Cons:**

- No free tier (as of 2022)
- More expensive than alternatives

**Steps:**

1. **Install Heroku CLI:**

   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku

   # Or download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login:**

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
   heroku config:set JWT_SECRET="<your-secret>"
   heroku config:set JWT_REFRESH_SECRET="<your-secret>"
   heroku config:set ENCRYPTION_KEY="<your-64-char-hex>"
   heroku config:set EMAIL_USER=galimanasa3@gmail.com
   heroku config:set EMAIL_APP_PASSWORD="dvho uffq zvqd ycgt"
   heroku config:set EMAIL_FROM_NAME="Manasa Gali"
   heroku config:set EMAIL_FROM_ADDRESS=galimanasa3@gmail.com
   heroku config:set FRONTEND_URL="<your-frontend-url>"
   heroku config:set CORS_ORIGIN="<your-frontend-url>"
   heroku config:set MAX_FILE_SIZE=10485760
   heroku config:set UPLOAD_DIR=./uploads
   heroku config:set TRUST_PROXY=true
   ```

5. **Deploy:**

   ```bash
   # If server is in subdirectory
   git subtree push --prefix server heroku main

   # Or if server is root
   git push heroku main
   ```

6. **View Logs:**

   ```bash
   heroku logs --tail
   ```

7. **Add Custom Domain (Optional):**
   ```bash
   heroku domains:add api.manasagali.com
   ```

## Environment Variables Reference

### Required Variables

```bash
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://galimanasa3_db_user:smVLcE2OvnypjpPK@cluster0.dnkaath.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=portfolio

# JWT Authentication
JWT_SECRET=<generate-with-crypto>
JWT_REFRESH_SECRET=<generate-with-crypto>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Encryption
ENCRYPTION_KEY=<generate-with-script>

# Email
EMAIL_USER=galimanasa3@gmail.com
EMAIL_APP_PASSWORD=dvho uffq zvqd ycgt
EMAIL_FROM_NAME=Manasa Gali
EMAIL_FROM_ADDRESS=galimanasa3@gmail.com

# CORS
FRONTEND_URL=https://manasagali.com
CORS_ORIGIN=https://manasagali.com

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Security
TRUST_PROXY=true
```

### Generating Secrets

**JWT Secrets:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Encryption Key:**

```bash
cd server
node scripts/encryptData.js --generate-key
```

## Post-Deployment Verification

### 1. Check Health Endpoint

```bash
curl https://your-api-url.com/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### 2. Test Public Endpoints

```bash
# Profile
curl https://your-api-url.com/api/profile

# Skills
curl https://your-api-url.com/api/skills

# Projects
curl https://your-api-url.com/api/projects
```

### 3. Test CORS

```bash
curl -H "Origin: https://manasagali.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-api-url.com/api/health
```

Should return CORS headers.

### 4. Check Security Headers

```bash
curl -I https://your-api-url.com/api/health
```

Should include:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (if HTTPS)

### 5. Test Authentication

```bash
# Should fail without token
curl https://your-api-url.com/api/admin/profile

# Should return 401 Unauthorized
```

## Monitoring

### Railway

- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts

### Render

- View logs in Render dashboard
- Monitor metrics
- Configure notifications

### Heroku

```bash
# View logs
heroku logs --tail

# Monitor metrics
heroku ps

# Check dyno status
heroku ps:scale
```

## Troubleshooting

### Database Connection Issues

**Problem:** Cannot connect to MongoDB Atlas

**Solutions:**

1. Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0)
2. Verify connection string is correct
3. Check database user permissions
4. Ensure network access is configured

### Email Not Sending

**Problem:** Contact form emails not being sent

**Solutions:**

1. Verify Gmail app password is correct
2. Check 2FA is enabled on Gmail
3. Verify EMAIL_APP_PASSWORD environment variable
4. Check server logs for email errors
5. Test with a simple email send script

### CORS Errors

**Problem:** Frontend cannot access API

**Solutions:**

1. Verify CORS_ORIGIN matches frontend URL exactly
2. Check for trailing slashes (should not have them)
3. Ensure FRONTEND_URL is set correctly
4. Check CORS middleware configuration

### File Upload Issues

**Problem:** Cannot upload files

**Solutions:**

1. Check UPLOAD_DIR exists and is writable
2. Verify MAX_FILE_SIZE is set
3. Check hosting provider file system permissions
4. Consider using cloud storage (Cloudinary, AWS S3)

### Memory Issues

**Problem:** Server crashes or runs out of memory

**Solutions:**

1. Upgrade hosting plan
2. Optimize database queries
3. Implement pagination
4. Add caching
5. Optimize image processing

### SSL/HTTPS Issues

**Problem:** HTTPS not working

**Solutions:**

1. Most hosting services provide automatic HTTPS
2. Check SSL certificate status in dashboard
3. Verify custom domain DNS is configured correctly
4. Wait for DNS propagation (up to 48 hours)

## Scaling Considerations

### Horizontal Scaling

- Use load balancer
- Deploy multiple instances
- Use Redis for session storage
- Implement database connection pooling

### Vertical Scaling

- Upgrade hosting plan
- Increase memory/CPU
- Optimize code performance
- Add caching layer

### Database Scaling

- Use MongoDB Atlas auto-scaling
- Implement database indexes
- Use read replicas
- Implement caching (Redis)

## Backup Strategy

### Database Backups

- MongoDB Atlas provides automatic backups
- Configure backup schedule in Atlas
- Test restore procedure regularly

### File Backups

- Backup uploads directory regularly
- Consider using cloud storage
- Implement automated backup script

### Configuration Backups

- Keep environment variables documented
- Store secrets in secure vault
- Maintain deployment documentation

## Rollback Procedure

### Railway

```bash
railway rollback
```

### Render

- Use dashboard to rollback to previous deployment
- Select deployment from history
- Click "Rollback"

### Heroku

```bash
heroku rollback
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] JWT secrets are strong and unique
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Security headers present
- [ ] File upload validation working
- [ ] XSS protection enabled
- [ ] MongoDB injection protection enabled
- [ ] Logs don't contain sensitive data
- [ ] Error messages don't expose system details

## Performance Optimization

- [ ] Compression enabled
- [ ] Database indexes created
- [ ] Response caching implemented
- [ ] Static assets optimized
- [ ] Connection pooling configured
- [ ] Query optimization done
- [ ] Monitoring set up

## Maintenance

### Weekly

- Check error logs
- Monitor resource usage
- Verify email functionality
- Test critical endpoints

### Monthly

- Update dependencies
- Review security advisories
- Check SSL certificate expiry
- Review and optimize performance

### Quarterly

- Full security audit
- Dependency updates
- Performance review
- Backup verification

## Support

For deployment issues:

1. Check hosting provider documentation
2. Review error logs
3. Check environment variables
4. Verify database connection
5. Test locally first
6. Contact hosting support if needed

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
