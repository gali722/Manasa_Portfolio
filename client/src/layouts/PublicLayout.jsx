import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SkipToContent from '../components/SkipToContent';
import ScrollToTop from '../components/ScrollToTop';
import { ProfileSkeleton } from '../components/LoadingSkeleton';
import { pageTransition } from '../utils/animations';

const PublicLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors duration-300">
      <SkipToContent />
      <Header />

      <main id="main-content" role="main" tabIndex={-1}>
        <AnimatePresence mode="wait">
          <Suspense
            fallback={
              <div 
                className="min-h-screen flex items-center justify-center p-8"
                role="status"
                aria-live="polite"
                aria-label="Loading content"
              >
                <div className="w-full max-w-6xl">
                  <ProfileSkeleton />
                </div>
              </div>
            }
          >
            <motion.div
              key={location.pathname}
              variants={pageTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </Suspense>
        </AnimatePresence>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default PublicLayout;
