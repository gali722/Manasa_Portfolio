import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Calendar } from 'lucide-react';
import { profileService } from '../services/profileService';
import { fadeInUp, staggerContainer } from '../utils/animations';

const About = () => {
  const [profile, setProfile] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [yearsCount, setYearsCount] = useState(0);
  const sectionRef = useRef(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && profile?.yearsOfExperience) {
      const targetYears = profile.yearsOfExperience;
      const duration = 2000;
      const steps = 60;
      const increment = targetYears / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetYears) {
          setYearsCount(targetYears);
          clearInterval(timer);
        } else {
          setYearsCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, profile?.yearsOfExperience]);

  if (!profile) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded w-1/4 mx-auto mb-8"></div>
            <div className="h-4 bg-surface rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-surface rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: profile.phone,
      href: `tel:${profile.phone}`,
      show: !!profile.phone,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: profile.location,
      show: !!profile.location,
    },
  ].filter((item) => item.show !== false);

  return (
    <motion.section
      id="about"
      ref={sectionRef}
      className="py-20 bg-surface/50"
      aria-labelledby="about-heading"
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={staggerContainer}
    >
      <div className="container mx-auto px-4">
        <motion.div variants={fadeInUp}>
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 id="about-heading" className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              About Me
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" aria-hidden="true"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Professional Summary */}
            <div className="lg:col-span-2">
              <div className="bg-background rounded-lg p-6 md:p-8 shadow-lg border border-border">
                <h3 className="text-2xl font-semibold text-text-primary mb-4">
                  Professional Summary
                </h3>
                <div
                  className="text-text-secondary leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: profile.summary }}
                />
              </div>
            </div>

            {/* Stats & Contact */}
            <div className="space-y-6">
              {/* Years of Experience Card */}
              {profile.yearsOfExperience && (
                <div className="bg-gradient-to-br from-primary to-secondary rounded-lg p-6 md:p-8 shadow-lg text-white text-center transform hover:scale-105 transition-transform duration-300">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <div className="text-5xl font-bold mb-2">{yearsCount}+</div>
                  <div className="text-lg opacity-90">Years of Experience</div>
                </div>
              )}

              {/* Contact Information Card */}
              <div className="bg-background rounded-lg p-6 shadow-lg border border-border">
                <h3 className="text-xl font-semibold text-text-primary mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                        <item.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text-secondary mb-1">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="text-sm text-text-primary hover:text-primary transition-colors duration-200 break-all"
                            aria-label={`${item.label}: ${item.value}`}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm text-text-primary break-all">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default About;
