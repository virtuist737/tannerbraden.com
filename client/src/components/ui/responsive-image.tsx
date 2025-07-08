import { cn } from "@/lib/utils";
import { type BlogPost } from "@shared/schema";

interface ResponsiveImageProps {
  /** Blog post object containing image URLs */
  post: BlogPost;
  /** Alternative text for the image */
  alt: string;
  /** CSS class name for the image container */
  className?: string;
  /** Image variant to use as fallback */
  fallbackVariant?: 'thumbnail' | 'medium' | 'large';
  /** Whether to show the image in a lazy loading manner */
  lazy?: boolean;
  /** Custom sizes attribute for responsive images */
  sizes?: string;
  /** Additional props to pass to the img element */
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

export function ResponsiveImage({
  post,
  alt,
  className,
  fallbackVariant = 'medium',
  lazy = true,
  sizes,
  imgProps,
}: ResponsiveImageProps) {
  // Extract image URLs from the post
  const thumbnail = post.coverImageThumbnail;
  const medium = post.coverImageMedium;
  const large = post.coverImageLarge;
  const fallback = post.coverImage;

  // Determine the best image to use
  const getBestImage = () => {
    switch (fallbackVariant) {
      case 'thumbnail':
        return thumbnail || medium || large || fallback;
      case 'large':
        return large || medium || thumbnail || fallback;
      case 'medium':
      default:
        return medium || large || thumbnail || fallback;
    }
  };

  // Generate srcset if we have multiple sizes
  const generateSrcSet = () => {
    const srcsetParts = [];
    
    if (thumbnail) srcsetParts.push(`${thumbnail} 150w`);
    if (medium) srcsetParts.push(`${medium} 600w`);
    if (large) srcsetParts.push(`${large} 1200w`);
    
    return srcsetParts.length > 0 ? srcsetParts.join(', ') : undefined;
  };

  // Generate sizes attribute
  const generateSizes = () => {
    if (sizes) return sizes;
    
    // Default responsive breakpoints
    return [
      '(max-width: 640px) 100vw',
      '(max-width: 1024px) 50vw',
      '33vw'
    ].join(', ');
  };

  const mainImage = getBestImage();
  const srcset = generateSrcSet();

  // If no image is available, don't render anything
  if (!mainImage) {
    return null;
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={mainImage}
        srcSet={srcset}
        sizes={generateSizes()}
        alt={alt}
        loading={lazy ? "lazy" : "eager"}
        className="w-full h-full object-cover"
        {...imgProps}
      />
    </div>
  );
}

interface BlogImageProps {
  /** Blog post object containing image URLs */
  post: BlogPost;
  /** Size variant to display */
  variant?: 'thumbnail' | 'medium' | 'large';
  /** CSS class name for the image container */
  className?: string;
  /** Alternative text for the image */
  alt?: string;
  /** Custom sizes attribute for responsive images */
  sizes?: string;
  /** Additional props to pass to the img element */
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

export function BlogImage({
  post,
  variant = 'medium',
  className,
  alt,
  sizes,
  imgProps,
}: BlogImageProps) {
  const altText = alt || post.title;
  
  return (
    <ResponsiveImage
      post={post}
      alt={altText}
      className={className}
      fallbackVariant={variant}
      sizes={sizes}
      imgProps={imgProps}
    />
  );
}

// Hook for getting image URLs from a blog post
export function useBlogImageUrls(post: BlogPost) {
  return {
    thumbnail: post.coverImageThumbnail || post.coverImage,
    medium: post.coverImageMedium || post.coverImage,
    large: post.coverImageLarge || post.coverImage,
    fallback: post.coverImage,
  };
}