import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertBlogPostSchema,
  insertNewsletterSubscriptionSchema,
  insertTimelineSchema,
  insertFavoriteSchema,
  insertInterestSchema,
  insertProjectSchema
} from "@shared/schema";
import { isAuthenticated } from "./auth";
import * as UAParser from "ua-parser-js";
import { upload } from "./lib/upload";
import path from "path";
import fs from "fs";

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
  app.post("/api/upload/blog/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid blog post ID" });
      }

      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(__dirname, '../client/public/images', fileName);

      await fs.promises.writeFile(filePath, req.file.buffer);

      // Update the blog post's cover image
      const updatedPost = await storage.updateBlogPost(id, { coverImage: fileName });
      if (!updatedPost) {
        return res.status(404).json({ error: "Blog post not found" });
      }

      res.json({ imageUrl: fileName });
    } catch (error) {
      console.error("Error uploading blog post image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Analytics Routes
  app.post("/api/analytics/pageview", async (req, res) => {
    try {
      const { path, scrollDepth } = req.body;
      const userAgent = req.headers["user-agent"];
      const referrer = req.headers.referer;

      // Parse user agent for detailed device info
      const parser = new UAParser.UAParser(userAgent);
      const result = parser.getResult();

      const pageView = await storage.recordPageView(path, userAgent, referrer);
      if (pageView) {
        await storage.updatePageView(pageView.id, {
          deviceType: result.device.type || "desktop",
          browser: result.browser.name || "unknown",
          platform: result.os.name || "unknown",
          scrollDepth: scrollDepth || 0,
          isExit: false,
          isBounce: false,
        });
      }

      res.status(201).json({ message: "Page view recorded" });
    } catch (error) {
      res.status(500).json({ error: "Failed to record page view" });
    }
  });

  app.get("/api/analytics/pageviews", isAuthenticated, async (req, res) => {
    try {
      const startDate = new Date(req.query.startDate as string || new Date().setDate(new Date().getDate() - 7));
      const endDate = new Date(req.query.endDate as string || new Date());

      const pageViews = await storage.getPageViews(startDate, endDate);

      // Calculate aggregate metrics
      const totalViews = pageViews.length;
      const bounceRate = pageViews.filter(view => view.isBounce).length / totalViews;
      const averageEngagement = pageViews.reduce((sum, view) => sum + (view.duration || 0), 0) / totalViews;

      const deviceBreakdown = pageViews.reduce((acc, view) => {
        const deviceType = view.deviceType || 'unknown';
        acc[deviceType] = (acc[deviceType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const analytics = {
        pageViews,
        metrics: {
          totalViews,
          bounceRate,
          averageEngagement,
          deviceBreakdown,
        }
      };

      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch page views" });
    }
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
      const parsedBody = insertFavoriteSchema.partial().safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: "Invalid favorite data" });
      }

      const favorite = await storage.updateFavorite(parseInt(req.params.id), parsedBody.data);
      if (!favorite) {
        return res.status(404).json({ error: "Favorite not found" });
      }
      res.json(favorite);
    } catch (error) {
      res.status(500).json({ error: "Failed to update favorite" });
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

  // Image Upload Routes
  app.post("/api/upload/timeline/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid timeline ID" });
      }

      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(__dirname, '../client/public/images', fileName);

      await fs.promises.writeFile(filePath, req.file.buffer);
      await storage.updateTimelineImage(id, fileName);

      res.json({ imageUrl: fileName });
    } catch (error) {
      console.error("Error uploading timeline image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.post("/api/upload/interest/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid interest ID" });
      }

      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(__dirname, '../client/public/images', fileName);

      await fs.promises.writeFile(filePath, req.file.buffer);
      await storage.updateInterestImage(id, fileName);

      res.json({ imageUrl: fileName });
    } catch (error) {
      console.error("Error uploading interest image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  app.post("/api/upload/favorite/:id", isAuthenticated, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid favorite ID" });
      }

      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = path.join(__dirname, '../client/public/images', fileName);

      await fs.promises.writeFile(filePath, req.file.buffer);
      await storage.updateFavoriteImage(id, fileName);

      res.json({ imageUrl: fileName });
    } catch (error) {
      console.error("Error uploading favorite image:", error);
      res.status(500).json({ error: "Failed to upload image" });
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

  const httpServer = createServer(app);
  return httpServer;
}