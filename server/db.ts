
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
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 10000,
      max: 20
    });
    
    // Test the connection
    await pool.connect();
    return pool;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Database connection attempt ${retryCount + 1} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return createPool(retryCount + 1);
    }
    throw error;
  }
};

export const pool = await createPool();
export const db = drizzle({ client: pool, schema });

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  // Attempt to reconnect
  createPool().then(newPool => {
    pool.end();
    Object.assign(pool, newPool);
  }).catch(console.error);
});
