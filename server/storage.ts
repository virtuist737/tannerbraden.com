import { eq, sql, and, not } from "drizzle-orm";
import { db } from "./db";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import {
  users,
  blogPosts,
  newsletterSubscriptions,
  timeline as timelineTable,
  interests,
  favorites,
  projects,
  ventures,
  type User,
  type InsertUser,
  type UpsertUser,
  type BlogPost,
  type InsertBlogPost,
  type NewsletterSubscription,
  type InsertNewsletterSubscription,
  type Timeline,
  type Interest,
  type Favorite,
  type InsertTimeline,
  type InsertInterest,
  type InsertFavorite,
  type Project,
  type InsertProject,
  type Venture,
  type InsertVenture,
} from "@shared/schema";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations - updated for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Blog operations
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  listBlogPosts(): Promise<BlogPost[]>;
  updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Newsletter operations
  subscribeToNewsletter(email: string): Promise<NewsletterSubscription>;
  confirmNewsletterSubscription(email: string): Promise<void>;
  listNewsletterSubscribers(): Promise<NewsletterSubscription[]>;

  // Session store for authentication
  sessionStore: session.Store;

  // About page methods
  listTimeline(): Promise<Timeline[]>;
  listInterests(): Promise<Interest[]>;
  listFavorites(): Promise<Favorite[]>;

  // Image update methods
  updateTimelineImage(id: number, imageUrl: string): Promise<Timeline>;
  updateInterestImage(id: number, imageUrl: string): Promise<Interest>;
  updateFavoriteImage(id: number, imageUrl: string): Promise<Favorite>;

  // Timeline management methods
  createTimeline(timeline: InsertTimeline): Promise<Timeline>;
  updateTimeline(id: number, updates: Partial<InsertTimeline>): Promise<Timeline | undefined>;
  deleteTimeline(id: number): Promise<boolean>;

  // Interest operations
  getInterest(id: number): Promise<Interest | undefined>;
  createInterest(interest: InsertInterest): Promise<Interest>;
  updateInterest(id: number, updates: Partial<InsertInterest>): Promise<Interest | undefined>;
  deleteInterest(id: number): Promise<boolean>;

  // Add Favorite operations
  getFavorite(id: number): Promise<Favorite | undefined>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  updateFavorite(id: number, updates: Partial<InsertFavorite>): Promise<Favorite | undefined>;
  deleteFavorite(id: number): Promise<boolean>;

  // Venture/Brand operations
  createVenture(venture: InsertVenture): Promise<Venture>;
  getVenture(id: number): Promise<Venture | undefined>;
  listVentures(): Promise<Venture[]>;
  updateVenture(id: number, updates: Partial<InsertVenture>): Promise<Venture | undefined>;
  deleteVenture(id: number): Promise<boolean>;

  // Project operations
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  listProjects(): Promise<Project[]>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  updateProjectImage(id: number, imageUrl: string): Promise<Project>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User operations - updated for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Blog operations
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async listBlogPosts(): Promise<BlogPost[]> {
    return db.select().from(blogPosts).orderBy(sql`${blogPosts.publishedAt} DESC`);
  }

  async updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set(updates)
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const [deletedPost] = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning();
    return !!deletedPost;
  }

  // Newsletter operations
  async subscribeToNewsletter(email: string): Promise<NewsletterSubscription> {
    const [subscription] = await db
      .insert(newsletterSubscriptions)
      .values({ email })
      .returning();
    return subscription;
  }

  async confirmNewsletterSubscription(email: string): Promise<void> {
    await db
      .update(newsletterSubscriptions)
      .set({ isConfirmed: true })
      .where(eq(newsletterSubscriptions.email, email));
  }

  async listNewsletterSubscribers(): Promise<NewsletterSubscription[]> {
    return db
      .select()
      .from(newsletterSubscriptions)
      .orderBy(newsletterSubscriptions.subscribedAt);
  }



  // About page methods
  async listTimeline(): Promise<Timeline[]> {
    return db
      .select()
      .from(timelineTable)
      .orderBy(timelineTable.date);
  }

  async listInterests(): Promise<Interest[]> {
    return db
      .select()
      .from(interests)
      .orderBy(interests.sortOrder);
  }

  async listFavorites(): Promise<Favorite[]> {
    return db
      .select()
      .from(favorites)
      .orderBy(favorites.sortOrder);
  }

  // Image update methods
  async updateTimelineImage(id: number, imageUrl: string): Promise<Timeline> {
    const [updated] = await db
      .update(timelineTable)
      .set({ imageUrl })
      .where(eq(timelineTable.id, id))
      .returning();
    return updated;
  }

  async updateInterestImage(id: number, imageUrl: string): Promise<Interest> {
    const [updated] = await db
      .update(interests)
      .set({ image: imageUrl })
      .where(eq(interests.id, id))
      .returning();
    return updated;
  }

  async updateFavoriteImage(id: number, imageUrl: string): Promise<Favorite> {
    const [updated] = await db
      .update(favorites)
      .set({ image: imageUrl })
      .where(eq(favorites.id, id))
      .returning();
    return updated;
  }

  // Timeline management implementation
  async createTimeline(timeline: InsertTimeline): Promise<Timeline> {
    const [newTimeline] = await db.insert(timelineTable).values(timeline).returning();
    return newTimeline;
  }

  async updateTimeline(id: number, updates: Partial<InsertTimeline>): Promise<Timeline | undefined> {
    const [updatedTimeline] = await db
      .update(timelineTable)
      .set(updates)
      .where(eq(timelineTable.id, id))
      .returning();
    return updatedTimeline;
  }

  async deleteTimeline(id: number): Promise<boolean> {
    const [deletedTimeline] = await db
      .delete(timelineTable)
      .where(eq(timelineTable.id, id))
      .returning();
    return !!deletedTimeline;
  }

  // Interest operations
  async getInterest(id: number): Promise<Interest | undefined> {
    const [interest] = await db.select().from(interests).where(eq(interests.id, id));
    return interest;
  }

  async createInterest(interest: InsertInterest): Promise<Interest> {
    const [newInterest] = await db.insert(interests).values(interest).returning();
    return newInterest;
  }

  async updateInterest(id: number, updates: Partial<InsertInterest>): Promise<Interest | undefined> {
    const [updatedInterest] = await db
      .update(interests)
      .set(updates)
      .where(eq(interests.id, id))
      .returning();
    return updatedInterest;
  }

  async deleteInterest(id: number): Promise<boolean> {
    const [deletedInterest] = await db
      .delete(interests)
      .where(eq(interests.id, id))
      .returning();
    return !!deletedInterest;
  }

  // Favorite operations
  async getFavorite(id: number): Promise<Favorite | undefined> {
    const [favorite] = await db.select().from(favorites).where(eq(favorites.id, id));
    return favorite;
  }

  async createFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const [newFavorite] = await db.insert(favorites).values(favorite).returning();
    return newFavorite;
  }

  async updateFavorite(id: number, updates: Partial<InsertFavorite>): Promise<Favorite | undefined> {
    const [updatedFavorite] = await db
      .update(favorites)
      .set(updates)
      .where(eq(favorites.id, id))
      .returning();
    return updatedFavorite;
  }

  async deleteFavorite(id: number): Promise<boolean> {
    const [deletedFavorite] = await db
      .delete(favorites)
      .where(eq(favorites.id, id))
      .returning();
    return !!deletedFavorite;
  }

  // Project operations
  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async getProject(id: number): Promise<Project | undefined> {
    const results = await db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        imageUrl: projects.imageUrl,
        technologies: projects.technologies,
        buttons: projects.buttons,
        githubUrl: projects.githubUrl,
        liveUrl: projects.liveUrl,
        sortOrder: projects.sortOrder,
        featured: projects.featured,
        createdAt: projects.createdAt,
        ventureId: projects.ventureId,
        venture: {
          id: ventures.id,
          name: ventures.name,
          color: ventures.color
        }
      })
      .from(projects)
      .leftJoin(ventures, eq(projects.ventureId, ventures.id))
      .where(eq(projects.id, id));
    
    return results.length > 0 ? results[0] : undefined;
  }

  async listProjects(): Promise<Project[]> {
    const result = await db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        imageUrl: projects.imageUrl,
        technologies: projects.technologies,
        buttons: projects.buttons,
        githubUrl: projects.githubUrl,
        liveUrl: projects.liveUrl,
        sortOrder: projects.sortOrder,
        featured: projects.featured,
        createdAt: projects.createdAt,
        ventureId: projects.ventureId,
        venture: {
          id: ventures.id,
          name: ventures.name,
          color: ventures.color
        }
      })
      .from(projects)
      .leftJoin(ventures, eq(projects.ventureId, ventures.id))
      .orderBy(projects.sortOrder);
    return result;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    // Ensure we're working with valid JSON for the buttons array
    const sanitizedUpdates = {
      ...updates,
      buttons: updates.buttons ? updates.buttons : undefined,
    };

    const [updatedProject] = await db
      .update(projects)
      .set(sanitizedUpdates)
      .where(eq(projects.id, id))
      .returning();

    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    const [deletedProject] = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();
    return !!deletedProject;
  }
  async updateProjectImage(id: number, imageUrl: string): Promise<Project> {
    const [updated] = await db
      .update(projects)
      .set({ imageUrl })
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  // Venture methods
  async createVenture(venture: InsertVenture): Promise<Venture> {
    const [newVenture] = await db
      .insert(ventures)
      .values(venture)
      .returning();
    return newVenture;
  }

  async getVenture(id: number): Promise<Venture | undefined> {
    const [venture] = await db
      .select()
      .from(ventures)
      .where(eq(ventures.id, id));
    return venture;
  }

  async listVentures(): Promise<Venture[]> {
    return db
      .select()
      .from(ventures)
      .orderBy(ventures.sortOrder);
  }

  async updateVenture(id: number, updates: Partial<InsertVenture>): Promise<Venture | undefined> {
    const [updated] = await db
      .update(ventures)
      .set(updates)
      .where(eq(ventures.id, id))
      .returning();
    return updated;
  }

  async deleteVenture(id: number): Promise<boolean> {
    const [deletedVenture] = await db
      .delete(ventures)
      .where(eq(ventures.id, id))
      .returning();
    return !!deletedVenture;
  }
}

export const storage = new DatabaseStorage();