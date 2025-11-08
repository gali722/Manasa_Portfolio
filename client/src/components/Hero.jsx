import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Mail, ArrowDown } from 'lucide-react';
import { profileService } from '../services/profileService';
import LazyImage from './LazyImage';

const Hero = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getPublicProfile();
        if (data.success && data.data) {
          setProfile(data.data);
          console.log('Profile data:', data.data);
          console.log('Profile photo URL:', data.data.profilePhoto?.url);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleDownloadResume = () => {
    if (!profile?.resume?.url) {
      console.error('No resume available');
      return;
    }

    try {
      // Construct full URL for the resume
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const resumeUrl = profile.resume.url.startsWith('http') 
        ? profile.resume.url 
        : `${apiUrl}${profile.resume.url}`;
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = profile.resume.filename || `${profile.fullName}_Resume.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 animate-gradient-shift"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6">
              <h2 className="text-lg md:text-xl text-text-secondary mb-2 animate-fade-in-up">
                Hello, I&apos;m
              </h2>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-4 animate-fade-in-up animation-delay-200">
                {profile?.fullName || 'Manasa Gali'}
              </h1>
              <div className="text-xl md:text-2xl lg:text-3xl text-primary font-semibold mb-6 animate-fade-in-up animation-delay-400">
                <span className="inline-block animate-typing">
                  {profile?.title || 'Data Analyst | Data Engineer'}
                </span>
              </div>
            </div>

            <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed animate-fade-in-up animation-delay-600">
              {profile?.summary?.substring(0, 200) || 
                'Passionate about transforming data into actionable insights and building scalable data solutions.'}
              {profile?.summary?.length > 200 && '...'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-800">
              <button
                onClick={handleDownloadResume}
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                aria-label="Download resume"
              >
                <Download className="w-5 h-5 mr-2" aria-hidden="true" />
                Download Resume
              </button>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transform hover:scale-105 transition-all duration-300"
                aria-label="Navigate to contact page"
              >
                <Mail className="w-5 h-5 mr-2" aria-hidden="true" />
                Get In Touch
              </Link>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="flex-1 flex justify-center lg:justify-end animate-fade-in-up animation-delay-400">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-surface shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                {profile?.profilePhoto?.url ? (
                  <>
                    {console.log('Image URL:', profile.profilePhoto.url.startsWith('http') ? profile.profilePhoto.url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${profile.profilePhoto.url}`)}
                    <LazyImage
                      src={profile.profilePhoto.url.startsWith('http') ? profile.profilePhoto.url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${profile.profilePhoto.url}`}
                      alt={`${profile.fullName} - Professional headshot`}
                      className="w-full h-full object-cover"
                    />
                  </>
                ) : (
                  <div 
                    className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-6xl font-bold"
                    role="img"
                    aria-label={`${profile?.fullName || 'Profile'} initial`}
                  >
                    {profile?.fullName?.charAt(0) || 'M'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
          aria-hidden="true"
        >
          <ArrowDown className="w-6 h-6 text-text-secondary" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
