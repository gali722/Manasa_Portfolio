# API Documentation

Complete API reference for the Manasa Gali Portfolio backend.

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Public Endpoints](#public-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Response Formats](#response-formats)
- [Status Codes](#status-codes)

## Overview

The Portfolio API is a RESTful API built with Express.js and MongoDB. It provides endpoints for both public portfolio viewing and admin content management.

### API Version

Current Version: `v1`

### Content Type

All requests and responses use `application/json` content type.

### Date Format

All dates are in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`

## Base URL

### Development

```
http://localhost:5000/api
```

### Production

```
https://api.manasagali.com/api
```

## Authentication

### JWT Token Authentication

Admin endpoints require JWT token authentication.

#### Login

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "galimanasa3@gmail.com",
  "password": "your-password"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "email": "galimanasa3@gmail.com",
      "name": "Manasa Gali",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Using the Token

Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your-token>
```

#### Token Expiration

- Access Token: 15 minutes
- Refresh Token: 7 days

#### Refresh Token

```http
POST /api/auth/refresh
```

**Request Body:**

```json
{
  "refreshToken": "your-refresh-token"
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Invalid input data
- `AUTHENTICATION_ERROR` - Invalid or missing credentials
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `DUPLICATE_ERROR` - Resource already exists
- `RATE_LIMIT_ERROR` - Too many requests
- `SERVER_ERROR` - Internal server error

## Rate Limiting

### Limits

- **Public Endpoints:** 100 requests per 15 minutes per IP
- **Contact Form:** 5 submissions per hour per IP
- **Login Endpoint:** 5 attempts per 15 minutes per IP
- **Admin Endpoints:** 1000 requests per 15 minutes per token

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1635724800
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_ERROR",
    "message": "Too many requests, please try again later"
  }
}
```

## Public Endpoints

### Profile

#### Get Profile

```http
GET /api/public/profile
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "profile_id",
    "fullName": "Manasa Gali",
    "title": "Data Analyst | Data Engineer",
    "summary": "Professional summary...",
    "email": "galimanasa3@gmail.com",
    "phone": "+1 (555) 123-4567",
    "location": "United States",
    "profilePhoto": {
      "url": "https://example.com/photo.jpg",
      "uploadedAt": "2023-01-01T00:00:00.000Z"
    },
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/manasagali",
      "github": "https://github.com/manasagali"
    },
    "yearsOfExperience": 5
  }
}
```

### Skills

#### Get All Skills

```http
GET /api/public/skills
```

**Query Parameters:**

- `category` (optional) - Filter by category

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "skill_id",
      "name": "Python",
      "category": "Data Analysis",
      "proficiency": 90,
      "icon": "python-icon",
      "order": 1,
      "isVisible": true
    }
  ]
}
```

### Projects

#### Get All Projects

```http
GET /api/public/projects
```

**Query Parameters:**

- `category` (optional) - Filter by category
- `search` (optional) - Search in title and description
- `featured` (optional) - Filter featured projects (true/false)
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "_id": "project_id",
        "title": "Sales Analytics Dashboard",
        "shortDescription": "Interactive dashboard...",
        "fullDescription": "Detailed description...",
        "technologies": ["Power BI", "SQL"],
        "category": "Data Analysis",
        "images": [
          {
            "url": "https://example.com/image.jpg",
            "caption": "Dashboard overview"
          }
        ],
        "links": {
          "live": "https://example.com",
          "github": "https://github.com/..."
        },
        "featured": true,
        "status": "published"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}
```

#### Get Single Project

```http
GET /api/public/projects/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "project_id",
    "title": "Sales Analytics Dashboard"
    // ... full project details
  }
}
```

### Experience

#### Get All Experience

```http
GET /api/public/experience
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "experience_id",
      "company": "Tech Solutions Inc.",
      "position": "Senior Data Analyst",
      "location": "New York, NY",
      "startDate": "2021-06-01T00:00:00.000Z",
      "endDate": null,
      "isCurrent": true,
      "description": "Leading data analytics...",
      "responsibilities": ["Design dashboards", "Perform analysis"],
      "achievements": ["Reduced reporting time by 40%"],
      "technologies": ["Python", "SQL"],
      "companyLogo": {
        "url": "https://example.com/logo.png"
      }
    }
  ]
}
```

### Education

#### Get All Education

```http
GET /api/public/education
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "education_id",
      "institution": "University of Technology",
      "degree": "Master of Science",
      "field": "Data Science",
      "location": "Boston, MA",
      "startDate": "2017-09-01T00:00:00.000Z",
      "endDate": "2019-05-31T00:00:00.000Z",
      "gpa": "3.9/4.0",
      "coursework": ["Machine Learning", "Statistics"],
      "achievements": ["Dean's List"]
    }
  ]
}
```

### Certifications

#### Get All Certifications

```http
GET /api/public/certifications
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "certification_id",
      "name": "AWS Certified Data Analytics",
      "issuer": "Amazon Web Services",
      "issueDate": "2022-08-15T00:00:00.000Z",
      "expiryDate": "2025-08-15T00:00:00.000Z",
      "credentialId": "AWS-DAS-12345",
      "verificationUrl": "https://aws.amazon.com/verify/...",
      "badge": {
        "url": "https://example.com/badge.png"
      }
    }
  ]
}
```

### Testimonials

#### Get All Testimonials

```http
GET /api/public/testimonials
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "testimonial_id",
      "authorName": "John Smith",
      "authorTitle": "Director of Analytics",
      "authorCompany": "Tech Solutions Inc.",
      "authorPhoto": {
        "url": "https://example.com/photo.jpg"
      },
      "content": "Manasa is an exceptional...",
      "linkedinUrl": "https://linkedin.com/in/johnsmith",
      "relationship": "Manager",
      "isVisible": true
    }
  ]
}
```

### Resume

#### Download Resume

```http
GET /api/public/resume
```

**Response:** File download (PDF or DOCX)

### Contact

#### Submit Contact Form

```http
POST /api/public/contact
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Job Opportunity",
  "message": "I would like to discuss..."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

### Analytics

#### Track Page View

```http
POST /api/public/analytics/track
```

**Request Body:**

```json
{
  "section": "projects"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Analytics tracked"
}
```

## Admin Endpoints

All admin endpoints require authentication via JWT token.

### Authentication

#### Login

```http
POST /api/auth/login
```

See [Authentication](#authentication) section for details.

#### Logout

```http
POST /api/auth/logout
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Refresh Token

```http
POST /api/auth/refresh
```

See [Authentication](#authentication) section for details.

#### Change Password

```http
POST /api/auth/change-password
```

**Request Body:**

```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Profile Management

#### Get Admin Profile

```http
GET /api/admin/profile
```

**Response:** Same as public profile with additional fields

#### Update Profile

```http
PUT /api/admin/profile
```

**Request Body:**

```json
{
  "fullName": "Manasa Gali",
  "title": "Data Analyst",
  "summary": "Professional summary...",
  "email": "galimanasa3@gmail.com",
  "phone": "+1 (555) 123-4567",
  "location": "United States",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/manasagali"
  },
  "yearsOfExperience": 5
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    // Updated profile
  }
}
```

#### Upload Profile Photo

```http
POST /api/admin/profile/photo
```

**Request:** Multipart form data with `photo` field

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://example.com/photo.jpg",
    "uploadedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Upload Resume

```http
POST /api/admin/profile/resume
```

**Request:** Multipart form data with `resume` field

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://example.com/resume.pdf",
    "filename": "resume.pdf",
    "uploadedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Skills Management

#### Get All Skills (Admin)

```http
GET /api/admin/skills
```

**Response:** Same as public endpoint

#### Create Skill

```http
POST /api/admin/skills
```

**Request Body:**

```json
{
  "name": "Python",
  "category": "Data Analysis",
  "proficiency": 90,
  "icon": "python-icon",
  "isVisible": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "skill_id"
    // ... skill details
  }
}
```

#### Update Skill

```http
PUT /api/admin/skills/:id
```

**Request Body:** Same as create

**Response:**

```json
{
  "success": true,
  "data": {
    // Updated skill
  }
}
```

#### Delete Skill

```http
DELETE /api/admin/skills/:id
```

**Response:**

```json
{
  "success": true,
  "message": "Skill deleted successfully"
}
```

#### Reorder Skills

```http
PUT /api/admin/skills/reorder
```

**Request Body:**

```json
{
  "skills": [
    { "id": "skill_id_1", "order": 1 },
    { "id": "skill_id_2", "order": 2 }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Skills reordered successfully"
}
```

### Projects Management

#### Get All Projects (Admin)

```http
GET /api/admin/projects
```

**Response:** Includes draft projects

#### Create Project

```http
POST /api/admin/projects
```

**Request Body:**

```json
{
  "title": "Project Title",
  "shortDescription": "Brief description",
  "fullDescription": "Detailed description",
  "technologies": ["Tech1", "Tech2"],
  "category": "Data Analysis",
  "links": {
    "live": "https://example.com",
    "github": "https://github.com/..."
  },
  "featured": false,
  "status": "published"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "project_id"
    // ... project details
  }
}
```

#### Update Project

```http
PUT /api/admin/projects/:id
```

**Request Body:** Same as create

#### Delete Project

```http
DELETE /api/admin/projects/:id
```

#### Upload Project Images

```http
POST /api/admin/projects/:id/images
```

**Request:** Multipart form data with `images` field (multiple files)

**Response:**

```json
{
  "success": true,
  "data": {
    "images": [
      {
        "url": "https://example.com/image1.jpg",
        "caption": ""
      }
    ]
  }
}
```

### Experience Management

#### Create Experience

```http
POST /api/admin/experience
```

**Request Body:**

```json
{
  "company": "Company Name",
  "position": "Job Title",
  "location": "City, State",
  "startDate": "2021-06-01",
  "endDate": null,
  "isCurrent": true,
  "description": "Role description",
  "responsibilities": ["Task 1", "Task 2"],
  "achievements": ["Achievement 1"],
  "technologies": ["Tech1", "Tech2"]
}
```

#### Update Experience

```http
PUT /api/admin/experience/:id
```

#### Delete Experience

```http
DELETE /api/admin/experience/:id
```

### Education Management

#### Create Education

```http
POST /api/admin/education
```

**Request Body:**

```json
{
  "institution": "University Name",
  "degree": "Master of Science",
  "field": "Data Science",
  "location": "City, State",
  "startDate": "2017-09-01",
  "endDate": "2019-05-31",
  "gpa": "3.9/4.0",
  "coursework": ["Course 1", "Course 2"],
  "achievements": ["Achievement 1"]
}
```

#### Update Education

```http
PUT /api/admin/education/:id
```

#### Delete Education

```http
DELETE /api/admin/education/:id
```

### Certifications Management

#### Create Certification

```http
POST /api/admin/certifications
```

**Request Body:**

```json
{
  "name": "Certification Name",
  "issuer": "Issuing Organization",
  "issueDate": "2022-08-15",
  "expiryDate": "2025-08-15",
  "credentialId": "CERT-12345",
  "verificationUrl": "https://verify.example.com"
}
```

#### Update Certification

```http
PUT /api/admin/certifications/:id
```

#### Delete Certification

```http
DELETE /api/admin/certifications/:id
```

### Testimonials Management

#### Create Testimonial

```http
POST /api/admin/testimonials
```

**Request Body:**

```json
{
  "authorName": "John Smith",
  "authorTitle": "Director",
  "authorCompany": "Company Name",
  "content": "Testimonial text...",
  "linkedinUrl": "https://linkedin.com/in/johnsmith",
  "relationship": "Manager",
  "isVisible": true
}
```

#### Update Testimonial

```http
PUT /api/admin/testimonials/:id
```

#### Delete Testimonial

```http
DELETE /api/admin/testimonials/:id
```

#### Reorder Testimonials

```http
PUT /api/admin/testimonials/reorder
```

**Request Body:**

```json
{
  "testimonials": [
    { "id": "testimonial_id_1", "order": 1 },
    { "id": "testimonial_id_2", "order": 2 }
  ]
}
```

### Analytics

#### Get Analytics Data

```http
GET /api/admin/analytics
```

**Query Parameters:**

- `startDate` (optional) - Start date (ISO format)
- `endDate` (optional) - End date (ISO format)
- `range` (optional) - Predefined range (7d, 30d, 90d, all)

**Response:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalPageViews": 1250,
      "uniqueVisitors": 850,
      "resumeDownloads": 45,
      "contactFormSubmissions": 12
    },
    "sections": {
      "about": 320,
      "skills": 280,
      "projects": 450,
      "experience": 200,
      "education": 150,
      "testimonials": 180,
      "contact": 120
    },
    "daily": [
      {
        "date": "2023-01-01",
        "pageViews": 50,
        "uniqueVisitors": 35
      }
    ]
  }
}
```

#### Export Analytics

```http
GET /api/admin/analytics/export
```

**Query Parameters:**

- `format` - Export format (csv, json)
- `startDate` (optional)
- `endDate` (optional)

**Response:** File download

### Backup & Restore

#### Create Backup

```http
POST /api/admin/backup
```

**Response:** Backup file download

#### Restore from Backup

```http
POST /api/admin/restore
```

**Request:** Multipart form data with `backup` field

**Response:**

```json
{
  "success": true,
  "message": "Backup restored successfully"
}
```

## Response Formats

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Success Response with Message

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Optional response data
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

## Status Codes

### Success Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `204 No Content` - Request succeeded with no response body

### Client Error Codes

- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (duplicate)
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded

### Server Error Codes

- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service temporarily unavailable

## File Upload Specifications

### Supported Formats

**Images:**

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- SVG (.svg) - for logos only

**Documents:**

- PDF (.pdf)
- DOCX (.docx)

### Size Limits

- Profile Photo: 5MB
- Project Images: 5MB per image
- Company Logos: 2MB
- Resume: 10MB
- Certification Badges: 1MB

### Image Recommendations

- Profile Photo: 400x400px (square)
- Project Images: 1200x800px (landscape)
- Company Logos: 200x200px (square) or 300x100px (rectangular)
- Certification Badges: 200x200px (square)

## Webhooks (Future Feature)

Webhooks for real-time notifications will be available in a future version.

## Changelog

### Version 1.0.0 (Current)

- Initial API release
- All core endpoints implemented
- JWT authentication
- File upload support
- Analytics tracking

---

**API Version:** 1.0.0

**Last Updated:** November 2025

**Support:** galimanasa3@gmail.com
