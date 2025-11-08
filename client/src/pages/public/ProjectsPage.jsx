import Projects from '../../components/Projects';
import SEO from '../../components/SEO';
import { generateBreadcrumbStructuredData } from '../../utils/structuredData';

const ProjectsPage = () => {
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
  ];

  const breadcrumbStructuredData = generateBreadcrumbStructuredData(breadcrumbs);

  return (
    <div className="min-h-screen py-20 bg-background">
      <SEO
        title="Projects - Manasa Gali Portfolio"
        description="Explore my data analysis, data engineering, and business intelligence projects. View detailed case studies, technologies used, and project outcomes."
        keywords="Data Analysis Projects, Data Engineering Projects, Business Intelligence, Portfolio Projects, Case Studies"
        canonicalUrl="/projects"
        structuredData={breadcrumbStructuredData}
      />
      <Projects showSearch={true} />
    </div>
  );
};

export default ProjectsPage;
