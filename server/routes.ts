import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertBlogPostSchema,
  insertNewsletterSubscriptionSchema,
  insertTimelineSchema,
  insertFavoriteSchema,
  insertInterestSchema,
  insertProjectSchema,
  insertVentureSchema
} from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";

import { upload, audioUpload } from "./lib/upload";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { uploadToObjectStorage, getObjectPathFromUrl, deleteFromObjectStorage, objectStore, uploadOptimizedBlogImage } from './lib/objectStorage';

// ESM module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update the images directory path to point to the public/images folder
const imagesDir = path.join(__dirname, '../client/public/images');
fs.mkdirSync(imagesDir, { recursive: true });

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Timeline Routes
  app.get("/api/timeline", async (req, res) => {
    try {
      const timelineEvents = await storage.listTimeline();
      res.json(timelineEvents);
    } catch (error) {
      console.error("Error fetching timeline:", error);
      res.status(500).json({ error: "Failed to fetch timeline" });
    }
  });

  app.post("/api/timeline", isAuthenticated, async (req, res) => {
    try {
      const parsedBody = insertTimelineSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid timeline data" });
      }

      const timeline = await storage.createTimeline(parsedBody.data);
      res.status(201).json(timeline);
    } catch (error) {
      console.error("Error creating timeline:", error);
      res.status(500).json({ error: "Failed to create timeline entry" });
    }
  });

  app.patch("/api/timeline/:id", isAuthenticated, async (req, res) => {
    try {
      const parsedBody = insertTimelineSchema.partial().safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid timeline data" });
      }

      const timeline = await storage.updateTimeline(parseInt(req.params.id), parsedBody.data);
      if (!timeline) {
        return res.status(404).json({ error: "Timeline entry not found" });
      }
      res.json(timeline);
    } catch (error) {
      console.error("Error updating timeline:", error);
      res.status(500).json({ error: "Failed to update timeline entry" });
    }
  });

  app.delete("/api/timeline/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteTimeline(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Timeline entry not found" });
      }
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting timeline:", error);
      res.status(500).json({ error: "Failed to delete timeline entry" });
    }
  });

  app.get("/api/timeline/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid timeline ID" });
      }
      const timelines = await storage.listTimeline();
      const timeline = timelines.find(t => t.id === id);
      if (!timeline) {
        return res.status(404).json({ error: "Timeline entry not found" });
      }
      res.json(timeline);
    } catch (error) {
      console.error("Error fetching timeline:", error);
      res.status(500).json({ error: "Failed to fetch timeline entry" });
    }
  });

  // Blog Routes
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.listBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/slug/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid blog post ID" });
      }
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Protected Admin Blog Routes
  app.post("/api/blog", isAuthenticated, async (req, res) => {
    try {
      console.log("Creating blog post:", { 
        isAuthenticated: req.isAuthenticated(), 
        user: req.user,
        body: req.body
      });
      
      const parsedBody = insertBlogPostSchema.safeParse(req.body);
      if (!parsedBody.success) {
        console.error("Invalid blog post data:", parsedBody.error);
        return res.status(400).json({ error: "Invalid blog post data", details: parsedBody.error.errors });
      }

      if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const post = await storage.createBlogPost({
        ...parsedBody.data,
        authorId: (req.user as any).claims.sub,
      });
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.patch("/api/blog/:id", isAuthenticated, async (req, res) => {
    try {
      const parsedBody = insertBlogPostSchema.partial().safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid blog post data" });
      }

      const post = await storage.updateBlogPost(parseInt(req.params.id), parsedBody.data);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/blog/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteBlogPost(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  // Add new route for blog post image upload
  // Generic image upload handler
  const handleImageUpload = async (req: any, res: any, entityType: string, updateFunction: (id: number, imageUrl: string) => Promise<any>) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // For content images, we don't need to update the database
      const isContentImage = entityType.endsWith('-content');
      let id: number | undefined;

      if (!isContentImage) {
        id = parseInt(req.params.id);
        if (isNaN(id)) {
          return res.status(400).json({ error: `Invalid ${entityType} ID` });
        }
      }

      // Upload to Replit Object Storage
      const imageUrl = await uploadToObjectStorage(req.file, entityType);

      // Only update the database for non-content images
      if (!isContentImage && id !== undefined) {
        await updateFunction(id, imageUrl);
      }

      // Return the image URL
      res.json({ imageUrl });
    } catch (error) {
      console.error(`Error uploading ${entityType} image:`, error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  };

  // Upload routes for different entity types
  // IMPORTANT: More specific routes must come before parameter routes
  
  // Add route for audio uploads
  app.post("/api/upload/audio", isAuthenticated, audioUpload.single("audio"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = req.file.originalname.split('.').pop();
      const filename = `audio_${timestamp}_${randomString}.${extension}`;
      
      const audioUrl = await uploadToObjectStorage(req.file, "blog/audio", filename);
      
      res.json({ url: audioUrl });
    } catch (error) {
      console.error("Error uploading audio:", error);
      res.status(500).json({ error: "Failed to upload audio file" });
    }
  });

  // Add route for song cover image uploads
  app.post("/api/upload/song-cover", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = req.file.originalname.split('.').pop();
      const filename = `song_cover_${timestamp}_${randomString}.${extension}`;
      
      const imageUrl = await uploadToObjectStorage(req.file, "blog/song-covers", filename);
      
      res.json({ imageUrl });
    } catch (error) {
      console.error("Error uploading song cover:", error);
      res.status(500).json({ error: "Failed to upload song cover image" });
    }
  });
  
  // Add route for temporary blog uploads (for new blog posts)
  app.post("/api/upload/blog/temp", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      
      // Upload and optimize the image to Replit Object Storage without database update
      const optimizedUrls = await uploadOptimizedBlogImage(req.file, "blog-temp");
      
      // Return the optimized image URLs (medium as primary for form compatibility)
      res.json({ 
        imageUrl: optimizedUrls.medium,
        optimizedUrls 
      });
    } catch (error) {
      console.error(`Error uploading temporary blog image:`, error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });
  
  // Route for regular blog image uploads with IDs
  app.post("/api/upload/blog/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid blog ID" });
      }

      // Get the current blog post to see if there's an existing image
      const existingPost = await storage.getBlogPost(id);
      
      // Upload and optimize the image to Replit Object Storage
      const optimizedUrls = await uploadOptimizedBlogImage(
        req.file, 
        "blog",
        existingPost?.coverImage || undefined
      );
      
      // Update the blog post with all optimized image URLs
      const post = await storage.updateBlogPost(id, { 
        coverImage: optimizedUrls.medium,
        coverImageThumbnail: optimizedUrls.thumbnail,
        coverImageMedium: optimizedUrls.medium,
        coverImageLarge: optimizedUrls.large
      } as any);
      
      res.json({ 
        post, 
        imageUrl: optimizedUrls.medium,
        optimizedUrls 
      });
    } catch (error) {
      console.error(`Error uploading blog image:`, error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });
  
  // Add route for blog content image uploads with temp ID
  app.post("/api/upload/blog-content/temp", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      
      // Upload to Replit Object Storage
      const imageUrl = await uploadToObjectStorage(req.file, "blog-content");
      
      // Return the image URL without updating the database
      res.json({ imageUrl });
    } catch (error) {
      console.error(`Error uploading temporary blog content image:`, error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });
  
  // Add route for blog content image uploads with numeric IDs
  app.post("/api/upload/blog-content/:id([0-9]+)", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      
      // Validate the numeric ID
      const numericId = parseInt(req.params.id);
      if (isNaN(numericId)) {
        return res.status(400).json({ error: "Invalid blog ID" });
      }
      
      // Upload to Replit Object Storage
      const imageUrl = await uploadToObjectStorage(req.file, "blog-content");
      
      // Return the image URL without updating the database
      res.json({ imageUrl });
    } catch (error) {
      console.error(`Error uploading blog content image:`, error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.post("/api/upload/timeline/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    await handleImageUpload(req, res, "timeline", storage.updateTimelineImage);
  });

  app.post("/api/upload/timeline-content/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    await handleImageUpload(req, res, "timeline-content", storage.updateTimelineImage);
  });

  // Add route for temporary interest uploads (for new interests) - must come before parameterized route
  app.post("/api/upload/interest/temp", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      
      // Upload to Replit Object Storage without database update
      const imageUrl = await uploadToObjectStorage(req.file, "interests");
      
      // Return the image URL
      res.json({ imageUrl });
    } catch (error) {
      console.error(`Error uploading temporary interest image:`, error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.post("/api/upload/interest/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    await handleImageUpload(req, res, "interest", storage.updateInterestImage);
  });

  app.post("/api/upload/favorite/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    await handleImageUpload(req, res, "favorite", storage.updateFavoriteImage);
  });

  // Add route for temporary project uploads (for new projects)
  app.post("/api/upload/project/temp", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      
      // Upload to Replit Object Storage without database update
      const imageUrl = await uploadToObjectStorage(req.file, "projects");
      
      // Return the image URL
      res.json({ imageUrl });
    } catch (error) {
      console.error(`Error uploading temporary project image:`, error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Audio upload endpoint
  app.post("/api/upload/audio", isAuthenticated, audioUpload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No audio file provided" });
      }

      // Validate file type
      if (!req.file.mimetype.startsWith("audio/")) {
        return res.status(400).json({ error: "Please upload an audio file" });
      }

      // Validate file size (max 10MB)
      if (req.file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ error: "File size must be less than 10MB" });
      }

      const folder = "audio";
      
      // Upload to Object Storage
      const audioUrl = await uploadToObjectStorage(req.file, folder);
      
      res.json({
        url: audioUrl,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    } catch (error) {
      console.error("Audio upload failed:", error);
      res.status(500).json({ error: "Audio upload failed" });
    }
  });

  app.post("/api/upload/project/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    await handleImageUpload(req, res, "project", storage.updateProjectImage);
  });




  // Newsletter Routes
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const parsedBody = insertNewsletterSubscriptionSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid email address" });
      }

      await storage.subscribeToNewsletter(parsedBody.data.email);
      res.status(201).json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      res.status(500).json({ error: "Failed to subscribe to newsletter" });
    }
  });

  app.get("/api/newsletter/subscribers", isAuthenticated, async (req, res) => {
    try {
      const subscribers = await storage.listNewsletterSubscribers();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch newsletter subscribers" });
    }
  });

  // About Page Routes
  app.get("/api/about/timeline", async (req, res) => {
    try {
      const timelineEvents = await storage.listTimeline();
      if (!timelineEvents) {
        return res.status(404).json({ error: "No timeline entries found" });
      }
      res.json(timelineEvents);
    } catch (error: any) {
      console.error("Error fetching timeline:", error);
      res.status(500).json({ error: "Failed to fetch timeline", details: error?.message || 'Unknown error' });
    }
  });

  app.get("/api/about/interests", async (req, res) => {
    try {
      const interests = await storage.listInterests();
      res.json(interests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch interests" });
    }
  });

  app.get("/api/about/interests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid interest ID" });
      }
      const interest = await storage.getInterest(id);
      if (!interest) {
        return res.status(404).json({ error: "Interest not found" });
      }
      res.json(interest);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch interest" });
    }
  });

  app.post("/api/about/interests", isAuthenticated, async (req, res) => {
    try {
      const parsedBody = insertInterestSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid interest data" });
      }

      const interest = await storage.createInterest(parsedBody.data);
      res.status(201).json(interest);
    } catch (error) {
      res.status(500).json({ error: "Failed to create interest" });
    }
  });

  app.patch("/api/about/interests/:id", isAuthenticated, async (req, res) => {
    try {
      const parsedBody = insertInterestSchema.partial().safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid interest data" });
      }

      const interest = await storage.updateInterest(parseInt(req.params.id), parsedBody.data);
      if (!interest) {
        return res.status(404).json({ error: "Interest not found" });
      }
      res.json(interest);
    } catch (error) {
      res.status(500).json({ error: "Failed to update interest" });
    }
  });

  app.delete("/api/about/interests/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteInterest(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Interest not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete interest" });
    }
  });

  // Add this new route after the existing interests routes
  app.post("/api/about/interests/reorder", isAuthenticated, async (req, res) => {
    try {
      const { updates } = req.body;

      if (!Array.isArray(updates)) {
        return res.status(400).json({ error: "Updates must be an array" });
      }

      // Validate each update object
      for (const update of updates) {
        if (typeof update.id !== 'number' || typeof update.sortOrder !== 'number') {
          return res.status(400).json({ error: "Invalid update format" });
        }
      }

      // Process all updates sequentially
      for (const update of updates) {
        await storage.updateInterest(update.id, { sortOrder: update.sortOrder });
      }

      // Return success
      res.json({ message: "Sort order updated successfully" });
    } catch (error) {
      console.error("Error updating interests order:", error);
      res.status(500).json({ error: "Failed to update interests order" });
    }
  });

  app.get("/api/about/favorites", async (req, res) => {
    try {
      const favorites = await storage.listFavorites();
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  // Favorites Routes
  app.get("/api/about/favorites/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid favorite ID" });
      }
      const favorite = await storage.getFavorite(id);
      if (!favorite) {
        return res.status(404).json({ error: "Favorite not found" });
      }
      res.json(favorite);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorite" });
    }
  });

  app.post("/api/about/favorites", isAuthenticated, async (req, res) => {
    try {
      const parsedBody = insertFavoriteSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid favorite data" });
      }

      const favorite = await storage.createFavorite(parsedBody.data);
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ error: "Failed to create favorite" });
    }
  });

  app.patch("/api/about/favorites/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid favorite ID" });
      }

      const parsedBody = insertFavoriteSchema.partial().safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid favorite data", details: parsedBody.error });
      }

      const favorite = await storage.updateFavorite(id, parsedBody.data);
      if (!favorite) {
        return res.status(404).json({ error: "Favorite not found" });
      }

      return res.status(200).json(favorite);
    } catch (error) {
      console.error('Error updating favorite:', error);
      return res.status(500).json({ error: "Failed to update favorite" });
    }
  });

  app.delete("/api/about/favorites/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteFavorite(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Favorite not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete favorite" });
    }
  });

  // Add this new route after the existing favorites routes
  app.post("/api/about/favorites/reorder", isAuthenticated, async (req, res) => {
    try {
      const { updates } = req.body;

      if (!Array.isArray(updates)) {
        return res.status(400).json({ error: "Updates must be an array" });
      }

      // Validate each update object
      for (const update of updates) {
        if (typeof update.id !== 'number' || typeof update.sortOrder !== 'number') {
          return res.status(400).json({ error: "Invalid update format" });
        }
      }

      // Process all updates sequentially
      for (const update of updates) {
        await storage.updateFavorite(update.id, { sortOrder: update.sortOrder });
      }

      // Return success
      res.json({ message: "Sort order updated successfully" });
    } catch (error) {
      console.error("Error updating favorites order:", error);
      res.status(500).json({ error: "Failed to update favorites order" });
    }
  });

  // Ventures Routes
  app.get("/api/ventures", async (req, res) => {
    try {
      const ventures = await storage.listVentures();
      res.json(ventures);
    } catch (error) {
      console.error("Error fetching ventures:", error);
      res.status(500).json({ error: "Failed to fetch ventures" });
    }
  });

  app.get("/api/ventures/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid venture ID" });
      }
      const venture = await storage.getVenture(id);
      if (!venture) {
        return res.status(404).json({ error: "Venture not found" });
      }
      res.json(venture);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch venture" });
    }
  });

  app.post("/api/ventures", isAuthenticated, async (req, res) => {
    try {
      const parsedBody = insertVentureSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({
          error: "Invalid venture data",
          details: parsedBody.error.errors
        });
      }

      const venture = await storage.createVenture(parsedBody.data);
      res.status(201).json(venture);
    } catch (error) {
      console.error("Error creating venture:", error);
      res.status(500).json({ error: "Failed to create venture" });
    }
  });

  app.patch("/api/ventures/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid venture ID" });
      }

      const parsedBody = insertVentureSchema.partial().safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid venture data", details: parsedBody.error });
      }

      const venture = await storage.updateVenture(id, parsedBody.data);
      if (!venture) {
        return res.status(404).json({ error: "Venture not found" });
      }

      return res.status(200).json(venture);
    } catch (error) {
      console.error('Error updating venture:', error);
      return res.status(500).json({ error: "Failed to update venture" });
    }
  });

  app.delete("/api/ventures/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteVenture(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Venture not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete venture" });
    }
  });

  // These routes are now handled above with the ventures endpoints

  // Projects Routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.listProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", isAuthenticated, async (req, res) => {
    try {
      console.log("Received project data:", JSON.stringify(req.body, null, 2));

      const parsedBody = insertProjectSchema.safeParse(req.body);
      if (!parsedBody.success) {
        console.error("Validation errors:", parsedBody.error.errors);
        return res.status(400).json({
          error: "Invalid project data",
          details: parsedBody.error.errors
        });
      }

      const project = await storage.createProject(parsedBody.data);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        error: "Failed to create project",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.patch("/api/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const parsedBody = insertProjectSchema.partial().safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid project data" });
      }

      const project = await storage.updateProject(parseInt(req.params.id), parsedBody.data);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteProject(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Add this new route for reordering projects
  app.post("/api/projects/reorder", isAuthenticated, async (req, res) => {
    try {
      const { updates } = req.body;

      if (!Array.isArray(updates)) {
        return res.status(400).json({ error: "Updates must be an array" });
      }

      // Validate each update object
      for (const update of updates) {
        if (typeof update.id !== 'number' || typeof update.sortOrder !== 'number') {
          return res.status(400).json({ error: "Invalid update format" });
        }
      }

      // Process all updates sequentially
      for (const update of updates) {
        await storage.updateProject(update.id, { sortOrder: update.sortOrder });
      }

      // Return success
      res.json({ message: "Sort order updated successfully" });
    } catch (error) {
      console.error("Error updating projects order:", error);
      res.status(500).json({ error: "Failed to update projects order" });
    }
  });

  // Add GET single project route
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });
  
  // Add route to serve images from Object Storage
  app.get("/api/objects/:path(*)", async (req, res) => {
    try {
      const objectPath = req.params.path;
      if (!objectPath) {
        return res.status(400).json({ error: "Invalid object path" });
      }
      
      // Download the image from Object Storage
      const result = await objectStore.downloadAsBytes(objectPath);
      
      if (!result.ok) {
        console.error(`Error fetching object: ${objectPath}`, result.error);
        return res.status(404).json({ error: "File not found" });
      }
      
      // Get the file extension to determine content type
      const fileExtension = path.extname(objectPath).toLowerCase();
      let contentType = 'application/octet-stream'; // Default content type
      
      // Set the appropriate content type based on file extension
      switch (fileExtension) {
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.png':
          contentType = 'image/png';
          break;
        case '.gif':
          contentType = 'image/gif';
          break;
        case '.svg':
          contentType = 'image/svg+xml';
          break;
        case '.webp':
          contentType = 'image/webp';
          break;
        case '.mp3':
          contentType = 'audio/mpeg';
          break;
        case '.wav':
          contentType = 'audio/wav';
          break;
        case '.ogg':
          contentType = 'audio/ogg';
          break;
        case '.m4a':
          contentType = 'audio/m4a';
          break;
        case '.flac':
          contentType = 'audio/flac';
          break;
        case '.aac':
          contentType = 'audio/aac';
          break;
      }
      
      // Set content type and return the file
      res.set('Content-Type', contentType);
      res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
      res.send(result.value[0]);
    } catch (error) {
      console.error("Error serving object:", error);
      res.status(500).json({ error: "Failed to serve file" });
    }
  });



  const httpServer = createServer(app);
  return httpServer;
}