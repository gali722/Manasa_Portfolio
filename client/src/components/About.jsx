import { useEffect, useState, useRef } from 'react';
import { Mail, MapPin, Phone, Briefcase, Award, Code } from 'lucide-react';
import { profileService } from '../services/profileService';

const About = () => {
  const [profile, setProfile] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
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

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  // Don't hide section while loading - show loading state instead
  const isLoading = !profile;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 bg-surface/50"
    >
      <div className="container mx-auto px-4">
        <div
          className={`transition-all duration-1000 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              About Me
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>

          {isLoading ? (
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-32 bg-surface rounded-xl"></div>
                <div className="h-32 bg-surface rounded-xl"></div>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                {/* Professional Summary */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary mb-4 flex items-center">
                      <Briefcase className="w-6 h-6 mr-3 text-primary" />
                      Professional Summary
                    </h3>
                    <div
                      className="text-text-secondary leading-relaxed text-base space-y-3"
                      dangerouslySetInnerHTML={{ __html: profile.summary }}
                    />
                  </div>
                </div>

              {/* Stats and Contact */}
              <div className="space-y-6">
                {/* Experience Card */}
                {profile.yearsOfExperience && (
                  <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-8 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm mb-1">Experience</p>
                        <p className="text-4xl font-bold">{profile.yearsOfExperience}+ Years</p>
                      </div>
                      <Award className="w-16 h-16 text-white/20" />
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="bg-background rounded-xl p-6 shadow-lg border border-border">
                  <h4 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-primary" />
                    Get In Touch
                  </h4>
                  <div className="space-y-3">
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center text-text-secondary hover:text-primary transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm">{profile.email}</span>
                    </a>
                    
                    {profile.phone && (
                      <a
                        href={`tel:${profile.phone}`}
                        className="flex items-center text-text-secondary hover:text-primary transition-colors group"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm">{profile.phone}</span>
                      </a>
                    )}
                    
                    {profile.location && (
                      <div className="flex items-center text-text-secondary">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm">{profile.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

              {/* Skills Highlight */}
              {profile.title && (
                <div className="bg-background rounded-xl p-8 shadow-lg border border-border">
                  <div className="flex items-center mb-4">
                    <Code className="w-6 h-6 mr-3 text-primary" />
                    <h3 className="text-xl font-bold text-text-primary">
                      Expertise
                    </h3>
                  </div>
                  <p className="text-text-secondary text-lg">
                    {profile.title}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
