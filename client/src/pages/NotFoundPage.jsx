import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-text-secondary mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
