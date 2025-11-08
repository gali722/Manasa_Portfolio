# Frontend Deployment Guide

This guide covers deploying the React frontend to various hosting services.

## Prerequisites

- Backend API deployed and accessible
- Environment variables prepared
- Code tested locally
- Production build tested

## Hosting Service Options

### Option 1: Vercel (Recommended)

**Pros:**

- Optimized for React/Vite
- Automatic HTTPS
- Global CDN
- Excellent free tier
- Automatic deployments from Git

**Steps:**

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Login:**

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

   Via CLI:

   ```bash
   vercel env add VITE_API_URL production
   # Enter: https://api.manasagali.com

   vercel env add VITE_SITE_URL production
   # Enter: https://manasagali.com

   vercel env add VITE_APP_NAME production
   # Enter: Manasa Gali Portfolio
   ```

   Or via Dashboard:
   - Go to Project Settings > Environment Variables
   - Add each variable for Production environment

6. **Deploy to Production:**

   ```bash
   vercel --prod
   ```

7. **Add Custom Domain (Optional):**
   - Go to Project Settings > Domains
   - Add domain: `manasagali.com`
   - Add DNS records as instructed
   - Wait for DNS propagation

### Option 2: Netlify

**Pros:**

- Easy deployment
- Automatic HTTPS
- Global CDN
- Good free tier
- Form handling built-in

**Steps:**

1. **Install Netlify CLI:**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**

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
   - Functions directory: (leave empty)

5. **Set Environment Variables:**

   Via CLI:

   ```bash
   netlify env:set VITE_API_URL "https://api.manasagali.com"
   netlify env:set VITE_SITE_URL "https://manasagali.com"
   netlify env:set VITE_APP_NAME "Manasa Gali Portfolio"
   ```

   Or via Dashboard:
   - Go to Site Settings > Environment Variables
   - Add each variable

6. **Deploy:**

   ```bash
   netlify deploy --prod
   ```

7. **Add Custom Domain (Optional):**
   - Go to Site Settings > Domain Management
   - Add custom domain: `manasagali.com`
   - Follow DNS configuration instructions

### Option 3: GitHub Pages

**Pros:**

- Free hosting
- Simple setup
- Good for static sites

**Cons:**

- No server-side features
- Limited to public repositories (free tier)

**Steps:**

1. **Install gh-pages:**

   ```bash
   cd client
   npm install --save-dev gh-pages
   ```

2. **Update package.json:**

   ```json
   {
     "homepage": "https://yourusername.github.io/manasa-portfolio",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy:**

   ```bash
   npm run deploy
   ```

4. **Configure GitHub Pages:**
   - Go to repository Settings > Pages
   - Source: gh-pages branch
   - Save

## Environment Variables Reference

### Required Variables

```bash
# Backend API URL (deployed backend)
VITE_API_URL=https://api.manasagali.com

# Frontend URL (your domain)
VITE_SITE_URL=https://manasagali.com

# Application Name
VITE_APP_NAME=Manasa Gali Portfolio
```

### Important Notes

- All Vite environment variables must start with `VITE_`
- Variables are embedded at build time
- Rebuild required after changing variables
- Don't include sensitive data (they're public in the bundle)

## Build Configuration

### Vite Configuration

The `vite.config.js` is already configured for production:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
```

### Build Optimization

The build process automatically:

- Minifies JavaScript and CSS
- Optimizes images
- Generates source maps (disabled in production)
- Code splits by route
- Tree shakes unused code

## Post-Deployment Verification

### 1. Check Homepage

```bash
curl https://manasagali.com
```

Should return HTML with:

- `<title>` tag
- `<div id="root">`
- Script tags

### 2. Test Routing

Visit these URLs:

- `https://manasagali.com/` - Homepage
- `https://manasagali.com/projects` - Projects page
- `https://manasagali.com/contact` - Contact page
- `https://manasagali.com/admin/login` - Admin login

All should work (no 404 errors).

### 3. Check API Connection

Open browser console and check:

- No CORS errors
- API calls succeed
- Data loads correctly

### 4. Test Features

- [ ] Homepage loads
- [ ] Navigation works
- [ ] Theme toggle works
- [ ] All sections display
- [ ] Images load
- [ ] Contact form works
- [ ] Admin login accessible
- [ ] Responsive on mobile

### 5. Run Lighthouse Audit

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://manasagali.com --view
```

Target scores:

- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## Custom Domain Setup

### DNS Configuration

#### For Vercel

Add these DNS records:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### For Netlify

Add these DNS records:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: <your-site>.netlify.app
```

### SSL Certificate

Both Vercel and Netlify automatically provision SSL certificates:

- Usually takes 5-10 minutes
- Automatic renewal
- Free Let's Encrypt certificates

### WWW Redirect

Configure www redirect in hosting dashboard:

- Redirect `www.manasagali.com` to `manasagali.com`
- Or vice versa (choose one as primary)

## Troubleshooting

### Build Fails

**Problem:** Build fails with errors

**Solutions:**

1. Check for TypeScript/ESLint errors
2. Verify all dependencies installed
3. Check environment variables are set
4. Test build locally: `npm run build`
5. Check Node version compatibility

### Blank Page After Deployment

**Problem:** Site loads but shows blank page

**Solutions:**

1. Check browser console for errors
2. Verify API URL is correct
3. Check CORS configuration on backend
4. Verify all environment variables set
5. Check routing configuration

### 404 on Page Refresh

**Problem:** Direct URLs return 404

**Solutions:**

1. Configure SPA fallback (already done in vercel.json/netlify.toml)
2. Verify rewrites configuration
3. Check hosting provider documentation

### API Calls Fail

**Problem:** Cannot connect to backend

**Solutions:**

1. Verify VITE_API_URL is correct
2. Check backend is running
3. Verify CORS on backend
4. Check network tab in browser
5. Verify backend URL is accessible

### Images Not Loading

**Problem:** Images return 404

**Solutions:**

1. Check image paths are correct
2. Verify images are in public folder or imported
3. Check build output includes images
4. Verify CDN is serving assets

### Environment Variables Not Working

**Problem:** Variables are undefined

**Solutions:**

1. Ensure variables start with `VITE_`
2. Rebuild after changing variables
3. Check variables are set in hosting dashboard
4. Verify variable names match exactly

## Performance Optimization

### Already Implemented

- ✅ Code splitting by route
- ✅ Lazy loading components
- ✅ Image optimization
- ✅ Minification
- ✅ Compression
- ✅ Tree shaking

### Additional Optimizations

1. **Enable CDN Caching:**
   - Already configured in vercel.json/netlify.toml
   - Static assets cached for 1 year

2. **Optimize Images:**
   - Use WebP format
   - Compress images before upload
   - Use responsive images

3. **Reduce Bundle Size:**
   - Remove unused dependencies
   - Use dynamic imports
   - Analyze bundle: `npm run build -- --analyze`

4. **Enable Service Worker:**
   - Already implemented in src/utils/serviceWorkerRegistration.js
   - Provides offline support

## Monitoring

### Vercel Analytics

Enable in dashboard:

- Go to Project > Analytics
- View page views, performance metrics
- Monitor Core Web Vitals

### Netlify Analytics

Enable in dashboard:

- Go to Site > Analytics
- View traffic, bandwidth
- Monitor performance

### Google Analytics (Optional)

Add to `index.html`:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Continuous Deployment

### Automatic Deployments

Both Vercel and Netlify support automatic deployments:

1. **Connect GitHub Repository:**
   - Link repository in dashboard
   - Select branch (usually `main`)

2. **Configure Build Settings:**
   - Already configured in vercel.json/netlify.toml

3. **Deploy on Push:**
   - Every push to main triggers deployment
   - Preview deployments for PRs

### Deployment Workflow

```
git push origin main
  ↓
Hosting service detects push
  ↓
Runs build command
  ↓
Deploys to production
  ↓
Sends notification
```

## Rollback Procedure

### Vercel

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>
```

Or via dashboard:

- Go to Deployments
- Find previous deployment
- Click "Promote to Production"

### Netlify

Via dashboard:

- Go to Deploys
- Find previous deployment
- Click "Publish deploy"

## Security Best Practices

- [ ] HTTPS enabled (automatic)
- [ ] Security headers configured
- [ ] No sensitive data in environment variables
- [ ] Dependencies up to date
- [ ] CSP headers configured
- [ ] XSS protection enabled

## SEO Configuration

### Meta Tags

Already implemented in SEO component:

- Title tags
- Meta descriptions
- Open Graph tags
- Twitter Card tags

### Sitemap

Located at `/sitemap.xml`:

- Lists all pages
- Updated automatically

### Robots.txt

Located at `/robots.txt`:

- Allows all crawlers
- Points to sitemap

### Structured Data

Implemented in `src/utils/structuredData.js`:

- Person schema
- Professional profile
- Contact information

## Maintenance

### Weekly

- [ ] Check deployment status
- [ ] Monitor error logs
- [ ] Verify site is accessible
- [ ] Check SSL certificate

### Monthly

- [ ] Update dependencies
- [ ] Run Lighthouse audit
- [ ] Check performance metrics
- [ ] Review analytics

### Quarterly

- [ ] Full security audit
- [ ] Performance optimization
- [ ] Content review
- [ ] User feedback review

## Backup Strategy

### Code Backup

- Code is in Git repository
- Push to GitHub regularly
- Keep multiple branches

### Deployment History

- Vercel/Netlify keep deployment history
- Can rollback to any previous deployment
- Automatic backups

## Cost Estimation

### Vercel

- **Free Tier:**
  - 100 GB bandwidth/month
  - Unlimited deployments
  - Automatic HTTPS
  - Good for personal projects

- **Pro Tier ($20/month):**
  - 1 TB bandwidth
  - Advanced analytics
  - Team collaboration

### Netlify

- **Free Tier:**
  - 100 GB bandwidth/month
  - 300 build minutes/month
  - Automatic HTTPS
  - Good for personal projects

- **Pro Tier ($19/month):**
  - 400 GB bandwidth
  - 25,000 build minutes
  - Advanced features

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

## Deployment Checklist

- [ ] Code tested locally
- [ ] Build succeeds locally
- [ ] Environment variables prepared
- [ ] Backend API deployed
- [ ] Hosting service account created
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] All features tested
- [ ] Performance audit passed
- [ ] SEO verified
- [ ] Monitoring enabled

## Next Steps

After successful deployment:

1. Test all features thoroughly
2. Run Lighthouse audit
3. Set up monitoring
4. Configure analytics
5. Share with stakeholders
6. Monitor for issues
7. Gather feedback
8. Plan improvements
