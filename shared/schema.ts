import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Add the button schema before the projects table
export const buttonSchema = z.object({
  title: z.string().min(1, "Button title is required"),
  url: z.string().url("Valid URL is required"),
  icon: z.string().optional(),
  variant: z.enum(["default", "destructive", "outline", "secondary", "ghost", "link"]).default("default"),
});

// Add after the buttonSchema and before the users table
export const achievementSchema = z.object({
  title: z.string().min(1, "Achievement title is required"),
  description: z.string().min(1, "Achievement description is required"),
  icon: z.string().min(1, "Achievement icon is required"),
  points: z.number().int().min(0),
  requirements: z.string().min(1, "Achievement requirements are required"),
});

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
  coverImage: text("cover_image"),  // Remove notNull constraint
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

// Timeline table - adding imageUrl
export const timeline = pgTable("timeline", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: text("date").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"), // New field
});

// Interests table - updated to mirror favorites structure
export const interests = pgTable("interests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  link: text("link"),
  image: text("image"),
  sortOrder: integer("sort_order").notNull(),
});

// Favorites table remains unchanged since it already has an image field
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  link: text("link"),
  image: text("image"),
  sortOrder: integer("sort_order").notNull(),
});

// Add after the existing tables
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  points: integer("points").notNull().default(0),
  requirements: text("requirements").notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  achievementId: integer("achievement_id").references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  totalPoints: integer("total_points").notNull().default(0),
  lastVisit: timestamp("last_visit").notNull().defaultNow(),
  visitStreak: integer("visit_streak").notNull().default(0),
  sectionsVisited: text("sections_visited").array().notNull().default([]),
  collectiblesFound: integer("collectibles_found").notNull().default(0),
});

export const leaderboard = pgTable("leaderboard", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  username: text("username").notNull(),
  score: integer("score").notNull().default(0),
  rank: integer("rank").notNull().default(0),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

// Add projects table after the existing tables
// Update projects table to properly handle buttons
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  technologies: text("technologies").array().notNull(),
  buttons: jsonb("buttons").notNull().$type<Button[]>().default([]), // Properly type the buttons field
  sortOrder: integer("sort_order").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
}));

// Add after existing relations
export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
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
}).extend({
  coverImage: z.string().optional(),  // Make explicitly optional in zod schema
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).pick({
  email: true,
});

export const insertInterestSchema = createInsertSchema(interests).omit({
  id: true,
}).extend({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  sortOrder: z.number().int().nonnegative(),
  description: z.string().optional().nullable(),
  link: z.string().url().optional().nullable(),
  image: z.string().optional().nullable(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).extend({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  sortOrder: z.number().int().nonnegative(),
  description: z.string().optional().nullable(),
  link: z.string().url().optional().nullable(),
  image: z.string().optional().nullable(),
});

export const insertTimelineSchema = createInsertSchema(timeline).omit({
  id: true,
}).extend({
  imageUrl: z.string().optional(),
});

// Add after existing schemas
export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastVisit: true,
});

export const insertLeaderboardSchema = createInsertSchema(leaderboard).omit({
  id: true,
  lastUpdated: true,
  rank: true,
});

// Update insertProjectSchema to properly validate buttons
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
}).extend({
  technologies: z.array(z.string()),
  buttons: z.array(buttonSchema).default([]),
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

// Add after existing types
export type Button = z.infer<typeof buttonSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

// Add after existing types
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type Leaderboard = typeof leaderboard.$inferSelect;
export type InsertLeaderboard = z.infer<typeof insertLeaderboardSchema>;