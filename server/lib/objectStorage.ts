import { Client } from '@replit/object-storage';
import crypto from 'crypto';
import path from 'path';

// Initialize the object store client
const objectStore = new Client();

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
    
    // Upload the file to object storage
    await objectStore.put(
      objectPath,
      file.buffer,
      { contentType: file.mimetype }
    );
    
    // Generate a public URL for the file
    const publicUrl = await objectStore.getSignedUrl(objectPath, { ttl: Infinity });
    
    return publicUrl;
  } catch (error) {
    console.error('Object Storage upload error:', error);
    throw new Error('Failed to upload image to Object Storage');
  }
};

/**
 * Deletes a file from Replit Object Storage
 * @param objectPath The path of the object to delete
 */
export const deleteFromObjectStorage = async (objectPath: string): Promise<void> => {
  try {
    await objectStore.delete(objectPath);
  } catch (error) {
    console.error('Object Storage delete error:', error);
    throw new Error('Failed to delete image from Object Storage');
  }
};

/**
 * Extracts the object path from a signed URL
 * @param signedUrl The signed URL of the object
 * @returns The object path that can be used for operations like delete
 */
export const getObjectPathFromUrl = (signedUrl: string): string => {
  try {
    // Parse the URL to extract the pathname
    const url = new URL(signedUrl);
    // The pathname should contain the full object path
    // Extract the path from the URL pattern
    const regex = /\/v1\/object\/([^?]+)/;
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