import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const createPool = async (retryCount = 0): Promise<Pool> => {
  try {
    const pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      max: 1,
      keepAlive: true
    });

    // Test the connection with a simple query
    await pool.query('SELECT 1');
    console.log("Successfully connected to the database.");
    return pool;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (retryCount < MAX_RETRIES) {
      console.error(`Database connection attempt ${retryCount + 1} failed: ${errorMessage}, retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return createPool(retryCount + 1);
    }
    console.error(`Database connection failed after ${MAX_RETRIES} retries: ${errorMessage}`);
    throw new Error(`Failed to connect to the database after multiple retries: ${errorMessage}`);
  }
};

let pool: Pool;
let db: ReturnType<typeof drizzle>;

const initializeDatabase = async () => {
  pool = await createPool();
  db = drizzle({ client: pool, schema });
  return { pool, db };
};

export { pool, db, initializeDatabase };

// Initialize database on startup
initializeDatabase()
  .then(({ pool: dbPool, db: dbInstance }) => {
    console.log('Successfully connected to the database.');
    
    // Handle pool errors with more informative logging
    dbPool.on('error', (err: Error) => {
      console.error('Unexpected database error:', err);
    });

    process.on('SIGINT', () => {
      console.log('\nShutting down gracefully...');
      dbPool.end(() => {
        console.log('Pool has ended');
        process.exit(0);
      });
    });
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });