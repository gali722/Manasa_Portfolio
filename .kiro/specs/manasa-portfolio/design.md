# Design Document

## Overview

The Manasa Gali Portfolio is a full-stack MERN application consisting of a public-facing portfolio website and an administrative content management system. The architecture follows a three-tier model with a React frontend, Node.js/Express backend, and MongoDB database. The system implements modern web development practices including responsive design, theme switching, secure authentication, and real-time content updates.

### Key Design Principles

1. **Dynamic Content Management**: All portfolio content is database-driven and manageable through an admin interface
2. **Security First**: Encryption for sensitive data, secure authentication, and input validation throughout
3. **Performance Optimized**: Lazy loading, image optimization, caching strategies, and efficient database queries
4. **User Experience**: Smooth animations, responsive design, intuitive navigation, and accessibility compliance
5. **Scalability**: Modular architecture allowing easy feature additions and maintenance

## Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        A[Public Portfolio SPA]
        B[Admin Dashboard SPA]
    end

    subgraph "API Layer"
        C[Express.js REST API]
        D[Authentication Middleware]
        E[Email Service]
    end

    subgraph "Data Layer"
        F[(MongoDB Database)]
        G[File Storage System]
    end

    A -->|HTTP/HTTPS| C
    B -->|HTTP/HTTPS| C
    C --> D
    C --> E
    C --> F
    C --> G
    E -->|SMTP| H[Gmail SMTP]

    style A fill:#4A90E2
    style B fill:#E24A4A
    style C fill:#50C878
    style F fill:#F5A623
```

### Technology Stack

**Frontend:**

- React 18+ with Hooks and Context API
- React Router v6 for navigation
- Axios for API communication
- Framer Motion for animations
- TailwindCSS for styling
- React Hook Form for form management
- React Query for data fetching and caching

**Backend:**

- Node.js 18+ LTS
- Express.js 4.x
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Nodemailer for email functionality
- Crypto for encryption/decryption

**Database:**

- MongoDB 6.x
- Mongoose ODM for data modeling

**DevOps & Tools:**

- Vite for frontend build
- ESLint & Prettier for code quality
- Git for version control

## Components and Interfaces

### Frontend Component Architecture

```mermaid
graph TD
    A[App Root] --> B[Public Routes]
    A --> C[Admin Routes]

    B --> D[Home Page]
    B --> E[Projects Page]
    B --> F[Contact Page]

    D --> G[Hero Section]
    D --> H[About Section]
    D --> I[Skills Section]
    D --> J[Experience Section]
    D --> K[Education Section]
    D --> L[Testimonials Section]

    C --> M[Login Page]
    C --> N[Dashboard]

    N --> O[Profile Management]
    N --> P[Skills Management]
    N --> Q[Projects Management]
    N --> R[Experience Management]
    N --> S[Analytics Dashboard]

    A --> T[Shared Components]
    T --> U[Header/Navigation]
    T --> V[Footer]
    T --> W[Theme Toggle]
    T --> X[Loading States]
```

### Key Frontend Components

#### Public Portfolio Components

1. **Header Component**

   - Logo/Name display
   - Navigation menu (responsive hamburger on mobile)
   - Theme toggle button
   - Social media links
   - Sticky positioning with scroll effects

2. **Hero Section**

   - Profile photo with hover effects
   - Name and professional title
   - Animated tagline
   - Call-to-action buttons (Download Resume, Contact)
   - Particle background or animated gradient

3. **About Section**

   - Professional summary (rich text)
   - Key highlights/achievements
   - Contact information
   - Years of experience counter

4. **Skills Section**

   - Categorized skill display (Data Analysis, Data Engineering, Business Analysis, etc.)
   - Proficiency indicators (progress bars or rating system)
   - Technology icons/logos
   - Filter by category functionality

5. **Projects Section**

   - Project cards with thumbnails
   - Search and filter functionality
   - Technology tags
   - Modal/detail view for case studies
   - Image gallery with lightbox
   - External links (live demo, GitHub)

6. **Experience Timeline**

   - Vertical timeline layout
   - Company logos
   - Position titles and dates
   - Expandable descriptions
   - Key achievements and technologies

7. **Education & Certifications**

   - Degree information with institution logos
   - Certification badges
   - Verification links
   - Dates and relevant coursework

8. **Testimonials Carousel**

   - Rotating testimonial cards
   - Author photos and credentials
   - LinkedIn verification links
   - Navigation controls

9. **Contact Form**

   - Name, email, subject, message fields
   - Form validation with error messages
   - Success/error notifications
   - reCAPTCHA integration (optional)
   - Loading state during submission

10. **Footer**
    - Copyright information
    - Social media links
    - Quick navigation links
    - Contact information

#### Admin Dashboard Components

1. **Login Page**

   - Email/username input
   - Password input with show/hide toggle
   - Remember me checkbox
   - Login button with loading state
   - Error message display

2. **Dashboard Layout**

   - Sidebar navigation
   - Top bar with user info and logout
   - Main content area
   - Breadcrumb navigation

3. **Profile Management**

   - Profile photo upload with preview
   - Resume upload with current file display
   - Professional summary editor (rich text)
   - Contact information form
   - Social media links editor
   - Save/cancel buttons

4. **Skills Management**

   - Skills list table with edit/delete actions
   - Add new skill form
   - Category dropdown
   - Proficiency level selector
   - Drag-and-drop reordering

5. **Projects Management**

   - Projects list with thumbnails
   - Add/edit project form
   - Rich text editor for descriptions
   - Multiple image upload
   - Technology tags input
   - External links fields
   - Publish/draft status toggle

6. **Experience Management**

   - Experience list timeline view
   - Add/edit position form
   - Company logo upload
   - Date range picker
   - Responsibilities bullet points editor
   - Technologies used tags

7. **Education & Certifications Management**

   - Education entries list
   - Certifications list
   - Add/edit forms for both
   - Badge/logo upload
   - Verification link input
   - Date pickers

8. **Testimonials Management**

   - Testimonials list
   - Add/edit testimonial form
   - Author photo upload
   - Author credentials input
   - LinkedIn profile link
   - Reorder functionality

9. **Analytics Dashboard**

   - Visitor count cards
   - Page views chart (line/bar)
   - Popular sections breakdown
   - Recent activity feed
   - Date range selector
   - Export data button

10. **Settings Page**
    - Change password form
    - Email notification preferences
    - Backup/restore functionality
    - Theme customization options

### Backend API Endpoints

#### Public Endpoints (No Authentication Required)

```
GET    /api/public/profile          - Get profile information
GET    /api/public/skills           - Get all skills
GET    /api/public/projects         - Get all projects (with filters)
GET    /api/public/projects/:id     - Get single project details
GET    /api/public/experience       - Get work experience
GET    /api/public/education        - Get education entries
GET    /api/public/certifications   - Get certifications
GET    /api/public/testimonials     - Get testimonials
GET    /api/public/resume           - Download resume file
POST   /api/public/contact          - Submit contact form
GET    /api/public/analytics/track  - Track page view (anonymous)
```

#### Admin Endpoints (Authentication Required)

```
POST   /api/auth/login              - Admin login
POST   /api/auth/logout             - Admin logout
POST   /api/auth/refresh            - Refresh JWT token
POST   /api/auth/change-password    - Change password

GET    /api/admin/profile           - Get admin profile
PUT    /api/admin/profile           - Update profile info
POST   /api/admin/profile/photo     - Upload profile photo
POST   /api/admin/profile/resume    - Upload resume

GET    /api/admin/skills            - Get all skills
POST   /api/admin/skills            - Create new skill
PUT    /api/admin/skills/:id        - Update skill
DELETE /api/admin/skills/:id        - Delete skill
PUT    /api/admin/skills/reorder    - Reorder skills

GET    /api/admin/projects          - Get all projects
POST   /api/admin/projects          - Create new project
PUT    /api/admin/projects/:id      - Update project
DELETE /api/admin/projects/:id      - Delete project
POST   /api/admin/projects/:id/images - Upload project images

GET    /api/admin/experience        - Get all experience
POST   /api/admin/experience        - Create new experience
PUT    /api/admin/experience/:id    - Update experience
DELETE /api/admin/experience/:id    - Delete experience

GET    /api/admin/education         - Get all education
POST   /api/admin/education         - Create new education
PUT    /api/admin/education/:id     - Update education
DELETE /api/admin/education/:id     - Delete education

GET    /api/admin/certifications    - Get all certifications
POST   /api/admin/certifications    - Create new certification
PUT    /api/admin/certifications/:id - Update certification
DELETE /api/admin/certifications/:id - Delete certification

GET    /api/admin/testimonials      - Get all testimonials
POST   /api/admin/testimonials      - Create new testimonial
PUT    /api/admin/testimonials/:id  - Update testimonial
DELETE /api/admin/testimonials/:id  - Delete testimonial
PUT    /api/admin/testimonials/reorder - Reorder testimonials

GET    /api/admin/analytics         - Get analytics data
GET    /api/admin/analytics/export  - Export analytics data

POST   /api/admin/backup            - Create backup
POST   /api/admin/restore           - Restore from backup
```

## Data Models

### User Model (Admin)

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  role: String (default: 'admin'),
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

### Profile Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  fullName: String (required),
  title: String (required),
  summary: String (rich text),
  email: String (required),
  phone: String,
  location: String,
  profilePhoto: {
    url: String,
    publicId: String,
    uploadedAt: Date
  },
  resume: {
    url: String,
    filename: String,
    uploadedAt: Date
  },
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    medium: String,
    stackoverflow: String
  },
  yearsOfExperience: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Skill Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  category: String (required), // e.g., 'Data Analysis', 'Data Engineering', 'Business Analysis'
  proficiency: Number (1-100),
  icon: String, // Icon name or URL
  order: Number,
  isVisible: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model

```javascript
{
  _id: ObjectId,
  title: String (required),
  shortDescription: String (required),
  fullDescription: String (rich text),
  technologies: [String],
  category: String, // e.g., 'Data Analysis', 'Web Development'
  images: [{
    url: String,
    caption: String,
    order: Number
  }],
  links: {
    live: String,
    github: String,
    demo: String
  },
  featured: Boolean (default: false),
  status: String (enum: ['draft', 'published']),
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Experience Model

```javascript
{
  _id: ObjectId,
  company: String (required),
  position: String (required),
  location: String,
  startDate: Date (required),
  endDate: Date, // null if current
  isCurrent: Boolean (default: false),
  description: String,
  responsibilities: [String],
  achievements: [String],
  technologies: [String],
  companyLogo: {
    url: String,
    publicId: String
  },
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Education Model

```javascript
{
  _id: ObjectId,
  institution: String (required),
  degree: String (required),
  field: String (required),
  location: String,
  startDate: Date,
  endDate: Date,
  gpa: String,
  coursework: [String],
  achievements: [String],
  institutionLogo: {
    url: String,
    publicId: String
  },
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Certification Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  issuer: String (required),
  issueDate: Date (required),
  expiryDate: Date,
  credentialId: String,
  verificationUrl: String,
  badge: {
    url: String,
    publicId: String
  },
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Testimonial Model

```javascript
{
  _id: ObjectId,
  authorName: String (required),
  authorTitle: String (required),
  authorCompany: String,
  authorPhoto: {
    url: String,
    publicId: String
  },
  content: String (required),
  linkedinUrl: String,
  relationship: String, // e.g., 'Manager', 'Colleague', 'Client'
  order: Number,
  isVisible: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### ContactMessage Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required),
  subject: String,
  message: String (required),
  ipAddress: String,
  userAgent: String,
  status: String (enum: ['new', 'read', 'replied']),
  createdAt: Date,
  updatedAt: Date
}
```

### Analytics Model

```javascript
{
  _id: ObjectId,
  date: Date (required),
  pageViews: Number (default: 0),
  uniqueVisitors: Number (default: 0),
  sections: {
    about: Number,
    skills: Number,
    projects: Number,
    experience: Number,
    education: Number,
    testimonials: Number,
    contact: Number
  },
  resumeDownloads: Number (default: 0),
  contactFormSubmissions: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Settings Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  emailNotifications: {
    contactForm: Boolean (default: true),
    weeklyReport: Boolean (default: true)
  },
  theme: {
    primaryColor: String,
    secondaryColor: String,
    accentColor: String
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

### Frontend Error Handling Strategy

1. **API Error Handling**

   - Centralized Axios interceptor for error responses
   - User-friendly error messages mapped from API error codes
   - Toast notifications for errors
   - Retry mechanism for failed requests
   - Offline detection and messaging

2. **Form Validation**

   - Real-time field validation
   - Clear error messages below fields
   - Prevent submission with invalid data
   - Highlight invalid fields

3. **Loading States**

   - Skeleton loaders for content
   - Spinner for actions
   - Disabled buttons during processing
   - Progress indicators for uploads

4. **Error Boundaries**
   - React Error Boundaries for component crashes
   - Fallback UI with error message
   - Error logging to console
   - Option to reload or go home

### Backend Error Handling Strategy

1. **Error Response Format**

```javascript
{
  success: false,
  error: {
    code: 'ERROR_CODE',
    message: 'User-friendly error message',
    details: {} // Optional technical details
  }
}
```

2. **Error Types and HTTP Status Codes**

   - 400 Bad Request: Invalid input data
   - 401 Unauthorized: Missing or invalid authentication
   - 403 Forbidden: Insufficient permissions
   - 404 Not Found: Resource doesn't exist
   - 409 Conflict: Duplicate resource
   - 422 Unprocessable Entity: Validation errors
   - 429 Too Many Requests: Rate limit exceeded
   - 500 Internal Server Error: Server-side errors

3. **Error Middleware**

   - Global error handler middleware
   - Async error wrapper for route handlers
   - Validation error formatter
   - Database error handler
   - File upload error handler

4. **Logging Strategy**
   - Console logging in development
   - File-based logging in production
   - Error severity levels (info, warn, error, critical)
   - Request/response logging
   - Performance monitoring

### Security Error Handling

1. **Authentication Errors**

   - Generic messages to prevent user enumeration
   - Rate limiting on login attempts
   - Account lockout after failed attempts
   - Secure session management

2. **File Upload Errors**

   - File type validation
   - File size limits
   - Malware scanning (optional)
   - Sanitize filenames

3. **Input Validation**
   - Server-side validation for all inputs
   - SQL injection prevention (using Mongoose)
   - XSS prevention (sanitize HTML)
   - CSRF protection

## Testing Strategy

### Frontend Testing

1. **Unit Tests**

   - Component rendering tests
   - Utility function tests
   - Custom hooks tests
   - State management tests
   - Coverage target: 70%+

2. **Integration Tests**

   - API integration tests
   - Form submission flows
   - Navigation tests
   - Authentication flows

3. **E2E Tests (Optional)**

   - Critical user journeys
   - Contact form submission
   - Admin login and content update
   - Theme switching

4. **Testing Tools**
   - Vitest for unit tests
   - React Testing Library
   - MSW for API mocking
   - Playwright for E2E (optional)

### Backend Testing

1. **Unit Tests**

   - Controller logic tests
   - Service layer tests
   - Utility function tests
   - Middleware tests
   - Coverage target: 80%+

2. **Integration Tests**

   - API endpoint tests
   - Database operations
   - Authentication flows
   - File upload functionality
   - Email service tests

3. **Testing Tools**
   - Jest for unit tests
   - Supertest for API testing
   - MongoDB Memory Server for database tests
   - Mock email service

### Manual Testing Checklist

1. **Responsive Design**

   - Test on mobile (320px, 375px, 414px)
   - Test on tablet (768px, 1024px)
   - Test on desktop (1280px, 1920px)

2. **Browser Compatibility**

   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)

3. **Accessibility**

   - Keyboard navigation
   - Screen reader compatibility
   - Color contrast validation
   - ARIA labels verification

4. **Performance**
   - Lighthouse audit (90+ score target)
   - Page load time < 2s
   - Time to interactive < 3s
   - Image optimization verification

## Security Implementation

### Authentication & Authorization

1. **JWT Token Strategy**

   - Access token: 15 minutes expiry
   - Refresh token: 7 days expiry
   - Stored in httpOnly cookies
   - CSRF token for state-changing operations

2. **Password Security**

   - Bcrypt hashing with 12 salt rounds
   - Minimum password requirements: 8 characters, 1 uppercase, 1 lowercase, 1 number
   - Password change requires current password verification
   - No password hints or recovery questions

3. **Session Management**
   - Single active session per admin user
   - Automatic logout on token expiry
   - Manual logout clears all tokens
   - Session activity tracking

### Data Encryption

1. **At Rest**

   - Email app password encrypted with AES-256
   - Encryption key stored in environment variables
   - Database connection string encrypted
   - Sensitive configuration encrypted

2. **In Transit**
   - HTTPS/TLS 1.3 for all communications
   - Secure WebSocket connections (WSS)
   - HSTS headers enabled
   - Certificate pinning (production)

### Input Validation & Sanitization

1. **Frontend Validation**

   - Client-side validation for UX
   - Email format validation
   - URL format validation
   - File type and size validation
   - XSS prevention in rich text

2. **Backend Validation**
   - Joi/Yup schema validation
   - Mongoose schema validation
   - SQL injection prevention (Mongoose ODM)
   - NoSQL injection prevention
   - HTML sanitization for rich text fields

### Rate Limiting

1. **API Rate Limits**

   - Public endpoints: 100 requests/15 minutes per IP
   - Contact form: 5 submissions/hour per IP
   - Login endpoint: 5 attempts/15 minutes per IP
   - Admin endpoints: 1000 requests/15 minutes per token

2. **Implementation**
   - Express-rate-limit middleware
   - Redis for distributed rate limiting (optional)
   - Custom error messages for rate limit exceeded

### File Upload Security

1. **Validation**

   - Whitelist allowed file types
   - Maximum file sizes: Images 5MB, Documents 10MB
   - File extension verification
   - MIME type verification

2. **Storage**

   - Files stored outside web root
   - Unique filenames (UUID)
   - Separate directories for different file types
   - Regular cleanup of orphaned files

3. **Serving Files**
   - Serve through API endpoint
   - Content-Type headers set correctly
   - Content-Disposition for downloads
   - No directory listing

## Theme System Design

### Theme Structure

```javascript
// Light Theme
const lightTheme = {
  colors: {
    primary: "#2563EB", // Blue
    secondary: "#7C3AED", // Purple
    accent: "#10B981", // Green
    background: "#FFFFFF",
    surface: "#F9FAFB",
    text: {
      primary: "#111827",
      secondary: "#6B7280",
      disabled: "#9CA3AF",
    },
    border: "#E5E7EB",
    error: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
  transitions: {
    fast: "150ms ease-in-out",
    normal: "300ms ease-in-out",
    slow: "500ms ease-in-out",
  },
};

// Dark Theme
const darkTheme = {
  colors: {
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    accent: "#34D399",
    background: "#0F172A",
    surface: "#1E293B",
    text: {
      primary: "#F1F5F9",
      secondary: "#CBD5E1",
      disabled: "#64748B",
    },
    border: "#334155",
    error: "#F87171",
    success: "#34D399",
    warning: "#FBBF24",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
  },
  transitions: {
    fast: "150ms ease-in-out",
    normal: "300ms ease-in-out",
    slow: "500ms ease-in-out",
  },
};
```

### Theme Implementation

1. **Context Provider**

   - React Context for theme state
   - localStorage for persistence
   - System preference detection
   - Smooth transition between themes

2. **CSS Variables**

   - Dynamic CSS custom properties
   - Applied to :root element
   - Automatic cascade to all components
   - No component-level theme props needed

3. **Theme Toggle**
   - Animated toggle button
   - Sun/moon icon transition
   - Keyboard accessible
   - Tooltip on hover

## Email Service Design

### Email Configuration

```javascript
const emailConfig = {
  service: "gmail",
  auth: {
    user: "galimanasa3@gmail.com",
    pass: process.env.EMAIL_APP_PASSWORD, // Encrypted in DB
  },
  secure: true,
  port: 465,
};
```

### Email Templates

1. **Contact Form Notification (to Admin)**

```html
Subject: New Contact Form Submission - Portfolio

<!DOCTYPE html>
<html>
  <head>
    <style>
      /* Professional email styling */
    </style>
  </head>
  <body>
    <div class="container">
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> {{name}} ({{email}})</p>
      <p><strong>Subject:</strong> {{subject}}</p>
      <p><strong>Message:</strong></p>
      <div class="message">{{message}}</div>
      <p><strong>Submitted:</strong> {{timestamp}}</p>
      <a href="mailto:{{email}}" class="button">Reply to {{name}}</a>
    </div>
  </body>
</html>
```

2. **Contact Form Confirmation (to Visitor)**

```html
Subject: Thank you for reaching out - Manasa Gali

<!DOCTYPE html>
<html>
  <head>
    <style>
      /* Professional email styling */
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Thank You for Your Message!</h2>
      <p>Hi {{name}},</p>
      <p>
        Thank you for reaching out through my portfolio. I have received your
        message and will get back to you within 24-48 hours.
      </p>
      <p><strong>Your message:</strong></p>
      <div class="message">{{message}}</div>
      <p>Best regards,<br />Manasa Gali</p>
      <div class="contact-info">
        <p>Email: galimanasa3@gmail.com</p>
        <p>LinkedIn: [LinkedIn URL]</p>
      </div>
    </div>
  </body>
</html>
```

### Email Service Features

1. **Queue System**

   - Failed emails queued for retry
   - Maximum 3 retry attempts
   - Exponential backoff between retries
   - Admin notification on permanent failure

2. **Email Validation**
   - RFC 5322 compliant email validation
   - DNS MX record verification (optional)
   - Disposable email detection (optional)
   - Spam detection using content analysis

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**

   - Route-based code splitting
   - Lazy loading for admin routes
   - Dynamic imports for heavy components
   - Vendor bundle optimization

2. **Image Optimization**

   - WebP format with fallbacks
   - Responsive images with srcset
   - Lazy loading with Intersection Observer
   - Blur-up placeholder technique
   - CDN delivery (optional)

3. **Caching Strategy**

   - React Query for API response caching
   - Service Worker for offline support (optional)
   - Browser caching headers
   - Static asset versioning

4. **Bundle Optimization**
   - Tree shaking
   - Minification and compression
   - Gzip/Brotli compression
   - Remove unused CSS
   - Font subsetting

### Backend Optimization

1. **Database Optimization**

   - Indexes on frequently queried fields
   - Pagination for list endpoints
   - Projection to limit returned fields
   - Connection pooling
   - Query result caching (Redis optional)

2. **API Optimization**

   - Response compression (gzip)
   - ETags for conditional requests
   - Batch endpoints where applicable
   - GraphQL for flexible queries (optional)

3. **File Serving**
   - CDN for static assets (optional)
   - Image resizing on-the-fly
   - Cache-Control headers
   - Lazy loading strategy

## Deployment Architecture

### Environment Configuration

```
Development:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Database: MongoDB local instance

Production:
- Frontend: Vercel/Netlify
- Backend: Railway/Render/Heroku
- Database: MongoDB Atlas
- File Storage: Cloudinary/AWS S3 (optional)
```

### Environment Variables

```bash
# Backend .env
NODE_ENV=production
PORT=5000

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://galimanasa3_db_user:smVLcE2OvnypjpPK@cluster0.dnkaath.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=portfolio

# JWT Configuration
JWT_SECRET=<strong-random-secret>
JWT_REFRESH_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Encryption
ENCRYPTION_KEY=<32-byte-hex-key>

# Email Configuration (Gmail)
EMAIL_USER=galimanasa3@gmail.com
EMAIL_APP_PASSWORD=dvho uffq zvqd ycgt
EMAIL_FROM_NAME=Manasa Gali
EMAIL_FROM_ADDRESS=galimanasa3@gmail.com

# Frontend URL
FRONTEND_URL=https://manasagali.com
CORS_ORIGIN=https://manasagali.com

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Frontend .env
VITE_API_URL=https://api.manasagali.com
VITE_SITE_URL=https://manasagali.com
VITE_APP_NAME=Manasa Gali Portfolio
```

### MongoDB Atlas Configuration Details

**Connection String:** `mongodb+srv://galimanasa3_db_user:smVLcE2OvnypjpPK@cluster0.dnkaath.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster0`

**Database Credentials:**

- Username: `galimanasa3_db_user`
- Password: `smVLcE2OvnypjpPK`
- Cluster: `cluster0.dnkaath.mongodb.net`
- Database Name: `portfolio`

**Email Credentials:**

- Email: `galimanasa3@gmail.com`
- App Password: `dvho uffq zvqd ycgt` (Gmail App Password for SMTP)

**Security Notes:**

- The email app password should be stored encrypted in the database
- Use environment variables for all sensitive credentials
- Never commit .env files to version control
- Rotate credentials periodically
- Use different credentials for development and production

### Deployment Checklist

1. **Pre-deployment**

   - Run all tests
   - Build production bundles
   - Environment variables configured
   - Database migrations (if any)
   - SSL certificates ready

2. **Post-deployment**

   - Smoke tests on production
   - Monitor error logs
   - Check performance metrics
   - Verify email functionality
   - Test admin login

3. **Monitoring**
   - Error tracking (Sentry optional)
   - Performance monitoring
   - Uptime monitoring
   - Database performance
   - API response times
