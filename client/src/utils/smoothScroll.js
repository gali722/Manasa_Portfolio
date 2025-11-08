/**
 * Smooth scroll utility for navigation
 */

/**
 * Smooth scroll to element by ID
 * @param {string} elementId - The ID of the element to scroll to
 * @param {number} offset - Optional offset from the top (for fixed headers)
 */
export const smoothScrollTo = (elementId, offset = 80) => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.warn(`Element with ID "${elementId}" not found`);
    return;
  }

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
};

/**
 * Smooth scroll to top
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - The element to check
 * @param {number} threshold - Percentage of element that should be visible (0-1)
 */
export const isInViewport = (element, threshold = 0.1) => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView = rect.top <= windowHeight && rect.top + rect.height * threshold >= 0;
  const horInView = rect.left <= windowWidth && rect.left + rect.width * threshold >= 0;

  return vertInView && horInView;
};

/**
 * Debounce function for scroll events
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
export const debounce = (func, wait = 100) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Get scroll progress (0-1)
 */
export const getScrollProgress = () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  return height > 0 ? winScroll / height : 0;
};
