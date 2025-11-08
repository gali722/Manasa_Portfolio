import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', hash: '#home' },
    { name: 'About', path: '/', hash: '#about' },
    { name: 'Skills', path: '/', hash: '#skills' },
    { name: 'Projects', path: '/projects', hash: '' },
    { name: 'Experience', path: '/', hash: '#experience' },
    { name: 'Education', path: '/', hash: '#education' },
    { name: 'Testimonials', path: '/', hash: '#testimonials' },
    { name: 'Contact', path: '/contact', hash: '' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleNavClick = (e, hash) => {
    if (hash && location.pathname === '/') {
      e.preventDefault();
      const element = document.querySelector(hash);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      role="banner"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/95 backdrop-blur-sm shadow-md'
          : 'bg-surface'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo/Name */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold text-primary hover:text-secondary transition-colors duration-300"
            aria-label="Manasa Gali - Home"
          >
            Manasa Gali
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden lg:flex items-center space-x-1"
            role="navigation"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path + link.hash}
                onClick={(e) => handleNavClick(e, link.hash)}
                className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-200 rounded-md hover:bg-background"
                aria-label={`Navigate to ${link.name}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-text-secondary hover:text-primary transition-colors duration-200"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          aria-hidden={!isMobileMenuOpen}
        >
          <nav 
            className="py-4 space-y-1"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path + link.hash}
                onClick={(e) => handleNavClick(e, link.hash)}
                className="block px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary hover:bg-background rounded-md transition-colors duration-200"
                aria-label={`Navigate to ${link.name}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
