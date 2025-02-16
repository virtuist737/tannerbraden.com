import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, insertBlogCommentSchema, insertNewsletterSubscriptionSchema } from "@shared/schema";

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

  app.get("/api/blog/:slug", async (req, res) => {
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

  app.get("/api/analytics/pageviews", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}