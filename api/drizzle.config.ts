import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: '.env' })

export default defineConfig({
    casing: "snake_case",
    out: './src/drizzle',
    schema: './src/db/schemas',
    dialect: 'mysql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
