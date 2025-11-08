import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, ExternalLink } from 'lucide-react';
import { profileService } from '../services/profileService';

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState({});
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getPublicProfile();
        if (data.success && data.data) {
          setSocialLinks(data.data.socialLinks || {});
          setEmail(data.data.email || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const socialIcons = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: socialLinks.linkedin,
      key: 'linkedin',
    },
    {
      name: 'GitHub',
      icon: Github,
      url: socialLinks.github,
      key: 'github',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: socialLinks.twitter,
      key: 'twitter',
    },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer 
      className="bg-surface border-t border-border mt-16"
      role="contentinfo"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-primary mb-4">Manasa Gali</h3>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Data Analyst | Data Engineer | Business Analyst | Report Developer
            </p>
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center text-sm text-text-secondary hover:text-primary transition-colors duration-200"
                aria-label={`Email Manasa Gali at ${email}`}
              >
                <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                {email}
              </a>
            )}
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer navigation">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-text-secondary hover:text-primary transition-colors duration-200"
                    aria-label={`Navigate to ${link.name}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Connect</h3>
            <div className="flex space-x-4" role="list" aria-label="Social media links">
              {socialIcons.map(
                (social) =>
                  social.url && (
                    <a
                      key={social.key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-text-secondary hover:text-primary hover:bg-background rounded-lg transition-all duration-200 transform hover:scale-110"
                      aria-label={`Visit ${social.name} profile (opens in new tab)`}
                    >
                      <social.icon className="w-5 h-5" aria-hidden="true" />
                    </a>
                  )
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-text-secondary">
              &copy; {new Date().getFullYear()} Manasa Gali. All rights reserved.
            </p>
            <p className="text-sm text-text-secondary">
              Built with React & Node.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
