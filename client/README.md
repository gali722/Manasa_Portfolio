# Manasa Portfolio - Frontend

This is the React frontend for Manasa Gali's portfolio website.

## Setup Complete ✓

Task 5 "Setup frontend core infrastructure" has been completed with all subtasks:

### 5.1 React Router Configuration ✓

- Configured React Router v6 with route-based code splitting
- Created public routes (Home, Projects, Contact)
- Created admin routes (Dashboard, Profile, Skills, Projects, Experience, Education, Testimonials, Analytics, Settings)
- Implemented ProtectedRoute component for admin access
- Created PublicLayout and AdminLayout components
- All pages use lazy loading for optimal performance

### 5.2 State Management & API Integration ✓

- Configured Axios with base URL and interceptors
- Implemented automatic token refresh on 401 errors
- Setup React Query for data fetching and caching
- Created API service modules for all resources:
  - authService
  - profileService
  - skillsService
  - projectsService
  - experienceService
  - educationService
  - certificationsService
  - testimonialsService
  - analyticsService
  - contactService
- Created AuthContext with login/logout functionality
- Implemented authentication hooks

### 5.3 Theme System ✓

- Created ThemeContext with light and dark themes
- Implemented theme toggle functionality
- Setup CSS variables for dynamic theming
- Theme persistence in localStorage
- System preference detection
- Created ThemeToggle component with animated icons

### 5.4 TailwindCSS & Global Styles ✓

- Configured TailwindCSS with custom theme using CSS variables
- Created comprehensive global styles with:
  - Base styles for typography and elements
  - Component classes (buttons, cards, inputs)
  - Utility classes for transitions and animations
  - Custom scrollbar styling
  - Responsive breakpoints (xs, sm, md, lg, xl, 2xl)
- Smooth transitions between themes
- Loading and fade-in animations

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Environment Variables

Create a `.env` file in the client directory:

```
VITE_API_URL=http://localhost:5000
VITE_SITE_URL=http://localhost:5173
VITE_APP_NAME=Manasa Gali Portfolio
```

## Project Structure

```
client/
├── src/
│   ├── components/        # Reusable components
│   │   ├── ProtectedRoute.jsx
│   │   └── ThemeToggle.jsx
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── layouts/           # Layout components
│   │   ├── PublicLayout.jsx
│   │   └── AdminLayout.jsx
│   ├── lib/               # Utilities and configurations
│   │   ├── axios.js
│   │   └── queryClient.js
│   ├── pages/             # Page components
│   │   ├── public/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   └── ContactPage.jsx
│   │   ├── admin/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProfileManagementPage.jsx
│   │   │   ├── SkillsManagementPage.jsx
│   │   │   ├── ProjectsManagementPage.jsx
│   │   │   ├── ExperienceManagementPage.jsx
│   │   │   ├── EducationManagementPage.jsx
│   │   │   ├── TestimonialsManagementPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── routes/            # Route configuration
│   │   └── index.jsx
│   ├── services/          # API service modules
│   │   ├── authService.js
│   │   ├── profileService.js
│   │   ├── skillsService.js
│   │   ├── projectsService.js
│   │   ├── experienceService.js
│   │   ├── educationService.js
│   │   ├── certificationsService.js
│   │   ├── testimonialsService.js
│   │   ├── analyticsService.js
│   │   └── contactService.js
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
├── .env                   # Environment variables
├── .env.example           # Environment variables template
├── index.html             # HTML template
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
└── vite.config.js         # Vite configuration
```

## Next Steps

The frontend core infrastructure is now complete. The next task is:

**Task 6: Build public portfolio frontend components**

- Create layout components (Header, Footer)
- Build Hero section
- Build About section
- Build Skills section
- Build Projects section
- Build Experience timeline
- Build Education and Certifications section
- Build Testimonials carousel
- Build Contact form
- Implement resume download functionality

All the infrastructure is in place to start building the actual UI components!
