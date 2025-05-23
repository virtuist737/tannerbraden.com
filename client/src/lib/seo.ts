import { BlogPost } from "@shared/schema";

// Default SEO values
const DEFAULT_TITLE = "Tanner Braden - Digital Creator";
const DEFAULT_DESCRIPTION = "Creating apps and content designed to elevate human consciousness. Dedicated to building scalable solutions for mindfulness, awareness, and personal growth.";
const DEFAULT_KEYWORDS = "consciousness apps, mindfulness technology, wellbeing, human potential, personal growth, meditation apps, awareness tools, consciousness development";
const DEFAULT_IMAGE = "https://res.cloudinary.com/dvk20sglr/image/upload/v1739851169/tanner2.0_dark-500x500_f0dznv.png";
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
}: {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  ogType?: string;
  canonical?: string;
  twitterCard?: string;
  noIndex?: boolean;
}): SEOData {
  // Create formatted title with site name
  const formattedTitle = `${title} - ${SITE_NAME}`;
  
  // Ensure image URL is absolute
  const absoluteImageUrl = image?.startsWith('http') ? image : image;

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
  };
}

/**
 * Generate SEO metadata specifically for blog posts
 */
export function generateBlogSEOMetadata(post: BlogPost): SEOData {
  // Create a clean title without site name for social sharing
  const cleanTitle = post.seoTitle || post.title;
  
  // Make sure we always have an excerpt
  const safeExcerpt = post.excerpt || 
    (post.content ? post.content.substring(0, 160).replace(/<[^>]*>/g, '') : DEFAULT_DESCRIPTION);
  
  // Always ensure we have a good description
  const safeDescription = post.seoDescription || safeExcerpt;
  
  // Ensure we have a cover image, falling back to default if needed
  const coverImage = post.coverImage || DEFAULT_IMAGE;
  
  return {
    // Basic metadata
    title: cleanTitle,
    description: safeDescription,
    keywords: post.seoKeywords || 
      `${post.category || ''}, tanner braden, digital creation, mindfulness, consciousness, ${post.title.toLowerCase()}`,
    
    // OpenGraph
    ogType: "article",
    ogImage: coverImage,
    canonical: post.canonicalUrl || undefined,
    
    // Twitter
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
  };
}