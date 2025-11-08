import { useEffect, useState, useRef } from 'react';
import { GraduationCap, Calendar, MapPin, Award, ExternalLink } from 'lucide-react';
import { educationService } from '../services/educationService';
import { certificationsService } from '../services/certificationsService';
import LazyImage from './LazyImage';

const Education = () => {
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eduData, certData] = await Promise.all([
          educationService.getPublicEducation(),
          certificationsService.getPublicCertifications(),
        ]);

        if (eduData.success && eduData.data) {
          // Sort by end date (most recent first)
          const sorted = eduData.data.sort(
            (a, b) => new Date(b.endDate) - new Date(a.endDate)
          );
          setEducation(sorted);
        }

        if (certData.success && certData.data) {
          // Sort by issue date (most recent first)
          const sorted = certData.data.sort(
            (a, b) => new Date(b.issueDate) - new Date(a.issueDate)
          );
          setCertifications(sorted);
        }
      } catch (error) {
        console.error('Error fetching education data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-surface rounded w-1/4 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-surface rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="education"
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
              Education & Certifications
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>

          {/* Education Section */}
          {education.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-semibold text-text-primary mb-6 flex items-center">
                <GraduationCap className="w-6 h-6 mr-2 text-primary" />
                Education
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {education.map((edu, index) => (
                  <EducationCard
                    key={edu._id}
                    education={edu}
                    index={index}
                    isVisible={isVisible}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Certifications Section */}
          {certifications.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold text-text-primary mb-6 flex items-center">
                <Award className="w-6 h-6 mr-2 text-primary" />
                Certifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((cert, index) => (
                  <CertificationCard
                    key={cert._id}
                    certification={cert}
                    index={index}
                    isVisible={isVisible}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            </div>
          )}

          {education.length === 0 && certifications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary text-lg">
                No education or certification information available.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const EducationCard = ({ education, index, isVisible, formatDate }) => {
  return (
    <div
      className={`bg-background rounded-lg p-6 shadow-md border border-border hover:shadow-xl transition-all duration-300 ${
        isVisible ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-4">
        {/* Institution Logo */}
        {education.institutionLogo?.url ? (
          <div className="flex-shrink-0 w-16 h-16 bg-surface rounded-lg overflow-hidden border border-border p-2">
            <LazyImage
              src={education.institutionLogo.url}
              alt={education.institution}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-text-primary mb-1">
            {education.degree}
          </h4>
          <p className="text-primary font-medium mb-2">{education.field}</p>
          <p className="text-text-secondary text-sm mb-2">
            {education.institution}
          </p>

          {/* Date and Location */}
          <div className="flex flex-wrap gap-3 text-xs text-text-secondary mb-3">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>
                {formatDate(education.startDate)} - {formatDate(education.endDate)}
              </span>
            </div>
            {education.location && (
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{education.location}</span>
              </div>
            )}
          </div>

          {/* GPA */}
          {education.gpa && (
            <p className="text-sm text-text-secondary mb-3">
              <span className="font-medium">GPA:</span> {education.gpa}
            </p>
          )}

          {/* Coursework */}
          {education.coursework && education.coursework.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-text-primary mb-1">
                Relevant Coursework:
              </p>
              <div className="flex flex-wrap gap-1">
                {education.coursework.slice(0, 3).map((course, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded"
                  >
                    {course}
                  </span>
                ))}
                {education.coursework.length > 3 && (
                  <span className="px-2 py-0.5 bg-surface text-text-secondary text-xs rounded">
                    +{education.coursework.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Achievements */}
          {education.achievements && education.achievements.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-primary mb-1">
                Achievements:
              </p>
              <ul className="list-disc list-inside text-xs text-text-secondary space-y-0.5">
                {education.achievements.map((achievement, idx) => (
                  <li key={idx}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CertificationCard = ({ certification, index, isVisible, formatDate }) => {
  const isExpired =
    certification.expiryDate && new Date(certification.expiryDate) < new Date();

  return (
    <div
      className={`bg-background rounded-lg p-6 shadow-md border border-border hover:shadow-xl transition-all duration-300 group ${
        isVisible ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Badge */}
      {certification.badge?.url ? (
        <div className="w-20 h-20 mx-auto mb-4 rounded-lg overflow-hidden bg-surface p-2">
          <LazyImage
            src={certification.badge.url}
            alt={certification.name}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
          <Award className="w-10 h-10 text-white" />
        </div>
      )}

      {/* Content */}
      <div className="text-center">
        <h4 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors duration-200">
          {certification.name}
        </h4>
        <p className="text-primary font-medium text-sm mb-3">
          {certification.issuer}
        </p>

        {/* Dates */}
        <div className="flex items-center justify-center text-xs text-text-secondary mb-3">
          <Calendar className="w-3 h-3 mr-1" />
          <span>Issued {formatDate(certification.issueDate)}</span>
        </div>

        {certification.expiryDate && (
          <div
            className={`text-xs mb-3 ${
              isExpired ? 'text-error' : 'text-text-secondary'
            }`}
          >
            {isExpired ? 'Expired' : 'Expires'} {formatDate(certification.expiryDate)}
          </div>
        )}

        {/* Credential ID */}
        {certification.credentialId && (
          <p className="text-xs text-text-secondary mb-3">
            <span className="font-medium">ID:</span> {certification.credentialId}
          </p>
        )}

        {/* Verification Link */}
        {certification.verificationUrl && (
          <a
            href={certification.verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary hover:text-secondary transition-colors duration-200"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Verify Credential
          </a>
        )}
      </div>
    </div>
  );
};

export default Education;
