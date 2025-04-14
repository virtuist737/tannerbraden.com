import { Client } from '@replit/object-storage';
import crypto from 'crypto';
import path from 'path';

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
    // Get the deployment ID if we're in a deployment
    const deploymentID = process.env.REPL_DEPLOYMENT ? process.env.REPL_ID : null;
    const replID = process.env.REPL_ID || 'development';
    
    // Use deployment URL if deployed, otherwise use development URL
    const baseUrl = deploymentID 
      ? `https://${deploymentID}.id.repl.co`
      : `http://0.0.0.0:5000`;
    
    // Create the public URL for the file
    const publicUrl = `${baseUrl}/api/objects/${objectPath}`;
    
    return publicUrl;
  } catch (error) {
    console.error('Object Storage upload error:', error);
    throw new Error(`Failed to upload image to Object Storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
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