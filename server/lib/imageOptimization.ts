import sharp from 'sharp';
import { objectStore } from './objectStorage';

export interface ImageSizeConfig {
  width: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png';
  suffix: string;
}

export interface OptimizedImageUrls {
  thumbnail: string;
  medium: string;
  large: string;
  original: string;
}

// Configuration for different image sizes
const IMAGE_CONFIGS: Record<string, ImageSizeConfig> = {
  thumbnail: {
    width: 150,
    height: 150,
    quality: 80,
    format: 'jpeg',
    suffix: 'thumb'
  },
  medium: {
    width: 600,
    height: 400,
    quality: 85,
    format: 'jpeg',
    suffix: 'med'
  },
  large: {
    width: 1200,
    height: 800,
    quality: 90,
    format: 'jpeg',
    suffix: 'lg'
  }
};

/**
 * Process and optimize an image into multiple sizes
 * @param file The original image file buffer
 * @param basePath The base path for storing images (e.g., 'portfolio/blog')
 * @param filename The base filename (without extension)
 * @returns Object containing URLs for all optimized sizes
 */
export const optimizeImage = async (
  file: Express.Multer.File,
  basePath: string,
  filename: string
): Promise<OptimizedImageUrls> => {
  try {
    const urls: Partial<OptimizedImageUrls> = {};
    
    // Process each size configuration
    for (const [sizeName, config] of Object.entries(IMAGE_CONFIGS)) {
      const optimizedBuffer = await sharp(file.buffer)
        .resize(config.width, config.height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({
          quality: config.quality || 85,
          progressive: true,
          mozjpeg: true
        })
        .toBuffer();

      // Create filename with size suffix
      const sizedFilename = `${filename}-${config.suffix}.jpg`;
      const objectPath = `${basePath}/${sizedFilename}`;
      
      // Upload to object storage
      const result = await objectStore.uploadFromBytes(
        objectPath,
        optimizedBuffer,
        { compress: true }
      );

      if (!result.ok) {
        throw new Error(`Upload failed for ${sizeName}: ${result.error}`);
      }

      // Generate public URL
      const baseUrl = 'https://tannerbraden.com';
      const publicUrl = `${baseUrl}/api/objects/${objectPath}`;
      urls[sizeName as keyof OptimizedImageUrls] = publicUrl;
    }

    // Also store the original (optimized)
    const originalOptimized = await sharp(file.buffer)
      .jpeg({
        quality: 95,
        progressive: true,
        mozjpeg: true
      })
      .toBuffer();

    const originalPath = `${basePath}/${filename}-original.jpg`;
    const originalResult = await objectStore.uploadFromBytes(
      originalPath,
      originalOptimized,
      { compress: true }
    );

    if (!originalResult.ok) {
      throw new Error(`Upload failed for original: ${originalResult.error}`);
    }

    const baseUrl = 'https://tannerbraden.com';
    urls.original = `${baseUrl}/api/objects/${originalPath}`;

    return urls as OptimizedImageUrls;
  } catch (error) {
    console.error('Image optimization error:', error);
    throw new Error(`Failed to optimize image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate responsive image srcset string
 * @param urls Object containing image URLs for different sizes
 * @returns srcset string for responsive images
 */
export const generateSrcSet = (urls: OptimizedImageUrls): string => {
  return [
    `${urls.thumbnail} 150w`,
    `${urls.medium} 600w`,
    `${urls.large} 1200w`
  ].join(', ');
};

/**
 * Generate sizes attribute for responsive images
 * @param breakpoints Optional custom breakpoints
 * @returns sizes string for responsive images
 */
export const generateSizes = (breakpoints?: string): string => {
  if (breakpoints) return breakpoints;
  
  // Default responsive breakpoints
  return [
    '(max-width: 640px) 100vw',
    '(max-width: 1024px) 50vw',
    '33vw'
  ].join(', ');
};

/**
 * Clean up old optimized images when a new image is uploaded
 * @param oldImageUrl The old image URL to clean up
 */
export const cleanupOptimizedImages = async (oldImageUrl: string): Promise<void> => {
  try {
    // Extract base path and filename from old URL
    const url = new URL(oldImageUrl);
    const regex = /\/api\/objects\/(.*)/;
    const match = url.pathname.match(regex);
    
    if (!match || !match[1]) {
      console.warn('Could not parse object path from URL:', oldImageUrl);
      return;
    }

    const objectPath = decodeURIComponent(match[1]);
    
    // Extract base filename (remove size suffix and extension)
    const pathParts = objectPath.split('/');
    const filename = pathParts[pathParts.length - 1];
    const baseName = filename.replace(/-\w+\.jpg$/, '');
    const basePath = pathParts.slice(0, -1).join('/');
    
    // Delete all size variants
    const sizesToClean = ['thumb', 'med', 'lg', 'original'];
    
    for (const size of sizesToClean) {
      const pathToDelete = `${basePath}/${baseName}-${size}.jpg`;
      try {
        await objectStore.delete(pathToDelete);
      } catch (error) {
        console.warn(`Failed to delete ${pathToDelete}:`, error);
      }
    }
  } catch (error) {
    console.error('Error cleaning up optimized images:', error);
  }
};