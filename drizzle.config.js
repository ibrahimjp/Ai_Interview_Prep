import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  schema: './utils/schema.js',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_8gA9MoJiKmRy@ep-blue-river-a5ilo0zt-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
  }
  
});