import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, Linkedin, Github } from 'lucide-react';
import ContactForm from '../../components/ContactForm';
import ResumeDownload from '../../components/ResumeDownload';
import SEO from '../../components/SEO';
import { profileService } from '../../services/profileService';
import { generateBreadcrumbStructuredData } from '../../utils/structuredData';

const ContactPage = () => {
  const [profile, setProfile] = useState(null);

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ];

  const breadcrumbStructuredData = generateBreadcrumbStructuredData(breadcrumbs);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getPublicProfile();
        if (data.success && data.data) {
          setProfile(data.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen py-20 bg-background">
      <SEO
        title="Contact - Manasa Gali"
        description="Get in touch with Manasa Gali for professional opportunities, collaborations, or inquiries about data analysis, data engineering, and business intelligence services."
        keywords="Contact, Get in Touch, Professional Inquiries, Data Analysis Services, Business Intelligence Consulting"
        canonicalUrl="/contact"
        structuredData={breadcrumbStructuredData}
      />
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Get In Touch
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-6"></div>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Have a question or want to work together? Feel free to reach out!
            I&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-6">
            {/* Contact Details Card */}
            <div className="bg-surface rounded-lg p-6 shadow-lg border border-border">
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-start space-x-3 group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-secondary mb-1">Email</p>
                      <p className="text-sm text-text-primary group-hover:text-primary transition-colors duration-200 break-all">
                        {profile.email}
                      </p>
                    </div>
                  </a>
                )}

                {profile?.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-start space-x-3 group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-secondary mb-1">Phone</p>
                      <p className="text-sm text-text-primary group-hover:text-primary transition-colors duration-200">
                        {profile.phone}
                      </p>
                    </div>
                  </a>
                )}

                {profile?.location && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-secondary mb-1">Location</p>
                      <p className="text-sm text-text-primary">{profile.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links Card */}
            {profile?.socialLinks && (
              <div className="bg-surface rounded-lg p-6 shadow-lg border border-border">
                <h3 className="text-xl font-semibold text-text-primary mb-4">
                  Connect With Me
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.socialLinks.linkedin && (
                    <a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                    >
                      <Linkedin className="w-5 h-5 mr-2" />
                      LinkedIn
                    </a>
                  )}
                  {profile.socialLinks.github && (
                    <a
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                    >
                      <Github className="w-5 h-5 mr-2" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Resume Download Card */}
            <ResumeDownload variant="card" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
