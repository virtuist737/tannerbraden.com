import { storage } from "../storage";
import { uploadToCloudinary } from "../lib/cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, '../../client/public/images');

async function migrateImages() {
  try {
    // Ensure the images directory exists
    if (!fs.existsSync(imagesDir)) {
      console.log('No images directory found, skipping migration');
      return;
    }

    // Get all files from the images directory
    const files = await fs.promises.readdir(imagesDir);

    // Get all entities that might have images
    const [timelines, interests, favorites, blogPosts, projects] = await Promise.all([
      storage.listTimeline(),
      storage.listInterests(),
      storage.listFavorites(),
      storage.listBlogPosts(),
      storage.listProjects()
    ]);

    console.log(`Found ${files.length} files to potentially migrate`);

    // Migrate images for each entity type
    const migrateEntityImages = async (
      entities: any[],
      imageField: string,
      entityType: string,
      updateFunction: (id: number, imageUrl: string) => Promise<any>
    ) => {
      for (const entity of entities) {
        const imageUrl = entity[imageField];
        if (!imageUrl || imageUrl.startsWith('http')) continue;

        const localImagePath = path.join(imagesDir, imageUrl);
        if (!fs.existsSync(localImagePath)) {
          console.log(`Image not found for ${entityType} ${entity.id}: ${localImagePath}`);
          continue;
        }

        try {
          // Create a file buffer from the local image
          const fileBuffer = await fs.promises.readFile(localImagePath);
          const file = {
            buffer: fileBuffer,
            mimetype: `image/${path.extname(localImagePath).slice(1)}`,
            originalname: path.basename(localImagePath)
          } as Express.Multer.File;

          // Upload to Cloudinary
          const cloudinaryUrl = await uploadToCloudinary(file, entityType);
          console.log(`Uploaded ${entityType} image to Cloudinary: ${cloudinaryUrl}`);

          // Update the database record
          await updateFunction(entity.id, cloudinaryUrl);
          console.log(`Updated ${entityType} ${entity.id} with new image URL`);
        } catch (error) {
          console.error(`Failed to migrate image for ${entityType} ${entity.id}:`, error);
        }
      }
    };

    // Migrate images for each entity type
    await migrateEntityImages(timelines, 'imageUrl', 'timeline', storage.updateTimelineImage);
    await migrateEntityImages(interests, 'imageUrl', 'interest', storage.updateInterestImage);
    await migrateEntityImages(favorites, 'imageUrl', 'favorite', storage.updateFavoriteImage);
    await migrateEntityImages(blogPosts, 'coverImage', 'blog', (id, url) => storage.updateBlogPost(id, { coverImage: url }));
    await migrateEntityImages(projects, 'imageUrl', 'project', storage.updateProjectImage);

    console.log('Image migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run the migration
migrateImages().catch(console.error);
