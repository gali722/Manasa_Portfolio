import { useEffect, useState, useRef, useCallback } from 'react';
import { Search, X, ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import { projectsService } from '../services/projectsService';
import LazyImage from './LazyImage';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Projects3D = ({ limit = null, showSearch = true }) => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('All');
  const [technologies, setTechnologies] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsService.getPublicProjects();
        if (data.success && data.data) {
          const publishedProjects = data.data.filter(
            (project) => project.status === 'published'
          );
          setProjects(publishedProjects);
          setFilteredProjects(publishedProjects);

          const allTechs = publishedProjects.flatMap(
            (project) => project.technologies || []
          );
          const uniqueTechs = ['All', ...new Set(allTechs)];
          setTechnologies(uniqueTechs);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { 
          opacity: 0, 
          y: 100,
          rotateX: -20,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }
  }, [filteredProjects]);

  useEffect(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.shortDescription
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.technologies?.some((tech) =>
            tech.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (selectedTech !== 'All') {
      filtered = filtered.filter((project) =>
        project.technologies?.includes(selectedTech)
      );
    }

    setFilteredProjects(filtered);
  }, [searchTerm, selectedTech, projects]);

  const displayProjects = limit
    ? filteredProjects.slice(0, limit)
    : filteredProjects;

  if (!isLoading && projects.length === 0) {
    return null;
  }

  return (
    <>
      <section
        id="projects"
        ref={sectionRef}
        className="py-20 bg-gradient-to-b from-surface/30 via-background to-surface/30 relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse animation-delay-500"></div>
          <div className="absolute bottom-40 left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent mb-4">
              Featured Projects
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
            <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
              Showcasing innovative solutions and creative implementations
            </p>
          </div>

          {showSearch && (
            <>
              {/* Search Bar with Glassmorphism */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5 z-10" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-surface/50 backdrop-blur-md border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-primary transition-all duration-300"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary transition-colors duration-200 z-10"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Technology Filter */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {technologies.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => setSelectedTech(tech)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md ${
                      selectedTech === tech
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/50 scale-105'
                        : 'bg-surface/50 text-text-secondary hover:bg-surface/80 hover:text-primary border border-border/50'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProjects.map((project, index) => (
              <ProjectCard3D
                key={project._id}
                project={project}
                ref={(el) => (cardsRef.current[index] = el)}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>

          {displayProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary text-lg">
                No projects found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onImageClick={setLightboxImage}
        />
      )}

      {lightboxImage && (
        <Lightbox
          images={selectedProject?.images || []}
          currentIndex={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </>
  );
};

const ProjectCard3D = ({ project, onClick }) => {
  const cardRef = useRef(null);
  const imageUrl = project.images?.[0]?.url;
  const thumbnail = imageUrl
    ? imageUrl.startsWith('http')
      ? imageUrl
      : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imageUrl}`
    : '/placeholder-project.jpg';

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    
    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group relative bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl border border-border/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 cursor-pointer"
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      {/* Project Image with Parallax */}
      <div className="relative h-56 overflow-hidden bg-surface">
        <LazyImage
          src={thumbnail}
          alt={project.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60"></div>
        
        {project.featured && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-accent to-secondary text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
            Featured
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="relative p-6">
        <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors duration-200 mb-2">
          {project.title}
        </h3>
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
          {project.shortDescription}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies?.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-xs rounded-lg font-medium backdrop-blur-sm border border-primary/20"
            >
              {tech}
            </span>
          ))}
          {project.technologies?.length > 3 && (
            <span className="px-3 py-1 bg-surface/50 text-text-secondary text-xs rounded-lg backdrop-blur-sm">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {project.links?.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center text-sm text-primary hover:text-secondary transition-colors duration-200 font-medium"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Live Demo
            </a>
          )}
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center text-sm text-primary hover:text-secondary transition-colors duration-200 font-medium"
            >
              <Github className="w-4 h-4 mr-1" />
              Code
            </a>
          )}
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

const ProjectModal = ({ project, onClose, onImageClick }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-surface/95 to-background/95 backdrop-blur-xl rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border/50 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface/80 backdrop-blur-md border-b border-border/50 p-6 flex justify-between items-start z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
              {project.title}
            </h2>
            <p className="text-text-secondary">{project.shortDescription}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface/50 rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {project.images && project.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.images.map((image, index) => (
                <div
                  key={index}
                  className="relative h-40 rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => onImageClick(index)}
                >
                  <LazyImage
                    src={image.url}
                    alt={image.caption || `${project.title} screenshot ${index + 1}`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">
              Project Details
            </h3>
            <div
              className="text-text-secondary leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: project.fullDescription }}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-lg text-sm font-medium backdrop-blur-sm border border-primary/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            {project.links?.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-200"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                View Live Demo
              </a>
            )}
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-surface/50 backdrop-blur-md text-text-primary border border-border/50 rounded-lg hover:bg-surface transition-all duration-200"
              >
                <Github className="w-5 h-5 mr-2" />
                View Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Lightbox = ({ images, currentIndex, onClose }) => {
  const [index, setIndex] = useState(currentIndex);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handlePrevious = useCallback(() => {
    setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
      >
        <X className="w-8 h-8" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrevious();
        }}
        className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      <div className="max-w-6xl max-h-[90vh] flex flex-col items-center">
        <img
          src={images[index]?.url}
          alt={images[index]?.caption || `Image ${index + 1}`}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        {images[index]?.caption && (
          <p className="text-white text-center mt-4 text-lg">
            {images[index].caption}
          </p>
        )}
        <p className="text-white/60 text-sm mt-2">
          {index + 1} / {images.length}
        </p>
      </div>
    </div>
  );
};

export default Projects3D;
