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
  return {
    title: `${title} - ${SITE_NAME}`,
    description,
    keywords,
    ogType,
    ogImage: image,
    canonical,
    twitterCard,
    twitterTitle: `${title} - ${SITE_NAME}`,
    twitterDescription: description,
    twitterImage: image,
    noIndex,
  };
}

/**
 * Generate SEO metadata specifically for blog posts
 */
export function generateBlogSEOMetadata(post: BlogPost): SEOData {
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords || `${post.category}, tanner braden, digital creation, mindfulness, consciousness, ${post.title.toLowerCase()}`,
    ogType: "article",
    ogImage: post.coverImage || DEFAULT_IMAGE,
    canonical: post.canonicalUrl || undefined,
    twitterCard: "summary_large_image",
    twitterTitle: post.seoTitle || post.title,
    twitterDescription: post.seoDescription || post.excerpt,
    twitterImage: post.coverImage || DEFAULT_IMAGE,
    articlePublishedTime: post.publishedAt?.toString(),
    articleSection: post.category,
    noIndex: post.isIndexed === false,
  };
}