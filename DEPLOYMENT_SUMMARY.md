# Deployment Summary

This document provides a quick reference for deploying the Manasa Gali Portfolio application.

## Quick Start

### 1. Prerequisites

- MongoDB Atlas cluster configured
- Gmail app password generated
- Hosting accounts created (Railway/Render for backend, Vercel/Netlify for frontend)
- Domain name (optional)

### 2. Generate Secrets

```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate encryption key
cd server
node scripts/encryptData.js --generate-key
```

### 3. Deploy Backend

**Option A: Using Deployment Script**

```bash
./scripts/deploy.sh
# Select option 1, 2, or 3 for backend deployment
```

**Option B: Manual Deployment**

See [server/DEPLOYMENT.md](server/DEPLOYMENT.md) for detailed instructions.

**Quick Railway Deployment:**

```bash
cd server
railway login
railway init
railway variables set NODE_ENV=production
# Set other variables...
railway up
```

### 4. Deploy Frontend

**Option A: Using Deployment Script**

```bash
./scripts/deploy.sh
# Select option 4 or 5 for frontend deployment
```

**Option B: Manual Deployment**

See [client/DEPLOYMENT.md](client/DEPLOYMENT.md) for detailed instructions.

**Quick Vercel Deployment:**

```bash
cd client
vercel login
vercel
# Set environment variables in dashboard
vercel --prod
```

### 5. Verify Deployment

```bash
# Set your URLs
export API_URL="https://your-api-url.com"
export FRONTEND_URL="https://your-frontend-url.com"

# Run verification
npm run verify:deployment

# Run deployment tests
npm run test:deployment

# Run Lighthouse audit
npm run test:lighthouse
```

## Environment Variables

### Backend (.env)

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://galimanasa3_db_user:smVLcE2OvnypjpPK@cluster0.dnkaath.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=portfolio
JWT_SECRET=<your-generated-secret>
JWT_REFRESH_SECRET=<your-generated-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
ENCRYPTION_KEY=<your-64-char-hex>
EMAIL_USER=galimanasa3@gmail.com
EMAIL_APP_PASSWORD=dvho uffq zvqd ycgt
EMAIL_FROM_NAME=Manasa Gali
EMAIL_FROM_ADDRESS=galimanasa3@gmail.com
FRONTEND_URL=https://manasagali.com
CORS_ORIGIN=https://manasagali.com
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
TRUST_PROXY=true
```

### Frontend (.env)

```bash
VITE_API_URL=https://api.manasagali.com
VITE_SITE_URL=https://manasagali.com
VITE_APP_NAME=Manasa Gali Portfolio
```

## Deployment Checklist

### Pre-Deployment

- [ ] Code tested locally
- [ ] Build succeeds
- [ ] Environment variables prepared
- [ ] Secrets generated
- [ ] Database configured
- [ ] Email credentials verified

### Backend Deployment

- [ ] Hosting service configured
- [ ] Environment variables set
- [ ] Code deployed
- [ ] Health check passes
- [ ] Database connected
- [ ] API endpoints accessible

### Frontend Deployment

- [ ] Hosting service configured
- [ ] Environment variables set
- [ ] Build succeeds
- [ ] Code deployed
- [ ] Site accessible
- [ ] API connection works

### Post-Deployment

- [ ] All features tested
- [ ] Email functionality verified
- [ ] Performance audit passed
- [ ] Security headers present
- [ ] Monitoring enabled

## Testing Commands

```bash
# Verify deployment
npm run verify:deployment

# Test deployment
npm run test:deployment

# Run Lighthouse audit
npm run test:lighthouse

# Full Lighthouse audit (multiple pages)
npm run test:lighthouse:full
```

## Common Issues

### Backend Issues

**Database Connection Fails:**

- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check database user permissions

**Email Not Sending:**

- Verify Gmail app password
- Check 2FA enabled
- Verify EMAIL_APP_PASSWORD variable

**CORS Errors:**

- Verify CORS_ORIGIN matches frontend URL
- Check for trailing slashes
- Ensure FRONTEND_URL is correct

### Frontend Issues

**API Calls Fail:**

- Verify VITE_API_URL is correct
- Check backend is running
- Verify CORS on backend

**Build Fails:**

- Check for errors in code
- Verify dependencies installed
- Test build locally

**Blank Page:**

- Check browser console
- Verify API URL
- Check environment variables

## Monitoring

### Uptime Monitoring

Set up with UptimeRobot or similar:

- Monitor backend: `https://api.manasagali.com/api/health`
- Monitor frontend: `https://manasagali.com`

### Error Tracking

Optional: Set up Sentry for error tracking

### Analytics

- Built-in analytics in admin dashboard
- Optional: Google Analytics

## Maintenance

### Weekly

- Check error logs
- Verify email functionality
- Test contact form

### Monthly

- Update dependencies
- Run Lighthouse audit
- Review analytics

### Quarterly

- Full security audit
- Performance optimization
- Feature review

## Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Detailed checklist
- [POST_DEPLOYMENT_TESTING.md](POST_DEPLOYMENT_TESTING.md) - Testing guide
- [server/DEPLOYMENT.md](server/DEPLOYMENT.md) - Backend deployment
- [client/DEPLOYMENT.md](client/DEPLOYMENT.md) - Frontend deployment

## Support

For issues:

1. Check documentation
2. Review error logs
3. Check environment variables
4. Verify configuration
5. Contact hosting support

## Deployment URLs

### Production

- **Frontend:** https://manasagali.com
- **API:** https://api.manasagali.com
- **Admin:** https://manasagali.com/admin/login

### Development

- **Frontend:** http://localhost:5173
- **API:** http://localhost:5000
- **Admin:** http://localhost:5173/admin/login

## Credentials

### MongoDB Atlas

- **Connection String:** See .env.production.example
- **Database:** portfolio
- **User:** galimanasa3_db_user

### Email

- **Email:** galimanasa3@gmail.com
- **App Password:** See .env.production.example

### Admin Login

- **Email:** Set during initial setup
- **Password:** Set during initial setup

## Scripts

### Deployment Scripts

- `./scripts/deploy.sh` - Interactive deployment script
- `./scripts/verify-deployment.js` - Node.js verification
- `./scripts/test-deployment.sh` - Bash testing script
- `./scripts/lighthouse-audit.sh` - Performance audit

### NPM Scripts

- `npm run build` - Build both frontend and backend
- `npm run verify:deployment` - Verify deployment
- `npm run test:deployment` - Test deployment
- `npm run test:lighthouse` - Run Lighthouse audit

## Configuration Files

### Backend

- `server/.env.production.example` - Production environment template
- `server/railway.json` - Railway configuration
- `server/render.yaml` - Render configuration
- `server/Procfile` - Heroku configuration

### Frontend

- `client/.env.production.example` - Production environment template
- `client/vercel.json` - Vercel configuration
- `client/netlify.toml` - Netlify configuration

## Next Steps

After successful deployment:

1. ✅ Verify all features work
2. ✅ Run performance audit
3. ✅ Set up monitoring
4. ✅ Configure analytics
5. ✅ Test email functionality
6. ✅ Share with stakeholders
7. ✅ Document any issues
8. ✅ Plan improvements

## Success Criteria

Deployment is successful when:

- ✅ Backend health check returns 200
- ✅ Frontend loads without errors
- ✅ Admin login works
- ✅ Contact form sends emails
- ✅ All CRUD operations work
- ✅ HTTPS enabled
- ✅ Security headers present
- ✅ Lighthouse scores > 90
- ✅ Mobile responsive
- ✅ Cross-browser compatible

## Rollback Plan

If issues arise:

1. Identify the issue
2. Check recent changes
3. Rollback deployment:
   - Railway: `railway rollback`
   - Vercel: `vercel rollback`
   - Or use hosting dashboard
4. Verify rollback successful
5. Fix issue locally
6. Redeploy

## Contact

For deployment support:

- Email: galimanasa3@gmail.com
- Check documentation first
- Review error logs
- Contact hosting support if needed

---

**Last Updated:** [Date]
**Deployed By:** [Name]
**Deployment Status:** [Status]
