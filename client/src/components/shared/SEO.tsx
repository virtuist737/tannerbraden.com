import { Helmet } from 'react-helmet-async';
import { SEOData } from '@/lib/seo';

interface SEOProps {
  data: SEOData;
}

export default function SEO({ data }: SEOProps) {
  const {
    title,
    description,
    keywords,
    ogType,
    ogImage,
    canonical,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    articlePublishedTime,
    articleSection,
    noIndex,
  } = data;
  
  // Log SEO data for debugging
  console.log('SEO Component rendered with title:', title);

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical Link */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      {twitterImage && <meta name="twitter:image" content={twitterImage} />}
      
      {/* Article Specific (for blog posts) */}
      {articlePublishedTime && <meta property="article:published_time" content={articlePublishedTime} />}
      {articleSection && <meta property="article:section" content={articleSection} />}
    </Helmet>
  );
}