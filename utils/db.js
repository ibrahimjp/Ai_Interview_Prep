import 'dotenv/config'; // Add this at the top
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema.js";

// Debug: Log environment variables
console.log('DB URL:', process.env.DATABASE_URL); 
const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_8gA9MoJiKmRy@ep-blue-river-a5ilo0zt-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require";
const sql = neon(connectionString);
export const db = drizzle(sql, { schema });