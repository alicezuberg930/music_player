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

export const env = {
    // mixed configs
    ALLOW_CORS_WITHOUT_ORIGIN: process.env.ALLOW_CORS_WITHOUT_ORIGIN,
    NODE_ENV: process.env.NODE_ENV,
    // database configs
    MYSQL_SSL_MODE: process.env.MYSQL_SSL_MODE,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: Number.parseInt(process.env.MYSQL_PORT!),
    // cloudinary storage configs
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    // oauth 2 configs
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    FACEBOOK_REDIRECT_URI: process.env.FACEBOOK_REDIRECT_URI,
    // local authentication configs
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: Number.parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN ?? '86400'),
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_IN: Number.parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN ?? '2592000'),
    // email
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    // host & port configs
    GATEWAY_PORT: process.env.GATEWAY_PORT,
    HOME_SERVICE_HOST: process.env.HOME_SERVICE_HOST || 'localhost',
    HOME_SERVICE_PORT: process.env.HOME_SERVICE_PORT,
    NOTIFICATION_SERVICE_HOST: process.env.NOTIFICATION_SERVICE_HOST || 'localhost',
    NOTIFICATION_SERVICE_PORT: process.env.NOTIFICATION_SERVICE_PORT,
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
    GENRE_SERVICE_HOST: process.env.GENRE_SERVICE_HOST || 'localhost',
    GENRE_SERVICE_PORT: process.env.GENRE_SERVICE_PORT,
    VIDEO_SERVICE_HOST: process.env.VIDEO_SERVICE_HOST || 'localhost',
    VIDEO_SERVICE_PORT: process.env.VIDEO_SERVICE_PORT,
    SOCIAL_SERVICE_HOST: process.env.SOCIAL_SERVICE_HOST || 'localhost',
    SOCIAL_SERVICE_PORT: process.env.SOCIAL_SERVICE_PORT,
    // kafka congis
    KAFKA_BROKERS: process.env.KAFKA_BROKERS,
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
    KAFKA_COMMENT_REPLY_TOPIC: process.env.KAFKA_COMMENT_REPLY_TOPIC,
    KAFKA_COMMENT_REPLY_GROUP_ID: process.env.KAFKA_COMMENT_REPLY_GROUP_ID,
    KAFKA_CHAT_EVENTS_TOPIC: process.env.KAFKA_CHAT_EVENTS_TOPIC,
    KAFKA_CHAT_EVENTS_GROUP_ID: process.env.KAFKA_CHAT_EVENTS_GROUP_ID,
    // redis config
    REDIS_URL: process.env.REDIS_URL,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_MAX_CONNECTION_RETRY: process.env.REDIS_MAX_CONNECTION_RETRY,
    REDIS_MIN_CONNECTION_DELAY_IN_MS: process.env.REDIS_MIN_CONNECTION_DELAY_IN_MS,
    REDIS_MAX_CONNECTION_DELAY_IN_MS: process.env.REDIS_MAX_CONNECTION_DELAY_IN_MS,
    // cors configs
    // change to ALLOWED_ORIGINS in the future
    NOTIFICATION_SERVICE_SOCKET_ORIGINS: process.env.NOTIFICATION_SERVICE_SOCKET_ORIGINS,
    // push API configs
    WEB_PUSH_SUBJECT: process.env.WEB_PUSH_SUBJECT,
    WEB_PUSH_PUBLIC_KEY: process.env.WEB_PUSH_PUBLIC_KEY,
    WEB_PUSH_PRIVATE_KEY: process.env.WEB_PUSH_PRIVATE_KEY,

}
