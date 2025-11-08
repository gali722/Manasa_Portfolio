import { useEffect, useState, useRef } from 'react';
import { skillsService } from '../services/skillsService';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await skillsService.getPublicSkills();
        console.log('Skills API Response:', data);
        if (data.success && data.data) {
          const visibleSkills = data.data.filter((skill) => skill.isVisible);
          console.log('Visible Skills:', visibleSkills.length);
          setSkills(visibleSkills);

          // Extract unique categories
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

  // Only hide if no data after loading
  if (!isLoading && skills.length === 0) {
    return null;
  }

  return (
    <section id="skills" ref={sectionRef} className="py-20 bg-background">
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
              Skills & Expertise
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-surface text-text-secondary hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          {selectedCategory === 'All' ? (
            // Show grouped by category
            <div className="space-y-12">
              {Object.entries(groupedSkills).map(
                ([category, categorySkills], index) => (
                  <div
                    key={category}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <h3 className="text-2xl font-semibold text-text-primary mb-6">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categorySkills.map((skill, skillIndex) => (
                        <SkillCard
                          key={skill._id}
                          skill={skill}
                          delay={skillIndex * 0.05}
                          isVisible={isVisible}
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            // Show filtered skills
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill, index) => (
                <SkillCard
                  key={skill._id}
                  skill={skill}
                  delay={index * 0.05}
                  isVisible={isVisible}
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
      </div>
    </section>
  );
};

const SkillCard = ({ skill, delay, isVisible }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setProgress(skill.proficiency);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, skill.proficiency, delay]);

  return (
    <div className="bg-surface rounded-lg p-6 shadow-md border border-border hover:shadow-xl hover:scale-105 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors duration-200">
            {skill.name}
          </h4>
          <p className="text-sm text-text-secondary mt-1">{skill.category}</p>
        </div>
        {skill.icon && (
          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
            <span className="text-2xl">{skill.icon}</span>
          </div>
        )}
      </div>

      {/* Proficiency Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-text-secondary">Proficiency</span>
          <span className="text-sm font-semibold text-primary">
            {skill.proficiency}%
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Skills;
