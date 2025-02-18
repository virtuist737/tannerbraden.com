import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import {
  users,
  blogPosts,
  pageViews,
  userSessions,
  newsletterSubscriptions,
  timeline as timelineTable,
  interests,
  favorites,
  projects,
  type User,
  type InsertUser,
  type BlogPost,
  type InsertBlogPost,
  type NewsletterSubscription,
  type InsertNewsletterSubscription,
  type PageView,
  type UserSession,
  type Timeline,
  type Interest,
  type Favorite,
  type InsertTimeline,
  type InsertInterest,
  type InsertFavorite,
  type Project,
  type InsertProject,
} from "@shared/schema";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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

  // Analytics operations
  recordPageView(path: string, userAgent?: string, referrer?: string): Promise<PageView>;
  updatePageView(id: number, updates: Partial<PageView>): Promise<PageView | undefined>;
  getPageViews(startDate: Date, endDate: Date): Promise<PageView[]>;

  // Session operations
  createUserSession(sessionId: string, userId?: number): Promise<UserSession>;
  updateUserSession(sessionId: string, endTime: Date): Promise<void>;

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

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
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

  // Analytics operations
  async recordPageView(
    path: string,
    userAgent?: string,
    referrer?: string
  ): Promise<PageView> {
    const [pageView] = await db
      .insert(pageViews)
      .values({ path, userAgent, referrer })
      .returning();
    return pageView;
  }

  async updatePageView(id: number, updates: Partial<PageView>): Promise<PageView | undefined> {
    const [updatedView] = await db
      .update(pageViews)
      .set(updates)
      .where(eq(pageViews.id, id))
      .returning();
    return updatedView;
  }

  async getPageViews(startDate: Date, endDate: Date): Promise<PageView[]> {
    return db
      .select()
      .from(pageViews)
      .where(sql`${pageViews.timestamp} BETWEEN ${startDate} AND ${endDate}`);
  }

  // Session operations
  async createUserSession(sessionId: string, userId?: number): Promise<UserSession> {
    const [session] = await db
      .insert(userSessions)
      .values({ sessionId, userId })
      .returning();
    return session;
  }

  async updateUserSession(sessionId: string, endTime: Date): Promise<void> {
    await db
      .update(userSessions)
      .set({ endTime })
      .where(eq(userSessions.sessionId, sessionId));
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
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async listProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(projects.sortOrder);
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set(updates)
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
}

export const storage = new DatabaseStorage();