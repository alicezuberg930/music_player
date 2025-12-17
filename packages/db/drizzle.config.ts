import { env } from '@yukikaze/lib/create-env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    casing: "snake_case",
    out: './drizzle',
    schema: './src/schemas',
    dialect: 'mysql',
    dbCredentials: {
        host: env.MYSQL_HOST!,
        port: env.MYSQL_PORT,
        user: env.MYSQL_USER!,
        password: env.MYSQL_PASSWORD!,
        database: env.MYSQL_DATABASE!,
    },
});