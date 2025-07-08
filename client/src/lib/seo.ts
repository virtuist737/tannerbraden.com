import { BlogPost } from "@shared/schema";

// Default SEO values
const DEFAULT_TITLE = "Tanner Braden - Digital Creator";
const DEFAULT_DESCRIPTION = "Creating apps and content designed to elevate human consciousness. Dedicated to building scalable solutions for mindfulness, awareness, and personal growth.";
const DEFAULT_KEYWORDS = "consciousness apps, mindfulness technology, wellbeing, human potential, personal growth, meditation apps, awareness tools, consciousness development";
// Updated default image optimized for social sharing (1200x630 recommended)
const DEFAULT_IMAGE = "/social-default.svg";
// Homepage specific image - more professional for homepage shares
const HOMEPAGE_IMAGE = "/homepage-social.svg";
const SITE_NAME = "Tanner Braden";
const DEFAULT_TWITTER_HANDLE = "@tannerbraden";
const DEFAULT_LOCALE = "en_US";

// Base site URL - use window.location.origin in components
export const BASE_URL = "https://tannerbraden.com";

/**
 * Interface for SEO metadata
 */
export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogType: string;
  ogImage: string;
  canonical?: string;
  twitterCard: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  articlePublishedTime?: string;
  articleSection?: string;
  articleAuthor?: string;
  noIndex?: boolean;
  // Additional social media optimization
  ogSiteName?: string;
  ogLocale?: string;
  structuredData?: object;
}

/**
 * Generate SEO metadata for any page
 */
export function generateSEOMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  ogType = "website",
  canonical,
  twitterCard = "summary_large_image",
  noIndex = false,
  isHomepage = false,
}: {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  ogType?: string;
  canonical?: string;
  twitterCard?: string;
  noIndex?: boolean;
  isHomepage?: boolean;
}): SEOData {
  // Create formatted title with site name
  const formattedTitle = `${title} - ${SITE_NAME}`;
  
  // Use homepage-specific image if this is the homepage
  const defaultImage = isHomepage ? HOMEPAGE_IMAGE : DEFAULT_IMAGE;
  
  // Ensure image URL is absolute
  const absoluteImageUrl = image?.startsWith('http') ? image : 
    image?.startsWith('/') ? `${BASE_URL}${image}` :
    `${BASE_URL}${defaultImage}`;

  // Generate structured data for rich snippets
  const structuredData = generateStructuredData({
    title: formattedTitle,
    description,
    image: absoluteImageUrl,
    ogType,
    isHomepage,
  });

  return {
    title: formattedTitle,
    description,
    keywords,
    ogType,
    ogImage: absoluteImageUrl,
    canonical,
    twitterCard,
    twitterTitle: formattedTitle,
    twitterDescription: description,
    twitterImage: absoluteImageUrl,
    // Only set article properties for article type
    articleAuthor: ogType === 'article' ? 'Tanner Braden' : undefined,
    noIndex,
    ogSiteName: SITE_NAME,
    ogLocale: DEFAULT_LOCALE,
    structuredData,
  };
}

/**
 * Generate SEO metadata specifically for blog posts
 */
export function generateBlogSEOMetadata(post: BlogPost): SEOData {
  // Create a clean title without site name for social sharing
  const cleanTitle = post.seoTitle || post.title;
  
  // Create formatted title with site name for browser title
  const formattedTitle = `${cleanTitle} - ${SITE_NAME}`;
  
  // Make sure we always have an excerpt
  const safeExcerpt = post.excerpt || 
    (post.content ? post.content.substring(0, 160).replace(/<[^>]*>/g, '') : DEFAULT_DESCRIPTION);
  
  // Always ensure we have a good description
  const safeDescription = post.seoDescription || safeExcerpt;
  
  // Ensure we have a cover image, falling back to default if needed
  const coverImage = post.coverImage || DEFAULT_IMAGE;
  
  // Generate structured data for blog posts
  const structuredData = generateBlogStructuredData(post, {
    title: cleanTitle,
    description: safeDescription,
    image: coverImage,
  });
  
  return {
    // Basic metadata - use formatted title for browser, clean title for social
    title: formattedTitle,
    description: safeDescription,
    keywords: post.seoKeywords || 
      `${post.category || ''}, tanner braden, digital creation, mindfulness, consciousness, ${post.title.toLowerCase()}`,
    
    // OpenGraph - use clean title for better social sharing
    ogType: "article",
    ogImage: coverImage,
    canonical: post.canonicalUrl || undefined,
    
    // Twitter - use clean title for better social sharing
    twitterCard: "summary_large_image", 
    twitterTitle: cleanTitle,
    twitterDescription: safeDescription,
    twitterImage: coverImage,
    
    // Article metadata
    articlePublishedTime: post.publishedAt?.toString(),
    articleSection: post.category,
    articleAuthor: "Tanner Braden",
    
    // Indexing
    noIndex: post.isIndexed === false,
    
    // Enhanced social media metadata
    ogSiteName: SITE_NAME,
    ogLocale: DEFAULT_LOCALE,
    structuredData,
  };
}

/**
 * Generate structured data for general pages
 */
function generateStructuredData({
  title,
  description,
  image,
  ogType,
  isHomepage = false,
}: {
  title: string;
  description: string;
  image: string;
  ogType: string;
  isHomepage?: boolean;
}): object {
  if (isHomepage) {
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Tanner Braden",
      "url": BASE_URL,
      "image": image,
      "description": description,
      "jobTitle": "Digital Creator & Audio Designer",
      "sameAs": [
        "https://twitter.com/tannerbraden",
        "https://github.com/tannerbraden",
        "https://linkedin.com/in/tannerbraden"
      ]
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": BASE_URL,
    "image": image,
    "publisher": {
      "@type": "Person",
      "name": "Tanner Braden"
    }
  };
}

/**
 * Generate structured data specifically for blog posts
 */
function generateBlogStructuredData(post: BlogPost, meta: {
  title: string;
  description: string;
  image: string;
}): object {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": meta.title,
    "description": meta.description,
    "image": meta.image,
    "author": {
      "@type": "Person",
      "name": "Tanner Braden",
      "url": BASE_URL
    },
    "publisher": {
      "@type": "Person",
      "name": "Tanner Braden",
      "url": BASE_URL
    },
    "datePublished": post.publishedAt?.toString(),
    "dateModified": post.updatedAt?.toString() || post.publishedAt?.toString(),
    "articleSection": post.category,
    "keywords": post.seoKeywords || `${post.category}, tanner braden, digital creation, mindfulness, consciousness`,
    "url": `${BASE_URL}/blog/${post.slug}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`
    }
  };
}