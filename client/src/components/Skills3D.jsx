import { useEffect, useState, useRef } from 'react';
import { skillsService } from '../services/skillsService';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Skills3D = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await skillsService.getPublicSkills();
        if (data.success && data.data) {
          const visibleSkills = data.data.filter((skill) => skill.isVisible);
          setSkills(visibleSkills);

          const uniqueCategories = [
            'All',
            ...new Set(visibleSkills.map((skill) => skill.category)),
          ];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { 
          opacity: 0, 
          y: 50,
          rotateX: -15,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }
  }, [skills, selectedCategory]);

  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((skill) => skill.category === selectedCategory);

  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  if (!isLoading && skills.length === 0) {
    return null;
  }

  return (
    <section id="skills" ref={sectionRef} className="py-20 bg-gradient-to-b from-background via-surface/30 to-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent mb-4">
            Skills & Expertise
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
            Mastering cutting-edge technologies to deliver exceptional results
          </p>
        </div>

        {/* Category Filter with Glassmorphism */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 backdrop-blur-md ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/50 scale-105'
                  : 'bg-surface/50 text-text-secondary hover:bg-surface/80 hover:text-primary border border-border/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        {selectedCategory === 'All' ? (
          <div className="space-y-16">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h3 className="text-2xl font-semibold text-text-primary mb-8 flex items-center">
                  <span className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></span>
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorySkills.map((skill, index) => (
                    <SkillCard3D
                      key={skill._id}
                      skill={skill}
                      ref={(el) => (cardsRef.current[index] = el)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill, index) => (
              <SkillCard3D
                key={skill._id}
                skill={skill}
                ref={(el) => (cardsRef.current[index] = el)}
              />
            ))}
          </div>
        )}

        {filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">
              No skills found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

const SkillCard3D = ({ skill }) => {
  const cardRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(skill.proficiency);
    }, 300);

    return () => clearTimeout(timer);
  }, [skill.proficiency]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
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
      className="group relative bg-gradient-to-br from-surface/80 to-surface/40 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 cursor-pointer"
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors duration-200">
              {skill.name}
            </h4>
            <p className="text-sm text-text-secondary mt-1">{skill.category}</p>
          </div>
          {skill.icon && (
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <span className="text-3xl">{skill.icon}</span>
            </div>
          )}
        </div>

        {/* 3D Proficiency Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-text-secondary font-medium">Proficiency</span>
            <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              {skill.proficiency}%
            </span>
          </div>
          <div className="relative w-full h-3 bg-border/30 rounded-full overflow-hidden backdrop-blur-sm">
            {/* Background glow */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm"
              style={{ width: `${progress}%` }}
            ></div>
            {/* Progress bar */}
            <div
              className="relative h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

export default Skills3D;
