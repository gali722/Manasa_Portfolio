import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * LazyImage component with Intersection Observer for lazy loading
 * Includes blur-up placeholder technique for better UX
 */
const LazyImage = ({
  src,
  alt,
  className = '',
  placeholderClassName = '',
  onLoad,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div ref={imgRef} className="relative overflow-hidden">
      {/* Placeholder */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-surface animate-pulse ${placeholderClassName}`}
          aria-hidden="true"
        />
      )}

      {/* Actual image - only load when in view */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
          onLoad={handleLoad}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholderClassName: PropTypes.string,
  onLoad: PropTypes.func,
};

export default LazyImage;
