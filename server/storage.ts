import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import {
  users,
  blogPosts,
  blogComments,
  pageViews,
  userSessions,
  newsletterSubscriptions,
  type User,
  type InsertUser,
  type BlogPost,
  type InsertBlogPost,
  type BlogComment,
  type InsertBlogComment,
  type NewsletterSubscription,
  type InsertNewsletterSubscription,
  type PageView,
  type UserSession,
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

  // Comments operations
  createBlogComment(comment: InsertBlogComment): Promise<BlogComment>;
  getBlogComments(postId: number): Promise<BlogComment[]>;

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

  // Comments operations
  async createBlogComment(comment: InsertBlogComment): Promise<BlogComment> {
    const [newComment] = await db.insert(blogComments).values(comment).returning();
    return newComment;
  }

  async getBlogComments(postId: number): Promise<BlogComment[]> {
    return db.select().from(blogComments).where(eq(blogComments.postId, postId));
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
}

export const storage = new DatabaseStorage();