# 🚀 Deployment Guide - Netlify + Render

## Step 1: Deploy Backend to Render

### 1.1 Create Render Account

1. Go to: https://render.com
2. Sign up with GitHub
3. Authorize Render

### 1.2 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Select repository: **gali722/Manasa_Portfolio**
3. Configure:
   - **Name:** `manasa-portfolio-api`
   - **Region:** Oregon (US West) or closest
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

### 1.3 Environment Variables

Click **"Advanced"** → Add these environment variables:

```bash
NODE_ENV=production
PORT=5000

# MongoDB (Your existing connection)
MONGODB_URI=mongodb+srv://galimanasa3_db_user:smVLcE2OvnypjpPK@cluster0.dnkaath.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=portfolio

# JWT Secrets
JWT_SECRET=1234567890
JWT_REFRESH_SECRET=qwertyuikjhgfdety
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration
EMAIL_USER=galimanasa3@gmail.com
EMAIL_APP_PASSWORD=dvho uffq zvqd ycgt
EMAIL_FROM_NAME=Manasa Gali
EMAIL_FROM_ADDRESS=galimanasa3@gmail.com

# Frontend URL (Update after Netlify deployment)
FRONTEND_URL=https://your-portfolio.netlify.app
CORS_ORIGIN=https://your-portfolio.netlify.app

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### 1.4 Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Copy your backend URL: `https://manasa-portfolio-api.onrender.com`

---

## Step 2: Deploy Frontend to Netlify

### 2.1 Create Netlify Account

1. Go to: https://app.netlify.com
2. Sign up with GitHub
3. Authorize Netlify

### 2.2 Create New Site

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Select repository: **gali722/Manasa_Portfolio**
4. Configure build settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`
   - **Branch:** `main`

### 2.3 Environment Variables

Click **"Site settings"** → **"Environment variables"** → **"Add a variable"**

```bash
VITE_API_URL=https://manasa-portfolio-api.onrender.com
```

### 2.4 Deploy

1. Click **"Deploy site"**
2. Wait 3-5 minutes
3. Your site will be live at: `https://random-name-123.netlify.app`

### 2.5 Custom Domain (Optional)

1. Go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Follow instructions to add your domain

---

## Step 3: Connect Frontend & Backend

### 3.1 Update Backend CORS

1. Go back to Render dashboard
2. Open your web service
3. Go to **"Environment"**
4. Update these variables with your Netlify URL:
   ```bash
   FRONTEND_URL=https://your-actual-netlify-url.netlify.app
   CORS_ORIGIN=https://your-actual-netlify-url.netlify.app
   ```
5. Click **"Save Changes"**
6. Service will auto-redeploy

### 3.2 Test Your Deployment

**Public Site:**

- Visit: `https://your-netlify-url.netlify.app`
- Check 3D effects load
- Test navigation
- Try contact form

**Admin Panel:**

- Visit: `https://your-netlify-url.netlify.app/admin/login`
- Login with your credentials
- Test uploading images
- Test updating content

---

## 🎉 You're Live!

Your portfolio is now deployed:

- **Frontend:** https://your-netlify-url.netlify.app
- **Backend API:** https://manasa-portfolio-api.onrender.com
- **Admin Panel:** https://your-netlify-url.netlify.app/admin

---

## 📝 Important Notes

### Render Free Tier

- ⚠️ Backend sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Subsequent requests are fast
- 750 hours/month free (enough for 24/7)

### Netlify Free Tier

- ✅ 100GB bandwidth/month
- ✅ Unlimited sites
- ✅ Automatic HTTPS
- ✅ Instant cache invalidation

### Auto-Deploy

Both platforms auto-deploy when you push to GitHub:

```bash
git add .
git commit -m "Update portfolio"
git push
```

- Render: Auto-deploys backend
- Netlify: Auto-deploys frontend

---

## 🔧 Troubleshooting

### Backend Issues

- Check Render logs: Dashboard → Logs
- Verify MongoDB connection
- Check environment variables

### Frontend Issues

- Check Netlify deploy logs
- Verify VITE_API_URL is correct
- Check browser console for errors

### CORS Errors

- Ensure CORS_ORIGIN matches Netlify URL exactly
- Include https:// in the URL
- No trailing slash

---

## 🚀 Next Steps

1. **Custom Domain:** Add your own domain to Netlify
2. **Analytics:** Enable Netlify Analytics
3. **Monitoring:** Set up uptime monitoring
4. **Backup:** Regular MongoDB backups via admin panel

---

## 📞 Need Help?

If you encounter issues:

1. Check deployment logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console

Good luck with your deployment! 🎉
