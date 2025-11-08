/**
 * Generate structured data for professional profile
 * @param {Object} profile - Profile data from API
 * @returns {Object} JSON-LD structured data
 */
export const generatePersonStructuredData = (profile) => {
  if (!profile) return null;

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://manasagali.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.fullName || 'Manasa Gali',
    jobTitle: profile.title || 'Data Analyst | Data Engineer | Business Analyst',
    description: profile.summary || '',
    email: profile.email || 'galimanasa3@gmail.com',
    telephone: profile.phone || '',
    url: siteUrl,
    image: profile.profilePhoto?.url || `${siteUrl}/profile-photo.jpg`,
    address: profile.location
      ? {
          '@type': 'PostalAddress',
          addressLocality: profile.location,
        }
      : undefined,
    sameAs: [
      profile.socialLinks?.linkedin,
      profile.socialLinks?.github,
      profile.socialLinks?.twitter,
      profile.socialLinks?.medium,
      profile.socialLinks?.stackoverflow,
    ].filter(Boolean),
    knowsAbout: [
      'Data Analysis',
      'Data Engineering',
      'Business Analysis',
      'Report Development',
      'SQL',
      'Python',
      'Power BI',
      'Tableau',
    ],
  };
};

/**
 * Generate structured data for a project
 * @param {Object} project - Project data from API
 * @returns {Object} JSON-LD structured data
 */
export const generateProjectStructuredData = (project) => {
  if (!project) return null;

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://manasagali.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.shortDescription || project.fullDescription,
    author: {
      '@type': 'Person',
      name: 'Manasa Gali',
    },
    image: project.images?.[0]?.url || '',
    url: project.links?.live || `${siteUrl}/projects`,
    keywords: project.technologies?.join(', ') || '',
    dateCreated: project.createdAt,
    dateModified: project.updatedAt,
  };
};

/**
 * Generate breadcrumb structured data
 * @param {Array} breadcrumbs - Array of breadcrumb items
 * @returns {Object} JSON-LD structured data
 */
export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://manasagali.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  };
};

/**
 * Generate website structured data
 * @returns {Object} JSON-LD structured data
 */
export const generateWebsiteStructuredData = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://manasagali.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Manasa Gali Portfolio',
    url: siteUrl,
    description:
      'Professional portfolio of Manasa Gali, showcasing data analysis, data engineering, and business analysis projects and skills.',
    author: {
      '@type': 'Person',
      name: 'Manasa Gali',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/projects?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
};

/**
 * Generate organization structured data
 * @param {Object} profile - Profile data from API
 * @returns {Object} JSON-LD structured data
 */
export const generateOrganizationStructuredData = (profile) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://manasagali.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Manasa Gali - Professional Services',
    url: siteUrl,
    logo: profile?.profilePhoto?.url || `${siteUrl}/logo.png`,
    description:
      'Professional data analysis, data engineering, and business analysis services.',
    email: profile?.email || 'galimanasa3@gmail.com',
    contactPoint: {
      '@type': 'ContactPoint',
      email: profile?.email || 'galimanasa3@gmail.com',
      contactType: 'Professional Inquiries',
    },
  };
};
