import { env } from '@yukikaze/lib/create-env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    casing: "snake_case",
    out: './drizzle',
    schema: './src/schemas',
    dialect: 'mysql',
    dbCredentials: {
        url: env.DATABASE_URL!,
    },
});