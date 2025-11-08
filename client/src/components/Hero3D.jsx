import { useEffect, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Download, Mail } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { profileService } from '../services/profileService';
import LazyImage from './LazyImage';
import ParticleBackground from './3D/ParticleBackground';
import FloatingGeometry from './3D/FloatingGeometry';
import AnimatedSphere from './3D/AnimatedSphere';

const Hero3D = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleDownloadResume = () => {
    if (!profile?.resume?.url) {
      console.error('No resume available');
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const resumeUrl = profile.resume.url.startsWith('http') 
        ? profile.resume.url 
        : `${apiUrl}${profile.resume.url}`;
      
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
      {/* 3D Background Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />
          
          <Suspense fallback={null}>
            <ParticleBackground />
            <AnimatedSphere position={[-4, 2, -5]} color="#2563EB" scale={1.5} />
            <FloatingGeometry position={[5, -2, -8]} geometry="torus" color="#8B5CF6" />
            <FloatingGeometry position={[-6, -3, -6]} geometry="octahedron" color="#EC4899" />
          </Suspense>
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80 backdrop-blur-sm z-1"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6">
              <h2 className="text-lg md:text-xl text-text-secondary mb-2 animate-fade-in-up">
                Hello, I&apos;m
              </h2>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary mb-4 animate-fade-in-up animation-delay-200 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                {profile?.fullName || 'Manasa Gali'}
              </h1>
              <div className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6 animate-fade-in-up animation-delay-400">
                <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-typing">
                  {profile?.title || 'Data Analyst | Data Engineer'}
                </span>
              </div>
            </div>

            <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed animate-fade-in-up animation-delay-600">
              {profile?.summary?.substring(0, 200) || 
                'Passionate about transforming data into actionable insights and building scalable data solutions.'}
              {profile?.summary?.length > 200 && '...'}
            </p>

            {/* CTA Buttons with Glassmorphism */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-800">
              <button
                onClick={handleDownloadResume}
                className="group relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
                aria-label="Download resume"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Download className="w-5 h-5 mr-2 relative z-10" aria-hidden="true" />
                <span className="relative z-10">Download Resume</span>
              </button>
              <Link
                to="/contact"
                className="group relative inline-flex items-center justify-center px-8 py-3 bg-surface/50 backdrop-blur-md border-2 border-primary text-primary font-medium rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:bg-primary hover:text-white"
                aria-label="Navigate to contact page"
              >
                <Mail className="w-5 h-5 mr-2" aria-hidden="true" />
                Get In Touch
              </Link>
            </div>
          </div>

          {/* Profile Photo with 3D Effect */}
          <div className="flex-1 flex justify-center lg:justify-end animate-fade-in-up animation-delay-400">
            <div className="relative group">
              {/* Animated Gradient Ring */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
              
              {/* Glassmorphism Border */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full backdrop-blur-sm"></div>
              
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-surface/50 backdrop-blur-md shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                {profile?.profilePhoto?.url ? (
                  <LazyImage
                    src={profile.profilePhoto.url.startsWith('http') ? profile.profilePhoto.url : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${profile.profilePhoto.url}`}
                    alt={`${profile.fullName} - Professional headshot`}
                    className="w-full h-full object-cover"
                  />
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
      </div>
    </section>
  );
};

export default Hero3D;
