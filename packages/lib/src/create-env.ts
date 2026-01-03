import { config } from 'dotenv'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Only load .env file if it exists (for local development)
// In Docker, environment variables are provided by docker-compose
const envPath = resolve(__dirname, '../../../', '.env')
console.log('Looking for .env at:', envPath)
console.log('.env exists:', existsSync(envPath))
if (existsSync(envPath)) {
    console.log('Loading .env file from:', envPath)
    config({ path: envPath })
} else {
    console.log('No .env file found, using process.env directly')
}

console.log('Cloudinary env vars at init:', {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'present' : 'missing'
})

export const env = {
    NODE_ENV: process.env.NODE_ENV,
    MYSQL_SSL_MODE: process.env.MYSQL_SSL_MODE,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: Number.parseInt(process.env.MYSQL_PORT!),
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: Number.parseInt(process.env.JWT_EXPIRES_IN ?? '86400'),
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    GATEWAY_PORT: process.env.GATEWAY_PORT,
    HOME_SERVICE_HOST: process.env.HOME_SERVICE_HOST || 'localhost',
    HOME_SERVICE_PORT: process.env.HOME_SERVICE_PORT,
    AUTH_SERVICE_HOST: process.env.AUTH_SERVICE_HOST || 'localhost',
    AUTH_SERVICE_PORT: process.env.AUTH_SERVICE_PORT,
    SONG_SERVICE_HOST: process.env.SONG_SERVICE_HOST || 'localhost',
    SONG_SERVICE_PORT: process.env.SONG_SERVICE_PORT,
    ARTIST_SERVICE_HOST: process.env.ARTIST_SERVICE_HOST || 'localhost',
    ARTIST_SERVICE_PORT: process.env.ARTIST_SERVICE_PORT,
    BANNER_SERVICE_HOST: process.env.BANNER_SERVICE_HOST || 'localhost',
    BANNER_SERVICE_PORT: process.env.BANNER_SERVICE_PORT,
    PLAYLIST_SERVICE_HOST: process.env.PLAYLIST_SERVICE_HOST || 'localhost',
    PLAYLIST_SERVICE_PORT: process.env.PLAYLIST_SERVICE_PORT,
    USER_SERVICE_HOST: process.env.USER_SERVICE_HOST || 'localhost',
    USER_SERVICE_PORT: process.env.USER_SERVICE_PORT,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: Number.parseInt(process.env.REDIS_PORT || '6379'),
    REDIS_MAX_CONNECTION_RETRY: Number.parseInt(process.env.REDIS_MAX_CONNECTION_RETRY || '10'),
    REDIS_MIN_CONNECTION_DELAY_IN_MS: Number.parseInt(process.env.REDIS_MIN_CONNECTION_DELAY_IN_MS || '1000'),
    REDIS_MAX_CONNECTION_DELAY_IN_MS: Number.parseInt(process.env.REDIS_MAX_CONNECTION_DELAY_IN_MS || '30000'),
}