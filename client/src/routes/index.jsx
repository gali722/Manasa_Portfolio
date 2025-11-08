import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('../pages/public/HomePage'));
const ProjectsPage = lazy(() => import('../pages/public/ProjectsPage'));
const ContactPage = lazy(() => import('../pages/public/ContactPage'));

const LoginPage = lazy(() => import('../pages/admin/LoginPage'));
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const ProfileManagementPage = lazy(() => import('../pages/admin/ProfileManagementPage'));
const SkillsManagementPage = lazy(() => import('../pages/admin/SkillsManagementPage'));
const ProjectsManagementPage = lazy(() => import('../pages/admin/ProjectsManagementPage'));
const ExperienceManagementPage = lazy(() => import('../pages/admin/ExperienceManagementPage'));
const EducationManagementPage = lazy(() => import('../pages/admin/EducationManagementPage'));
const TestimonialsManagementPage = lazy(() => import('../pages/admin/TestimonialsManagementPage'));
const AnalyticsPage = lazy(() => import('../pages/admin/AnalyticsPage'));
const SettingsPage = lazy(() => import('../pages/admin/SettingsPage'));

const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'projects',
        element: <ProjectsPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
    ],
  },
  // Admin routes
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'profile',
        element: <ProfileManagementPage />,
      },
      {
        path: 'skills',
        element: <SkillsManagementPage />,
      },
      {
        path: 'projects',
        element: <ProjectsManagementPage />,
      },
      {
        path: 'experience',
        element: <ExperienceManagementPage />,
      },
      {
        path: 'education',
        element: <EducationManagementPage />,
      },
      {
        path: 'testimonials',
        element: <TestimonialsManagementPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  // 404 route
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
