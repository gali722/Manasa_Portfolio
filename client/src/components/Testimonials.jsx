import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote, Linkedin } from 'lucide-react';
import { testimonialsService } from '../services/testimonialsService';
import LazyImage from './LazyImage';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef(null);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialsService.getPublicTestimonials();
        if (data.success && data.data) {
          const visibleTestimonials = data.data.filter(
            (testimonial) => testimonial.isVisible
          );
          setTestimonials(visibleTestimonials);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
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

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && testimonials.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) =>
          prev === testimonials.length - 1 ? 0 : prev + 1
        );
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, testimonials.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const handleDotClick = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // Only hide if no data after loading
  if (!isLoading && testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
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
              Testimonials
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>

          {/* Carousel */}
          <div className="max-w-4xl mx-auto relative">
            {/* Navigation Buttons */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 p-3 bg-surface hover:bg-primary text-text-secondary hover:text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 p-3 bg-surface hover:bg-primary text-text-secondary hover:text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Testimonial Cards */}
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <TestimonialCard
                    key={testimonial._id}
                    testimonial={testimonial}
                  />
                ))}
              </div>
            </div>

            {/* Dots Navigation */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-primary w-8'
                        : 'bg-border hover:bg-text-secondary'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Auto-play Toggle */}
            {testimonials.length > 1 && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="text-sm text-text-secondary hover:text-primary transition-colors duration-200"
                >
                  {isAutoPlaying ? 'Pause' : 'Resume'} Auto-play
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="w-full flex-shrink-0 px-4">
      <div className="bg-surface rounded-lg p-8 md:p-12 shadow-xl border border-border relative">
        {/* Quote Icon */}
        <div className="absolute top-6 left-6 text-primary/10">
          <Quote className="w-6 h-6 md:w-8 md:h-8" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Testimonial Text */}
          <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-8 italic">
            "{testimonial.content}"
          </p>

          {/* Author Info */}
          <div className="flex items-center gap-4">
            {/* Author Photo */}
            {testimonial.authorPhoto?.url ? (
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-primary">
                <LazyImage
                  src={testimonial.authorPhoto.url}
                  alt={testimonial.authorName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                {testimonial.authorName.charAt(0)}
              </div>
            )}

            {/* Author Details */}
            <div className="flex-1">
              <h4 className="text-lg md:text-xl font-semibold text-text-primary mb-1">
                {testimonial.authorName}
              </h4>
              <p className="text-sm md:text-base text-text-secondary mb-1">
                {testimonial.authorTitle}
                {testimonial.authorCompany && ` at ${testimonial.authorCompany}`}
              </p>
              {testimonial.relationship && (
                <p className="text-xs text-text-secondary">
                  {testimonial.relationship}
                </p>
              )}
            </div>

            {/* LinkedIn Link */}
            {testimonial.linkedinUrl && (
              <a
                href={testimonial.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-2 text-primary hover:text-secondary hover:bg-background rounded-lg transition-all duration-200"
                aria-label="View LinkedIn profile"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
