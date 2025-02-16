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

// Life Story sections
export const lifeStory = pgTable("life_story", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
});

// Life Purpose
export const lifePurpose = pgTable("life_purpose", {
  id: serial("id").primaryKey(),
  summary: text("summary").notNull(),
  opportunities: text("opportunities").array(),
});

// Personality
export const personalityTraits = pgTable("personality_traits", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // 'bigFive' or 'mbti'
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const personalityWeaknesses = pgTable("personality_weaknesses", {
  id: serial("id").primaryKey(),
  weakness: text("weakness").notNull(),
});

// Philosophy
export const philosophy = pgTable("philosophy", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // 'virtues', 'freeWill', 'religion'
  title: text("title"),
  content: text("content").notNull(),
});

// Professional Experience
export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  type: text("type").notNull(),
  period: text("period").notNull(),
  duration: text("duration"),
  responsibilities: text("responsibilities").array(),
  achievements: text("achievements").array(),
});

// Recommendations
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // 'books', 'apps', 'music', 'podcasts'
  name: text("name").notNull(),
  description: text("description"),
  subcategory: text("subcategory"), // e.g., 'fantasy', 'sciFi' for books
});

// Hobbies
export const hobbies = pgTable("hobbies", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  name: text("name").notNull(),
});

// Blog posts table (existing)
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

// Blog comments table
export const blogComments = pgTable("blog_comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id),
  postId: integer("post_id").references(() => blogPosts.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Analytics - Page Views with enhanced tracking
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  duration: integer("duration"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  // New fields for enhanced analytics
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

// Relations
export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
  comments: many(blogComments),
}));

export const blogCommentsRelations = relations(blogComments, ({ one }) => ({
  author: one(users, {
    fields: [blogComments.authorId],
    references: [users.id],
  }),
  post: one(blogPosts, {
    fields: [blogComments.postId],
    references: [blogPosts.id],
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

export const insertBlogCommentSchema = createInsertSchema(blogComments).omit({
  id: true,
  createdAt: true,
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).pick({
  email: true,
});

export const insertLifeStorySchema = createInsertSchema(lifeStory).omit({
  id: true,
});

export const insertLifePurposeSchema = createInsertSchema(lifePurpose).omit({
  id: true,
});

export const insertPersonalityTraitSchema = createInsertSchema(personalityTraits).omit({
  id: true,
});

export const insertPhilosophySchema = createInsertSchema(philosophy).omit({
  id: true,
});

export const insertExperienceSchema = createInsertSchema(experience).omit({
  id: true,
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({
  id: true,
});

export const insertHobbySchema = createInsertSchema(hobbies).omit({
  id: true,
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = z.infer<typeof insertBlogCommentSchema>;

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;

export type PageView = typeof pageViews.$inferSelect;
export type UserSession = typeof userSessions.$inferSelect;

export type LifeStory = typeof lifeStory.$inferSelect;
export type InsertLifeStory = z.infer<typeof insertLifeStorySchema>;

export type LifePurpose = typeof lifePurpose.$inferSelect;
export type InsertLifePurpose = z.infer<typeof insertLifePurposeSchema>;

export type PersonalityTrait = typeof personalityTraits.$inferSelect;
export type InsertPersonalityTrait = z.infer<typeof insertPersonalityTraitSchema>;

export type Philosophy = typeof philosophy.$inferSelect;
export type InsertPhilosophy = z.infer<typeof insertPhilosophySchema>;

export type Experience = typeof experience.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;

export type Recommendation = typeof recommendations.$inferSelect;
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;

export type Hobby = typeof hobbies.$inferSelect;
export type InsertHobby = z.infer<typeof insertHobbySchema>;