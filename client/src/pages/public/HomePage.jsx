import { useQuery } from '@tanstack/react-query';
import Hero3D from '../../components/Hero3D';
import About3D from '../../components/About3D';
import Skills3D from '../../components/Skills3D';
import Projects3D from '../../components/Projects3D';
import Experience from '../../components/Experience';
import Education from '../../components/Education';
import Testimonials from '../../components/Testimonials';
import SEO from '../../components/SEO';
import { profileService } from '../../services/profileService';
import {
  generatePersonStructuredData,
  generateWebsiteStructuredData,
} from '../../utils/structuredData';

const HomePage = () => {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getPublicProfile,
  });

  const personStructuredData = generatePersonStructuredData(profile);
  const websiteStructuredData = generateWebsiteStructuredData();

  // Combine structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [websiteStructuredData, personStructuredData].filter(Boolean),
  };

  return (
    <div>
      <SEO
        title="Manasa Gali - Data Analyst | Data Engineer | Business Analyst"
        description="Portfolio of Manasa Gali, a skilled Data Analyst, Data Engineer, Business Analyst, and Report Developer. Explore my projects, skills, and professional experience."
        canonicalUrl="/"
        structuredData={structuredData}
      />
      <Hero3D />
      <About3D />
      <Skills3D />
      <Projects3D limit={6} showSearch={false} />
      <Experience />
      <Education />
      <Testimonials />
    </div>
  );
};

export default HomePage;
