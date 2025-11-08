import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { queryClient } from './lib/queryClient';
import { router } from './routes';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);

// Register service worker for caching
serviceWorkerRegistration.register({
  onSuccess: () => console.log('Service Worker registered successfully'),
  onUpdate: (registration) => {
    console.log('New version available! Please refresh.');
    // Optionally show a notification to the user
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  },
});
