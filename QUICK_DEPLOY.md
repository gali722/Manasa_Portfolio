# Quick Deploy Reference

One-page reference for deploying the Manasa Gali Portfolio.

## 🚀 Deploy in 5 Steps

### 1️⃣ Generate Secrets

```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Encryption Key
cd server && node scripts/encryptData.js --generate-key
```

### 2️⃣ Deploy Backend

```bash
# Railway (Recommended)
cd server
railway login
railway init
railway variables set NODE_ENV=production
railway variables set MONGODB_URI="mongodb+srv://galimanasa3_db_user:smVLcE2OvnypjpPK@cluster0.dnkaath.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0"
railway variables set JWT_SECRET="<your-secret>"
railway variables set JWT_REFRESH_SECRET="<your-secret>"
railway variables set ENCRYPTION_KEY="<your-key>"
railway variables set EMAIL_USER="galimanasa3@gmail.com"
railway variables set EMAIL_APP_PASSWORD="dvho uffq zvqd ycgt"
railway variables set EMAIL_FROM_NAME="Manasa Gali"
railway variables set EMAIL_FROM_ADDRESS="galimanasa3@gmail.com"
railway variables set FRONTEND_URL="<your-frontend-url>"
railway variables set CORS_ORIGIN="<your-frontend-url>"
railway variables set MAX_FILE_SIZE="10485760"
railway variables set UPLOAD_DIR="./uploads"
railway variables set TRUST_PROXY="true"
railway up
```

### 3️⃣ Deploy Frontend

```bash
# Vercel (Recommended)
cd client
vercel login
vercel
# Set environment variables in dashboard:
# VITE_API_URL=<your-backend-url>
# VITE_SITE_URL=<your-frontend-url>
# VITE_APP_NAME=Manasa Gali Portfolio
vercel --prod
```

### 4️⃣ Verify Deployment

```bash
export API_URL="<your-backend-url>"
export FRONTEND_URL="<your-frontend-url>"
npm run verify:deployment
```

### 5️⃣ Test Everything

```bash
npm run test:deployment
npm run test:lighthouse
```

## 📋 Environment Variables

### Backend (Required)

| Variable           | Value                                                  |
| ------------------ | ------------------------------------------------------ |
| NODE_ENV           | production                                             |
| MONGODB_URI        | mongodb+srv://galimanasa3_db_user:smVLcE2OvnypjpPK@... |
| JWT_SECRET         | <generate>                                             |
| JWT_REFRESH_SECRET | <generate>                                             |
| ENCRYPTION_KEY     | <generate>                                             |
| EMAIL_USER         | galimanasa3@gmail.com                                  |
| EMAIL_APP_PASSWORD | dvho uffq zvqd ycgt                                    |
| FRONTEND_URL       | https://manasagali.com                                 |
| CORS_ORIGIN        | https://manasagali.com                                 |

### Frontend (Required)

| Variable      | Value                      |
| ------------- | -------------------------- |
| VITE_API_URL  | https://api.manasagali.com |
| VITE_SITE_URL | https://manasagali.com     |
| VITE_APP_NAME | Manasa Gali Portfolio      |

## 🔧 Quick Commands

```bash
# Interactive deployment
./scripts/deploy.sh

# Verify deployment
npm run verify:deployment

# Test deployment
npm run test:deployment

# Performance audit
npm run test:lighthouse

# Build locally
npm run build
```

## ✅ Deployment Checklist

- [ ] Secrets generated
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Environment variables set
- [ ] Health check passes
- [ ] Email works
- [ ] All features tested
- [ ] Lighthouse score > 90

## 🐛 Quick Troubleshooting

| Issue                     | Solution                               |
| ------------------------- | -------------------------------------- |
| Database connection fails | Check MongoDB Atlas IP whitelist       |
| Email not sending         | Verify Gmail app password              |
| CORS errors               | Check CORS_ORIGIN matches frontend URL |
| API calls fail            | Verify VITE_API_URL is correct         |
| Build fails               | Check for code errors, test locally    |
| Blank page                | Check browser console, verify API URL  |

## 📚 Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Full guide
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Detailed checklist
- [POST_DEPLOYMENT_TESTING.md](POST_DEPLOYMENT_TESTING.md) - Testing guide
- [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) - Quick summary

## 🆘 Support

1. Check documentation
2. Review error logs
3. Verify environment variables
4. Test locally first
5. Contact hosting support

## 🎯 Success Criteria

✅ Backend health returns 200  
✅ Frontend loads without errors  
✅ Admin login works  
✅ Contact form sends emails  
✅ HTTPS enabled  
✅ Lighthouse scores > 90

## 🔗 URLs

- **Frontend:** https://manasagali.com
- **API:** https://api.manasagali.com
- **Admin:** https://manasagali.com/admin/login

---

**Need help?** See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.
