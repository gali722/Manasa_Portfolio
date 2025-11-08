import Projects3D from '../../components/Projects3D';
import SEO from '../../components/SEO';
import { generateBreadcrumbStructuredData } from '../../utils/structuredData';

const ProjectsPage = () => {
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
  ];

  const breadcrumbStructuredData = generateBreadcrumbStructuredData(breadcrumbs);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-surface/30 to-background">
      <SEO
        title="Projects - Manasa Gali Portfolio"
        description="Explore my data analysis, data engineering, and business intelligence projects. View detailed case studies, technologies used, and project outcomes."
        keywords="Data Analysis Projects, Data Engineering Projects, Business Intelligence, Portfolio Projects, Case Studies"
        canonicalUrl="/projects"
        structuredData={breadcrumbStructuredData}
      />
      <Projects3D showSearch={true} />
    </div>
  );
};

export default ProjectsPage;
