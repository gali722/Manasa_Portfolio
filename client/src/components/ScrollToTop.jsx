import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { scrollToTop } from '../utils/smoothScroll';
import { scaleIn } from '../utils/animations';

/**
 * Scroll to top button that appears when user scrolls down
 */
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
