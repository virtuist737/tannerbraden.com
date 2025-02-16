import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, insertBlogCommentSchema, insertNewsletterSubscriptionSchema } from "@shared/schema";
import { isAuthenticated } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Blog Routes
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.listBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:identifier", async (req, res) => {
    try {
      let post;
      // Try to parse as ID first
      const id = parseInt(req.params.identifier);
      if (!isNaN(id)) {
        post = await storage.getBlogPost(id);
      } else {
        // If not a valid ID, treat as slug
        post = await storage.getBlogPostBySlug(req.params.identifier);
      }

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

  // Analytics Routes
  app.post("/api/analytics/pageview", async (req, res) => {
    try {
      const { path } = req.body;
      const userAgent = req.headers["user-agent"];
      const referrer = req.headers.referer;

      await storage.recordPageView(path, userAgent, referrer);
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
      res.json(pageViews);
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

  const httpServer = createServer(app);
  return httpServer;
}