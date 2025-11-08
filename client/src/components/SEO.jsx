import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({
  title = 'Manasa Gali - Data Analyst | Data Engineer | Business Analyst',
  description = 'Portfolio of Manasa Gali, a skilled Data Analyst, Data Engineer, Business Analyst, and Report Developer. Explore my projects, skills, and professional experience.',
  keywords = 'Data Analyst, Data Engineer, Business Analyst, Report Developer, Portfolio, Manasa Gali, Data Analytics, Business Intelligence, SQL, Python, Power BI, Tableau',
  ogType = 'website',
  ogImage = '/og-image.jpg',
  canonicalUrl,
  structuredData,
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://manasagali.com';
  const fullUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Manasa Gali" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="Manasa Gali Portfolio" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  ogType: PropTypes.string,
  ogImage: PropTypes.string,
  canonicalUrl: PropTypes.string,
  structuredData: PropTypes.object,
};

export default SEO;
