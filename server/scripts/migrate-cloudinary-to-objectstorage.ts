import { storage } from "../storage";
import { uploadToObjectStorage, getObjectPathFromUrl } from "../lib/objectStorage";
import fetch from "node-fetch";

/**
 * Migrates images from Cloudinary to Replit Object Storage
 * This script will:
 * 1. Fetch all entities with image URLs
 * 2. Download each image from Cloudinary
 * 3. Upload the image to Replit Object Storage
 * 4. Update the entity's image URL in the database
 */
async function migrateCloudinaryToObjectStorage() {
  try {
    console.log("Starting migration from Cloudinary to Replit Object Storage...");

    // Fetch all entities with image URLs
    const timelines = await storage.listTimeline();
    const interests = await storage.listInterests();
    const favorites = await storage.listFavorites();
    const blogPosts = await storage.listBlogPosts();
    const projects = await storage.listProjects();

    console.log(`Found entities to migrate:
      - ${timelines.length} timeline events
      - ${interests.length} interests
      - ${favorites.length} favorites
      - ${blogPosts.length} blog posts
      - ${projects.length} projects
    `);

    // Function to migrate a single entity's image
    const migrateEntityImage = async (
      entity: any,
      imageUrlField: string,
      entityType: string,
      updateFunction: (id: number, imageUrl: string) => Promise<any>
    ) => {
      try {
        const imageUrl = entity[imageUrlField];
        
        // Skip entities without images
        if (!imageUrl) {
          console.log(`Skipping ${entityType} ${entity.id}: No image URL`);
          return;
        }

        // Skip entities with already migrated images
        if (imageUrl.includes('/api/objects/')) {
          console.log(`Skipping ${entityType} ${entity.id}: Already using Object Storage`);
          return;
        }

        console.log(`Migrating ${entityType} ${entity.id} image: ${imageUrl}`);

        // Download the image from Cloudinary
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to download image from Cloudinary: ${response.statusText}`);
        }

        // Get content type and file extension
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        const fileExtension = contentType.split('/')[1] || 'jpg';

        // Convert the image to buffer
        const buffer = await response.buffer();

        // Create a file object for uploadToObjectStorage
        const file = {
          buffer,
          mimetype: contentType,
          originalname: `migrated-image.${fileExtension}`
        } as Express.Multer.File;

        // Upload to Replit Object Storage
        const newImageUrl = await uploadToObjectStorage(file, entityType);
        console.log(`Uploaded to Object Storage: ${newImageUrl}`);

        // Update the database record
        await updateFunction(entity.id, newImageUrl);
        console.log(`Updated ${entityType} ${entity.id} with new image URL`);
      } catch (error) {
        console.error(`Failed to migrate image for ${entityType} ${entity.id}:`, error);
      }
    };

    // Migrate all entities
    console.log("Migrating timeline images...");
    for (const entity of timelines) {
      await migrateEntityImage(entity, 'imageUrl', 'timeline', storage.updateTimelineImage);
    }

    console.log("Migrating interest images...");
    for (const entity of interests) {
      await migrateEntityImage(entity, 'imageUrl', 'interest', storage.updateInterestImage);
    }

    console.log("Migrating favorite images...");
    for (const entity of favorites) {
      await migrateEntityImage(entity, 'imageUrl', 'favorite', storage.updateFavoriteImage);
    }

    console.log("Migrating blog post cover images...");
    for (const entity of blogPosts) {
      await migrateEntityImage(entity, 'coverImage', 'blog', (id, url) => 
        storage.updateBlogPost(id, { coverImage: url })
      );
    }

    console.log("Migrating project images...");
    for (const entity of projects) {
      await migrateEntityImage(entity, 'imageUrl', 'project', storage.updateProjectImage);
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Run the migration
migrateCloudinaryToObjectStorage()
  .then(() => {
    console.log("Migration script completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration script failed:", error);
    process.exit(1);
  });