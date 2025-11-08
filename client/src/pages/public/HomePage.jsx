import { useQuery } from '@tanstack/react-query';
import Hero from '../../components/Hero';
import About from '../../components/About';
import Skills from '../../components/Skills';
import Projects from '../../components/Projects';
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
    queryFn: profileService.getProfile,
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
      <Hero />
      <About />
      <Skills />
      <Projects limit={6} showSearch={false} />
      <Experience />
      <Education />
      <Testimonials />
    </div>
  );
};

export default HomePage;
