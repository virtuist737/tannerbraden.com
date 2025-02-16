import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table (existing)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  coverImage: text("cover_image").notNull(),
  authorId: integer("author_id").references(() => users.id),
  category: text("category").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
});

// Analytics - Page Views with enhanced tracking
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  duration: integer("duration"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  deviceType: text("device_type"),
  browser: text("browser"),
  platform: text("platform"),
  isExit: boolean("is_exit").default(false),
  isBounce: boolean("is_bounce").default(false),
  scrollDepth: integer("scroll_depth"),
});

// Analytics - User Sessions
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  userId: integer("user_id").references(() => users.id),
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time"),
  data: jsonb("data"),
});

// Newsletter Subscriptions
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  isConfirmed: boolean("is_confirmed").notNull().default(false),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
});

// Timeline table
export const timeline = pgTable("timeline", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(),
});

// Interests table
export const interests = pgTable("interests", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  type: text("type").notNull(),  // 'interests', 'instruments', 'activities'
  item: text("item").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

// Favorites table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  link: text("link"),
  image: text("image"),
  sortOrder: integer("sort_order").notNull(),
});

// Relations
export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

// Zod schemas for insertions
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  publishedAt: true,
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).pick({
  email: true,
});

export const insertInterestSchema = createInsertSchema(interests).omit({
  id: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
});

export const insertTimelineSchema = createInsertSchema(timeline).omit({
  id: true,
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;

export type PageView = typeof pageViews.$inferSelect;
export type UserSession = typeof userSessions.$inferSelect;

export type Interest = typeof interests.$inferSelect;
export type InsertInterest = z.infer<typeof insertInterestSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

export type Timeline = typeof timeline.$inferSelect;
export type InsertTimeline = z.infer<typeof insertTimelineSchema>;