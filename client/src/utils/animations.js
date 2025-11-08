/**
 * Animation Variants for Framer Motion
 * Reusable animation configurations for consistent motion design
 */

// Fade in animation
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Fade in with slide up
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Fade in with slide down
export const fadeInDown = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Fade in with slide from left
export const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Fade in with slide from right
export const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Scale animation
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Stagger children animation
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Page transition
export const pageTransition = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

// Hover scale effect
export const hoverScale = {
  scale: 1.05,
  transition: {
    duration: 0.3,
    ease: 'easeInOut',
  },
};

// Tap scale effect
export const tapScale = {
  scale: 0.95,
};

// Smooth scroll animation config
export const smoothScrollConfig = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
};

// Loading skeleton animation
export const skeletonPulse = {
  hidden: { opacity: 0.6 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  },
};

// Card hover animation
export const cardHover = {
  y: -8,
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  transition: {
    duration: 0.3,
    ease: 'easeOut',
  },
};

// Rotate animation
export const rotate = {
  hidden: { rotate: 0 },
  visible: {
    rotate: 360,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

// Slide in from bottom (for modals)
export const slideInFromBottom = {
  hidden: { y: '100%', opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 200,
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
};

// Backdrop animation
export const backdropFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};
