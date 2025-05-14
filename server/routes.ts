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
  insertCompanySchema
} from "@shared/schema";
import { isAuthenticated } from "./auth";

import { upload } from "./lib/upload";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { uploadToObjectStorage, getObjectPathFromUrl, deleteFromObjectStorage, objectStore } from './lib/objectStorage';

// ESM module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update the images directory path to point to the public/images folder
const imagesDir = path.join(__dirname, '../client/public/images');
fs.mkdirSync(imagesDir, { recursive: true });

export async function registerRoutes(app: Express): Promise<Server> {
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
      const parsedBody = insertBlogPostSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid blog post data" });
      }

      const post = await storage.createBlogPost({
        ...parsedBody.data,
        authorId: req.user!.id,
      });
      res.status(201).json(post);
    } catch (error) {
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
  app.post("/api/upload/blog/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    await handleImageUpload(req, res, "blog", (id, imageUrl) =>
      storage.updateBlogPost(id, { coverImage: imageUrl })
    );
  });

  app.post("/api/upload/timeline/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    await handleImageUpload(req, res, "timeline", storage.updateTimelineImage);
  });

  app.post("/api/upload/timeline-content/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    await handleImageUpload(req, res, "timeline-content", storage.updateTimelineImage);
  });

  app.post("/api/upload/interest/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    await handleImageUpload(req, res, "interest", storage.updateInterestImage);
  });

  app.post("/api/upload/favorite/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    await handleImageUpload(req, res, "favorite", storage.updateFavoriteImage);
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

  // Companies/Brands Routes
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.listCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }
      const company = await storage.getCompany(id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });

  app.post("/api/companies", isAuthenticated, async (req, res) => {
    try {
      const parsedBody = insertCompanySchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({
          error: "Invalid company data",
          details: parsedBody.error.errors
        });
      }

      const company = await storage.createCompany(parsedBody.data);
      res.status(201).json(company);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(500).json({ error: "Failed to create company" });
    }
  });

  app.patch("/api/companies/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }

      const parsedBody = insertCompanySchema.partial().safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid company data", details: parsedBody.error });
      }

      const company = await storage.updateCompany(id, parsedBody.data);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }

      return res.status(200).json(company);
    } catch (error) {
      console.error('Error updating company:', error);
      return res.status(500).json({ error: "Failed to update company" });
    }
  });

  app.delete("/api/companies/:id", isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteCompany(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete company" });
    }
  });

  // Get all companies
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.listCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  });
  
  // Get single company
  app.get("/api/companies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid company ID" });
      }
      const company = await storage.getCompany(id);
      if (!company) {
        return res.status(404).json({ error: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ error: "Failed to fetch company" });
    }
  });
  
  // Create new company
  app.post("/api/companies", isAuthenticated, async (req, res) => {
    try {
      const parsedBody = insertCompanySchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid company data", details: parsedBody.error });
      }
      const company = await storage.createCompany(parsedBody.data);
      res.status(201).json(company);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(500).json({ error: "Failed to create company" });
    }
  });

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