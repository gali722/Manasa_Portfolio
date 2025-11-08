import { useEffect, useState, useRef } from 'react';
import { Mail, MapPin, Phone, Briefcase, Award, Code, Sparkles } from 'lucide-react';
import { profileService } from '../services/profileService';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About3D = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getPublicProfile();
        if (data.success && data.data) {
          setProfile(data.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (cardsRef.current.length > 0 && !isLoading) {
      gsap.fromTo(
        cardsRef.current,
        { 
          opacity: 0, 
          y: 80,
          rotateX: -20,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }
  }, [profile, isLoading]);

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-surface/30 to-background">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6 max-w-6xl mx-auto">
            <div className="h-32 bg-surface/50 rounded-2xl"></div>
            <div className="h-32 bg-surface/50 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-surface/30 to-background relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              About Me
            </h2>
            <Sparkles className="w-6 h-6 text-secondary animate-pulse animation-delay-500" />
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
            Passionate professional dedicated to excellence and innovation
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Professional Summary Card */}
            <div
              ref={(el) => (cardsRef.current[0] = el)}
              className="group relative bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-border/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary">
                    Professional Summary
                  </h3>
                </div>
                <div
                  className="text-text-secondary leading-relaxed text-base space-y-3 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: profile.summary }}
                />
              </div>

              {/* Corner Accent */}
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Experience & Contact Card */}
            <div className="space-y-6">
              {/* Experience Badge */}
              {profile.yearsOfExperience && (
                <div
                  ref={(el) => (cardsRef.current[1] = el)}
                  className="group relative bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 overflow-hidden"
                >
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                  </div>
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm mb-2 font-medium">Professional Experience</p>
                      <p className="text-5xl font-bold mb-1">{profile.yearsOfExperience}+</p>
                      <p className="text-white/90 text-lg">Years of Excellence</p>
                    </div>
                    <div className="relative">
                      <Award className="w-20 h-20 text-white/20 group-hover:text-white/30 transition-colors duration-500" />
                      <div className="absolute inset-0 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Info Card */}
              <div
                ref={(el) => (cardsRef.current[2] = el)}
                className="group relative bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-border/50 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500"
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 via-secondary/5 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg">
                      <Mail className="w-5 h-5 text-secondary" />
                    </div>
                    <h4 className="text-lg font-semibold text-text-primary">
                      Get In Touch
                    </h4>
                  </div>
                  
                  <div className="space-y-4">
                    <a
                      href={`mailto:${profile.email}`}
                      className="group/item flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center group-hover/item:scale-110 group-hover/item:bg-primary/20 transition-all duration-300">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-text-secondary mb-0.5">Email</p>
                        <span className="text-sm text-text-primary group-hover/item:text-primary transition-colors duration-300 font-medium">
                          {profile.email}
                        </span>
                      </div>
                    </a>
                    
                    {profile.phone && (
                      <a
                        href={`tel:${profile.phone}`}
                        className="group/item flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/5 transition-all duration-300"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl flex items-center justify-center group-hover/item:scale-110 group-hover/item:bg-secondary/20 transition-all duration-300">
                          <Phone className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-text-secondary mb-0.5">Phone</p>
                          <span className="text-sm text-text-primary group-hover/item:text-secondary transition-colors duration-300 font-medium">
                            {profile.phone}
                          </span>
                        </div>
                      </a>
                    )}
                    
                    {profile.location && (
                      <div className="flex items-center gap-3 p-3 rounded-xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-text-secondary mb-0.5">Location</p>
                          <span className="text-sm text-text-primary font-medium">
                            {profile.location}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expertise Card */}
          {profile.title && (
            <div
              ref={(el) => (cardsRef.current[3] = el)}
              className="group relative bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-border/50 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500"
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                  <Code className="w-8 h-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    Core Expertise
                  </h3>
                  <p className="text-text-secondary text-lg leading-relaxed">
                    {profile.title}
                  </p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About3D;
