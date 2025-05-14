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

// Users table (existing)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Companies/Brands table
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url").notNull(),
  websiteUrl: text("website_url"),
  sortOrder: integer("sort_order").notNull().default(0),
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
  // SEO fields
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoKeywords: text("seo_keywords"),
  canonicalUrl: text("canonical_url"),
  isIndexed: boolean("is_indexed").notNull().default(true),
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

// Add projects table after the existing tables
// Update projects table to properly handle buttons and add company reference
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  technologies: text("technologies").array().notNull(),
  buttons: jsonb("buttons").notNull().$type<Button[]>().default([]), // Properly type the buttons field
  companyId: integer("company_id").references(() => companies.id),
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

// Project relationships
export const projectsRelations = relations(projects, ({ one }) => ({
  company: one(companies, {
    fields: [projects.companyId],
    references: [companies.id],
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
  seoTitle: z.string().max(60, "SEO Title should be under 60 characters").optional(),
  seoDescription: z.string().max(160, "SEO Description should be under 160 characters").optional(),
  seoKeywords: z.string().optional(),
  canonicalUrl: z.string().url("Must be a valid URL").optional(),
  isIndexed: z.boolean().optional().default(true),
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

// Company/Brand schema
export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
}).extend({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  logoUrl: z.string().min(1, "Logo URL is required"),
  websiteUrl: z.string().url("Valid URL is required").optional(),
  sortOrder: z.number().int().nonnegative().default(0),
});

// Update insertProjectSchema to properly validate buttons and add company reference
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
}).extend({
  technologies: z.array(z.string()),
  buttons: z.array(buttonSchema).default([]),
  companyId: z.number().int().positive().optional().nullable(),
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;



export type Interest = typeof interests.$inferSelect;
export type InsertInterest = z.infer<typeof insertInterestSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

export type Timeline = typeof timeline.$inferSelect;
export type InsertTimeline = z.infer<typeof insertTimelineSchema>;



// Add Button type for TypeScript
export type Button = z.infer<typeof buttonSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

// Company type
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;