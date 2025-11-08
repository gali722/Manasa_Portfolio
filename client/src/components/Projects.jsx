import { useEffect, useState, useRef } from 'react';
import { Search, X, ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import { projectsService } from '../services/projectsService';
import LazyImage from './LazyImage';

const Projects = ({ limit = null, showSearch = true }) => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState('All');
  const [technologies, setTechnologies] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);

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

          // Extract unique technologies
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
    let filtered = projects;

    // Filter by search term
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

    // Filter by technology
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

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded w-1/4 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-surface rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="projects"
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
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Featured Projects
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
            </div>

            {showSearch && (
              <>
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-primary"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Technology Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                  {technologies.map((tech) => (
                    <button
                      key={tech}
                      onClick={() => setSelectedTech(tech)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedTech === tech
                          ? 'bg-primary text-white shadow-lg scale-105'
                          : 'bg-background text-text-secondary hover:bg-primary/10 hover:text-primary border border-border'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProjects.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  delay={index * 0.1}
                  isVisible={isVisible}
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
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onImageClick={setLightboxImage}
        />
      )}

      {/* Lightbox */}
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

const ProjectCard = ({ project, delay, isVisible, onClick }) => {
  const thumbnail = project.images?.[0]?.url || '/placeholder-project.jpg';

  return (
    <div
      className={`bg-background rounded-lg overflow-hidden shadow-md border border-border hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer ${
        isVisible ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${delay}s` }}
      onClick={onClick}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden bg-surface">
        <LazyImage
          src={thumbnail}
          alt={project.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        {project.featured && (
          <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-2 hover:text-primary transition-colors duration-200">
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
              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
            >
              {tech}
            </span>
          ))}
          {project.technologies?.length > 3 && (
            <span className="px-2 py-1 bg-surface text-text-secondary text-xs rounded-md">
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
              className="flex items-center text-sm text-primary hover:text-secondary transition-colors duration-200"
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
              className="flex items-center text-sm text-primary hover:text-secondary transition-colors duration-200"
            >
              <Github className="w-4 h-4 mr-1" />
              Code
            </a>
          )}
        </div>
      </div>
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-6 flex justify-between items-start z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              {project.title}
            </h2>
            <p className="text-text-secondary">{project.shortDescription}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface rounded-lg transition-colors duration-200"
          >
            <X className="w-6 h-6 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image Gallery */}
          {project.images && project.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.images.map((image, index) => (
                <div
                  key={index}
                  className="relative h-40 rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => onImageClick(index)}
                >
                  <LazyImage
                    src={image.url}
                    alt={image.caption || `${project.title} screenshot ${index + 1}`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full Description */}
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">
              Project Details
            </h3>
            <div
              className="text-text-secondary leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: project.fullDescription }}
            />
          </div>

          {/* Technologies */}
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-3">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 pt-4">
            {project.links?.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
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
                className="inline-flex items-center px-6 py-3 bg-surface text-text-primary border border-border rounded-lg hover:bg-background transition-colors duration-200"
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

  const handlePrevious = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
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
          className="max-w-full max-h-[80vh] object-contain"
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

export default Projects;
