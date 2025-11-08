# Deployment Checklist

Use this checklist to ensure a smooth deployment process.

## Pre-Deployment

### Code Preparation

- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] No server errors in logs
- [ ] All environment variables documented
- [ ] .gitignore updated (no secrets committed)
- [ ] Dependencies up to date
- [ ] Code linted and formatted
- [ ] Build succeeds locally (`npm run build:client`)

### Security

- [ ] Strong JWT secrets generated
- [ ] Encryption key generated (64 hex characters)
- [ ] Email password encrypted (optional)
- [ ] No hardcoded credentials in code
- [ ] CORS configured for production domain
- [ ] Rate limiting configured
- [ ] Security headers enabled
- [ ] HTTPS enforced in production

### Database

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with appropriate permissions
- [ ] IP whitelist configured (0.0.0.0/0 or specific IPs)
- [ ] Connection string tested
- [ ] Database name confirmed: `portfolio`

### Email

- [ ] Gmail account accessible
- [ ] 2FA enabled on Gmail
- [ ] App password generated
- [ ] Email credentials tested locally

## Backend Deployment

### Environment Setup

- [ ] Hosting service account created (Railway/Render/Heroku)
- [ ] New project/service created
- [ ] Repository connected (if using Git deployment)
- [ ] Build command configured: `npm install`
- [ ] Start command configured: `npm start`
- [ ] Node version specified (18.x or higher)

### Environment Variables

Copy these to your hosting service:

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-atlas-uri>
DB_NAME=portfolio
JWT_SECRET=<generated-secret>
JWT_REFRESH_SECRET=<generated-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
ENCRYPTION_KEY=<generated-64-char-hex>
EMAIL_USER=galimanasa3@gmail.com
EMAIL_APP_PASSWORD=<your-app-password>
EMAIL_FROM_NAME=Manasa Gali
EMAIL_FROM_ADDRESS=galimanasa3@gmail.com
FRONTEND_URL=<your-frontend-url>
CORS_ORIGIN=<your-frontend-url>
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
TRUST_PROXY=true
```

- [ ] All environment variables set
- [ ] No trailing slashes in URLs
- [ ] FRONTEND_URL matches actual frontend domain
- [ ] CORS_ORIGIN matches FRONTEND_URL

### Deployment

- [ ] Code deployed successfully
- [ ] Build logs checked (no errors)
- [ ] Service started successfully
- [ ] Health check endpoint accessible: `/api/health`
- [ ] Deployment URL noted

### Post-Deployment Backend Tests

- [ ] Health endpoint returns 200: `GET /api/health`
- [ ] Profile endpoint accessible: `GET /api/profile`
- [ ] Skills endpoint accessible: `GET /api/skills`
- [ ] Projects endpoint accessible: `GET /api/projects`
- [ ] CORS headers present in responses
- [ ] Security headers present
- [ ] Rate limiting working
- [ ] Database connection successful

## Frontend Deployment

### Environment Setup

- [ ] Hosting service account created (Vercel/Netlify)
- [ ] New project created
- [ ] Repository connected
- [ ] Framework detected: Vite
- [ ] Build command configured: `npm run build`
- [ ] Output directory configured: `dist`
- [ ] Install command configured: `npm install`

### Environment Variables

Copy these to your hosting service:

```bash
VITE_API_URL=<your-backend-url>
VITE_SITE_URL=<your-frontend-url>
VITE_APP_NAME=Manasa Gali Portfolio
```

- [ ] All environment variables set
- [ ] VITE_API_URL points to deployed backend
- [ ] No trailing slashes in URLs

### Deployment

- [ ] Code deployed successfully
- [ ] Build completed without errors
- [ ] Build logs checked
- [ ] Deployment URL noted
- [ ] SPA fallback configured (redirects to index.html)

### Post-Deployment Frontend Tests

- [ ] Homepage loads successfully
- [ ] No console errors
- [ ] All images load
- [ ] Navigation works
- [ ] Theme toggle works
- [ ] API calls succeed
- [ ] Responsive design works on mobile

## Domain Configuration (Optional)

### Backend Domain (api.manasagali.com)

- [ ] Custom domain added in hosting service
- [ ] DNS CNAME record created
- [ ] SSL certificate provisioned
- [ ] Domain accessible via HTTPS
- [ ] Update FRONTEND_URL and CORS_ORIGIN if needed

### Frontend Domain (manasagali.com)

- [ ] Custom domain added in hosting service
- [ ] DNS A/CNAME records created
- [ ] SSL certificate provisioned
- [ ] Domain accessible via HTTPS
- [ ] www redirect configured (optional)
- [ ] Update VITE_SITE_URL if needed

## Post-Deployment Verification

### Automated Tests

- [ ] Run verification script: `npm run verify:deployment`
- [ ] All tests pass

### Manual Testing - Public Features

- [ ] Homepage loads in < 3 seconds
- [ ] Profile section displays correctly
- [ ] Profile photo loads
- [ ] Skills section displays with categories
- [ ] Projects section shows all projects
- [ ] Project search works
- [ ] Project filter works
- [ ] Project detail modal opens
- [ ] Experience timeline displays
- [ ] Education section visible
- [ ] Certifications display
- [ ] Testimonials carousel works
- [ ] Contact form submits successfully
- [ ] Contact form validation works
- [ ] Resume download works
- [ ] Social media links work
- [ ] Footer displays correctly
- [ ] Theme toggle switches themes
- [ ] Theme persists on reload
- [ ] Mobile responsive design works
- [ ] Tablet responsive design works

### Manual Testing - Admin Features

- [ ] Admin login page accessible at `/admin/login`
- [ ] Login with correct credentials works
- [ ] Login with wrong credentials fails appropriately
- [ ] Dashboard loads after login
- [ ] Sidebar navigation works
- [ ] Profile management page loads
- [ ] Can update profile information
- [ ] Can upload profile photo
- [ ] Profile photo preview works
- [ ] Can upload resume
- [ ] Resume upload shows current file
- [ ] Skills management page loads
- [ ] Can add new skill
- [ ] Can edit existing skill
- [ ] Can delete skill
- [ ] Can reorder skills
- [ ] Projects management page loads
- [ ] Can add new project
- [ ] Can edit existing project
- [ ] Can delete project
- [ ] Can upload project images
- [ ] Experience management page loads
- [ ] Can add new experience
- [ ] Can edit existing experience
- [ ] Can delete experience
- [ ] Education management page loads
- [ ] Can add new education entry
- [ ] Can edit education entry
- [ ] Can delete education entry
- [ ] Certifications management works
- [ ] Testimonials management page loads
- [ ] Can add new testimonial
- [ ] Can edit testimonial
- [ ] Can delete testimonial
- [ ] Can reorder testimonials
- [ ] Analytics dashboard displays data
- [ ] Analytics charts render
- [ ] Settings page accessible
- [ ] Can change password
- [ ] Logout works correctly
- [ ] Session expires after 24 hours

### Email Functionality

- [ ] Submit contact form as visitor
- [ ] Admin receives notification email
- [ ] Notification email has correct content
- [ ] Notification email has reply-to address
- [ ] Visitor receives confirmation email
- [ ] Confirmation email has correct content
- [ ] Email templates render correctly
- [ ] No email errors in server logs

### Performance Testing

- [ ] Run Lighthouse audit on homepage
- [ ] Performance score > 90
- [ ] Accessibility score > 90
- [ ] Best Practices score > 90
- [ ] SEO score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Total Blocking Time < 200ms

### SEO Verification

- [ ] Meta title present on all pages
- [ ] Meta description present
- [ ] Open Graph tags present
- [ ] Structured data present
- [ ] Sitemap.xml accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`
- [ ] All images have alt text
- [ ] Proper heading hierarchy (h1, h2, h3)

### Security Verification

- [ ] HTTPS enabled (green padlock)
- [ ] Security headers present (check with securityheaders.com)
- [ ] HSTS header present
- [ ] X-Frame-Options header present
- [ ] X-Content-Type-Options header present
- [ ] X-XSS-Protection header present
- [ ] Content-Security-Policy header present
- [ ] No mixed content warnings
- [ ] Rate limiting works (test with multiple rapid requests)
- [ ] File upload validation works
- [ ] XSS protection works
- [ ] SQL injection protection works (using Mongoose)

### Browser Compatibility

- [ ] Chrome (latest) - Desktop
- [ ] Chrome (latest) - Mobile
- [ ] Firefox (latest) - Desktop
- [ ] Safari (latest) - Desktop
- [ ] Safari (latest) - iOS
- [ ] Edge (latest) - Desktop

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] Skip to content link works
- [ ] Screen reader compatible (test with NVDA/JAWS)
- [ ] Color contrast meets WCAG AA
- [ ] Form labels present
- [ ] Error messages clear
- [ ] ARIA labels present

## Monitoring Setup

### Error Tracking (Optional)

- [ ] Sentry account created
- [ ] Sentry integrated in backend
- [ ] Sentry integrated in frontend
- [ ] Test error tracking

### Uptime Monitoring

- [ ] UptimeRobot account created
- [ ] Monitor created for backend
- [ ] Monitor created for frontend
- [ ] Alert email configured
- [ ] Test alerts

### Analytics

- [ ] Built-in analytics working
- [ ] Google Analytics integrated (optional)
- [ ] Analytics tracking verified

## Documentation

- [ ] README.md updated with deployment info
- [ ] DEPLOYMENT.md reviewed
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Admin credentials stored securely
- [ ] Deployment URLs documented
- [ ] Custom domain info documented (if applicable)

## Backup & Recovery

- [ ] Database backup strategy confirmed
- [ ] MongoDB Atlas automatic backups enabled
- [ ] Admin panel backup feature tested
- [ ] Recovery procedure documented
- [ ] Rollback procedure documented

## Final Steps

- [ ] All checklist items completed
- [ ] Deployment verified by team/client
- [ ] Admin credentials shared securely
- [ ] Monitoring alerts configured
- [ ] Support contact information updated
- [ ] Deployment date documented
- [ ] Celebrate! 🎉

## Post-Launch Monitoring (First 24 Hours)

- [ ] Check error logs every 2 hours
- [ ] Monitor uptime
- [ ] Check email functionality
- [ ] Monitor database performance
- [ ] Check API response times
- [ ] Review analytics data
- [ ] Test contact form submissions
- [ ] Monitor server resources (CPU, memory)

## Post-Launch Monitoring (First Week)

- [ ] Daily error log review
- [ ] Daily uptime check
- [ ] Weekly performance audit
- [ ] Review user feedback
- [ ] Check for security issues
- [ ] Monitor database growth
- [ ] Review analytics trends

## Maintenance Schedule

### Weekly

- [ ] Check error logs
- [ ] Review analytics
- [ ] Test contact form
- [ ] Verify email functionality
- [ ] Check SSL certificate expiry

### Monthly

- [ ] Update dependencies
- [ ] Review security advisories
- [ ] Database backup verification
- [ ] Performance audit
- [ ] Content review

### Quarterly

- [ ] Full security audit
- [ ] Lighthouse audit
- [ ] Dependency updates
- [ ] Feature review
- [ ] User feedback review

## Rollback Plan

If critical issues arise:

1. **Identify the Issue**
   - Check error logs
   - Review recent changes
   - Identify affected features

2. **Rollback Backend**

   ```bash
   # Railway
   railway rollback

   # Render - Use dashboard

   # Heroku
   heroku rollback
   ```

3. **Rollback Frontend**

   ```bash
   # Vercel
   vercel rollback

   # Netlify - Use dashboard
   ```

4. **Verify Rollback**
   - Test critical features
   - Check error logs
   - Verify user access

5. **Communicate**
   - Notify stakeholders
   - Update status page
   - Document issue

## Support Contacts

- **Developer:** [Your Name/Email]
- **Hosting Support:** [Hosting Provider Support]
- **Domain Registrar:** [Domain Support]
- **MongoDB Atlas:** support@mongodb.com
- **Emergency Contact:** [Emergency Contact]

---

**Deployment Date:** ********\_********

**Deployed By:** ********\_********

**Backend URL:** ********\_********

**Frontend URL:** ********\_********

**Notes:**

---

---

---
