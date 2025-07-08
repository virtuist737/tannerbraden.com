import { Client } from '@replit/object-storage';
import crypto from 'crypto';
import path from 'path';
import { optimizeImage, cleanupOptimizedImages, type OptimizedImageUrls } from './imageOptimization';

// Initialize the object store client
export const objectStore = new Client();

/**
 * Uploads a file to Replit Object Storage
 * @param file The file to upload (from multer)
 * @param folder The folder to store the file in (used for path organization)
 * @returns The public URL of the uploaded file
 */
export const uploadToObjectStorage = async (file: Express.Multer.File, folder: string): Promise<string> => {
  try {
    // Generate a unique filename to prevent collisions
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    
    // Extract the file extension from the original name
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    // Create a clean filename with timestamp and random string
    const filename = `${timestamp}-${randomString}${fileExtension}`;
    
    // Create the full path with folder structure
    const objectPath = `portfolio/${folder}/${filename}`;
    
    // Upload the file to object storage using the uploadFromBytes method
    const result = await objectStore.uploadFromBytes(
      objectPath,
      file.buffer,
      { compress: true }
    );
    
    if (!result.ok) {
      throw new Error(`Upload failed: ${result.error}`);
    }
    
    // Get the base URL for the bucket
    // Objects are accessible at this pattern:
    // https://{replid}.id.repl.co/api/objects/{objectPath}
    // We will use express to serve these objects from our object storage
    // Use custom domain in both development and production
    const baseUrl = 'https://tannerbraden.com';
    
    // Create the public URL for the file
    const publicUrl = `${baseUrl}/api/objects/${objectPath}`;
    
    return publicUrl;
  } catch (error) {
    console.error('Object Storage upload error:', error);
    throw new Error(`Failed to upload image to Object Storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Uploads and optimizes a blog cover image to Object Storage
 * @param file The file to upload (from multer)
 * @param folder The folder to store the file in (used for path organization)
 * @param oldImageUrl Optional old image URL to clean up
 * @returns Object containing URLs for all optimized sizes
 */
export const uploadOptimizedBlogImage = async (
  file: Express.Multer.File,
  folder: string,
  oldImageUrl?: string
): Promise<OptimizedImageUrls> => {
  try {
    // Clean up old images if provided
    if (oldImageUrl) {
      await cleanupOptimizedImages(oldImageUrl);
    }
    
    // Generate a unique filename to prevent collisions
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    
    // Create a clean filename with timestamp and random string (no extension)
    const filename = `${timestamp}-${randomString}`;
    
    // Create the full path with folder structure
    const basePath = `portfolio/${folder}`;
    
    // Optimize and upload the image
    const optimizedUrls = await optimizeImage(file, basePath, filename);
    
    return optimizedUrls;
  } catch (error) {
    console.error('Optimized image upload error:', error);
    throw new Error(`Failed to upload and optimize image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Deletes a file from Replit Object Storage
 * @param objectPath The path of the object to delete
 */
export const deleteFromObjectStorage = async (objectPath: string): Promise<void> => {
  try {
    const result = await objectStore.delete(objectPath);
    if (!result.ok) {
      throw new Error(`Delete failed: ${result.error}`);
    }
  } catch (error) {
    console.error('Object Storage delete error:', error);
    throw new Error(`Failed to delete image from Object Storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Extracts the object path from our URL format
 * @param imageUrl The image URL in our format
 * @returns The object path that can be used for operations like delete
 */
export const getObjectPathFromUrl = (imageUrl: string): string => {
  try {
    // Parse the URL to extract the pathname
    const url = new URL(imageUrl);
    
    // The pattern for our URLs is /api/objects/{objectPath}
    // So we need to remove the /api/objects/ prefix
    const regex = /\/api\/objects\/(.*)/;
    const match = url.pathname.match(regex);
    
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
    
    throw new Error('Could not parse object path from URL');
  } catch (error) {
    console.error('Error parsing object path from URL:', error);
    throw new Error('Invalid object storage URL format');
  }
};