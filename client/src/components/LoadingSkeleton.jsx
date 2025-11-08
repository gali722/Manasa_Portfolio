import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { skeletonPulse } from '../utils/animations';

/**
 * Reusable loading skeleton component
 */
const LoadingSkeleton = ({ className = '', variant = 'default' }) => {
  const baseClasses = 'bg-surface rounded';
  
  const variantClasses = {
    default: 'h-4 w-full',
    title: 'h-8 w-3/4',
    subtitle: 'h-6 w-1/2',
    text: 'h-4 w-full',
    avatar: 'h-16 w-16 rounded-full',
    card: 'h-48 w-full',
    button: 'h-10 w-32',
  };

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      variants={skeletonPulse}
      initial="hidden"
      animate="visible"
      aria-label="Loading..."
      role="status"
    />
  );
};

LoadingSkeleton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'title', 'subtitle', 'text', 'avatar', 'card', 'button']),
};

/**
 * Card skeleton for project/experience cards
 */
export const CardSkeleton = () => {
  return (
    <div className="bg-background rounded-lg overflow-hidden shadow-md border border-border p-6 space-y-4">
      <LoadingSkeleton variant="card" />
      <LoadingSkeleton variant="title" />
      <LoadingSkeleton variant="text" />
      <LoadingSkeleton variant="text" className="w-4/5" />
      <div className="flex gap-2">
        <LoadingSkeleton variant="button" />
        <LoadingSkeleton variant="button" />
      </div>
    </div>
  );
};

/**
 * Profile skeleton for hero section
 */
export const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
      <div className="flex-1 space-y-6">
        <LoadingSkeleton variant="subtitle" />
        <LoadingSkeleton variant="title" />
        <LoadingSkeleton variant="text" />
        <LoadingSkeleton variant="text" className="w-4/5" />
        <div className="flex gap-4">
          <LoadingSkeleton variant="button" />
          <LoadingSkeleton variant="button" />
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <LoadingSkeleton className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full" />
      </div>
    </div>
  );
};

/**
 * List skeleton for skills/experience
 */
export const ListSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="bg-background rounded-lg p-6 space-y-3">
          <div className="flex items-center gap-4">
            <LoadingSkeleton variant="avatar" />
            <div className="flex-1 space-y-2">
              <LoadingSkeleton variant="title" />
              <LoadingSkeleton variant="text" className="w-2/3" />
            </div>
          </div>
          <LoadingSkeleton variant="text" />
          <LoadingSkeleton variant="text" className="w-5/6" />
        </div>
      ))}
    </div>
  );
};

ListSkeleton.propTypes = {
  count: PropTypes.number,
};

/**
 * Grid skeleton for projects
 */
export const GridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
};

GridSkeleton.propTypes = {
  count: PropTypes.number,
};

export default LoadingSkeleton;
