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
    articleAuthor,
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
      <meta property="og:title" content={twitterTitle || title} />
      <meta property="og:description" content={twitterDescription || description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={twitterTitle || title} />
      <meta property="og:site_name" content="Tanner Braden" />
      <meta property="og:locale" content="en_US" />
      {/* Image dimensions for better social media display */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Article Specific OpenGraph Tags */}
      {ogType === 'article' && (
        <>
          {articlePublishedTime && <meta property="article:published_time" content={articlePublishedTime} />}
          {articleSection && <meta property="article:section" content={articleSection} />}
          {articleAuthor && <meta property="article:author" content={articleAuthor} />}
          <meta property="article:publisher" content="https://tannerbraden.com" />
        </>
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      <meta name="twitter:site" content="@tannerbraden" />
      <meta name="twitter:creator" content="@tannerbraden" />
      {twitterImage && (
        <>
          <meta name="twitter:image" content={twitterImage} />
          <meta name="twitter:image:alt" content={twitterTitle || title} />
        </>
      )}
      
      {/* Structured Data */}
      {data.structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(data.structuredData)}
        </script>
      )}
    </Helmet>
  );
}