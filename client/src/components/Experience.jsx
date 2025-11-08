import { useEffect, useState, useRef } from 'react';
import { Briefcase, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { experienceService } from '../services/experienceService';
import LazyImage from './LazyImage';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await experienceService.getPublicExperience();
        if (data.success && data.data) {
          // Sort by start date (most recent first)
          const sorted = data.data.sort(
            (a, b) => new Date(b.startDate) - new Date(a.startDate)
          );
          setExperiences(sorted);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
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

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  };

  // Only hide if no data after loading
  if (!isLoading && experiences.length === 0) {
    return null;
  }

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-20 bg-background"
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
              Work Experience
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border transform md:-translate-x-1/2"></div>

              {/* Experience Items */}
              <div className="space-y-12">
                {experiences.map((experience, index) => (
                  <ExperienceItem
                    key={experience._id}
                    experience={experience}
                    index={index}
                    isExpanded={expandedIds.has(experience._id)}
                    onToggle={() => toggleExpanded(experience._id)}
                    formatDate={formatDate}
                    calculateDuration={calculateDuration}
                    isVisible={isVisible}
                  />
                ))}
              </div>
            </div>
          </div>

          {experiences.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary text-lg">
                No work experience available.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ExperienceItem = ({
  experience,
  index,
  isExpanded,
  onToggle,
  formatDate,
  calculateDuration,
  isVisible,
}) => {
  const isEven = index % 2 === 0;

  return (
    <div
      className={`relative ${
        isVisible ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      {/* Timeline Dot */}
      <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10 shadow-lg"></div>

      {/* Content */}
      <div
        className={`ml-20 md:ml-0 md:w-[calc(50%-2rem)] ${
          isEven ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
        }`}
      >
        <div className="bg-surface rounded-lg p-6 shadow-md border border-border hover:shadow-xl transition-all duration-300">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            {/* Company Logo */}
            {experience.companyLogo?.url && (
              <div className="flex-shrink-0 w-16 h-16 bg-background rounded-lg overflow-hidden border border-border p-2">
                <LazyImage
                  src={experience.companyLogo.url}
                  alt={experience.company}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-text-primary mb-1">
                {experience.position}
              </h3>
              <p className="text-primary font-medium mb-2">
                {experience.company}
              </p>

              {/* Date and Location */}
              <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {formatDate(experience.startDate)} -{' '}
                    {experience.isCurrent
                      ? 'Present'
                      : formatDate(experience.endDate)}
                  </span>
                  <span className="ml-2 text-xs">
                    ({calculateDuration(experience.startDate, experience.endDate)})
                  </span>
                </div>
                {experience.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{experience.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {experience.description && (
            <p className="text-text-secondary text-sm mb-4">
              {experience.description}
            </p>
          )}

          {/* Expandable Content */}
          {(experience.responsibilities?.length > 0 ||
            experience.achievements?.length > 0 ||
            experience.technologies?.length > 0) && (
            <>
              <button
                onClick={onToggle}
                className="flex items-center text-primary hover:text-secondary transition-colors duration-200 text-sm font-medium mb-4"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" />
                    Show More
                  </>
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {/* Responsibilities */}
                {experience.responsibilities?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-text-primary mb-2">
                      Key Responsibilities:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary">
                      {experience.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Achievements */}
                {experience.achievements?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-text-primary mb-2">
                      Key Achievements:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary">
                      {experience.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies */}
                {experience.technologies?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-2">
                      Technologies Used:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Experience;
