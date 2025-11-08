import { useEffect, useState } from 'react';
import { skillsService } from '../services/skillsService';
import { projectsService } from '../services/projectsService';
import { experienceService } from '../services/experienceService';
import { testimonialsService } from '../services/testimonialsService';
import { profileService } from '../services/profileService';

const DebugInfo = () => {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [skills, projects, experience, testimonials, profile] = await Promise.all([
          skillsService.getPublicSkills().catch(e => ({ error: e.message })),
          projectsService.getPublicProjects().catch(e => ({ error: e.message })),
          experienceService.getPublicExperience().catch(e => ({ error: e.message })),
          testimonialsService.getPublicTestimonials().catch(e => ({ error: e.message })),
          profileService.getPublicProfile().catch(e => ({ error: e.message })),
        ]);

        setData({ skills, projects, experience, testimonials, profile });
      } catch (error) {
        setErrors({ general: error.message });
      }
    };

    fetchAll();
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      right: 0, 
      background: 'white', 
      border: '2px solid red', 
      padding: '10px', 
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <h3 style={{ margin: 0, marginBottom: '10px' }}>Debug Info</h3>
      <div>
        <strong>Skills:</strong> {data.skills?.success ? `✓ ${data.skills.count} items` : `✗ ${data.skills?.error || 'Loading...'}`}
      </div>
      <div>
        <strong>Projects:</strong> {data.projects?.success ? `✓ ${data.projects.count} items` : `✗ ${data.projects?.error || 'Loading...'}`}
      </div>
      <div>
        <strong>Experience:</strong> {data.experience?.success ? `✓ ${data.experience.count} items` : `✗ ${data.experience?.error || 'Loading...'}`}
      </div>
      <div>
        <strong>Testimonials:</strong> {data.testimonials?.success ? `✓ ${data.testimonials.count} items` : `✗ ${data.testimonials?.error || 'Loading...'}`}
      </div>
      <div>
        <strong>Profile:</strong> {data.profile?.success ? `✓ Loaded` : `✗ ${data.profile?.error || 'Loading...'}`}
      </div>
      {errors.general && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <strong>Error:</strong> {errors.general}
        </div>
      )}
    </div>
  );
};

export default DebugInfo;
