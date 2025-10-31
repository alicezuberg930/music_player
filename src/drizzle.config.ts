import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({ path: '.env' })

export default defineConfig({
    out: './drizzle',
    schema: './db/schemas',
    dialect: 'mysql',
    dbCredentials: {
        url: "mysql://avnadmin:AVNS_KfaROSf_5YxC3WhSOuW@zingmp3-mysql-music-website-db.h.aivencloud.com:17444/defaultdb",
    },
});
