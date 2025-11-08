# Manasa Gali Portfolio

A dynamic portfolio website built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a public portfolio and an admin content management system.

## Features

- 🎨 Dynamic content management
- 🌓 Light/Dark theme switching
- 📧 Integrated email contact form
- 🔒 Secure admin authentication
- 📱 Fully responsive design
- ⚡ Optimized performance
- ♿ Accessibility compliant

## Tech Stack

### Frontend

- React 18+ with Vite
- React Router v6
- TailwindCSS
- Framer Motion
- Axios & React Query

### Backend

- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for emails
- Multer for file uploads

## Project Structure

```
manasa-portfolio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   └── server.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ LTS
- MongoDB Atlas account or local MongoDB instance
- Gmail account for email functionality

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd manasa-portfolio
```

2. Install dependencies for both client and server:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Setup environment variables:

**Client (.env):**

```bash
cd client
cp .env.example .env
# Edit .env with your configuration
```

**Server (.env):**

```bash
cd server
cp .env.example .env
# Edit .env with your configuration
```

### Database Setup

Before running the application, seed the database with initial data:

```bash
cd server
npm run seed
```

This will create:

- Admin user account
- Sample profile data
- Skills, projects, experience
- Education and certifications
- Testimonials

**Default Admin Credentials:**

- Email: `galimanasa3@gmail.com`
- Password: `Admin@123`

⚠️ **IMPORTANT:** Change the admin password immediately after first login!

### Running the Application

**Development Mode:**

1. Start the backend server:

```bash
cd server
npm run dev
```

2. Start the frontend (in a new terminal):

```bash
cd client
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:5173/admin/login

### Building for Production

**Frontend:**

```bash
cd client
npm run build
```

**Backend:**

```bash
cd server
npm start
```

## Environment Variables

The application requires several environment variables for configuration. See [ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md) for complete documentation.

### Quick Reference

**Required Server Variables:**

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `JWT_REFRESH_SECRET` - Refresh token secret
- `ENCRYPTION_KEY` - Data encryption key
- `EMAIL_USER` - Gmail email address
- `EMAIL_APP_PASSWORD` - Gmail app password
- `CORS_ORIGIN` - Allowed CORS origin
- `FRONTEND_URL` - Frontend URL

**Required Client Variables:**

- `VITE_API_URL` - Backend API URL
- `VITE_SITE_URL` - Frontend URL

See `.env.example` files in `client/` and `server/` directories for complete configuration templates.

## MongoDB Configuration

The application uses MongoDB Atlas with the following configuration:

- Database: `portfolio`
- Collections will be created automatically by Mongoose

## Email Configuration

The contact form uses Gmail SMTP. To set up:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Add the app password to `EMAIL_APP_PASSWORD` in server/.env

## Development Guidelines

- Follow ESLint and Prettier configurations
- Use conventional commit messages
- Test thoroughly before committing
- Keep dependencies up to date

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deployment

**Using the deployment script:**

```bash
./scripts/deploy.sh
```

**Manual deployment:**

1. **Backend** - Deploy to Railway, Render, or Heroku
2. **Frontend** - Deploy to Vercel or Netlify
3. **Verify** - Run `npm run verify:deployment`

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for a complete checklist.

### Deployment URLs

- **Production Frontend:** https://manasagali.com
- **Production API:** https://api.manasagali.com

## Documentation

📚 **[Complete Documentation Index](DOCUMENTATION_INDEX.md)** - Find all documentation organized by role and topic

### Getting Started

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [Environment Variables](ENVIRONMENT_VARIABLES.md) - Configuration reference
- [Admin User Guide](ADMIN_GUIDE.md) - Complete admin panel guide
- [API Documentation](API_DOCUMENTATION.md) - API endpoints reference

### Deployment & Operations

- [Deployment Guide](DEPLOYMENT.md) - Complete deployment guide
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Pre/post deployment checklist
- [Quick Deploy](QUICK_DEPLOY.md) - Fast deployment instructions

### Technical Documentation

- [Performance Optimizations](PERFORMANCE_OPTIMIZATIONS.md) - Performance tips
- [Security Implementation](server/SECURITY.md) - Security features
- [Server Scripts](server/scripts/README.md) - Utility scripts guide

## Scripts

### Root Level

- `npm run install:all` - Install all dependencies
- `npm run dev:client` - Start frontend dev server
- `npm run dev:server` - Start backend dev server
- `npm run build:client` - Build frontend for production
- `npm run build` - Build both frontend and backend
- `npm run lint` - Lint both frontend and backend
- `npm run verify:deployment` - Verify deployment

### Client Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

### Server Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with initial data
- `npm run lint` - Lint code

## License

MIT

## Author

Manasa Gali

- Email: galimanasa3@gmail.com
- LinkedIn: [Add LinkedIn URL]
- GitHub: [Add GitHub URL]
