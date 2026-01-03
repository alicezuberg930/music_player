import { createClient, type RedisClientType } from "redis"
import { env } from "@yukikaze/lib/create-env"

//reconnecting to redis incase connection is broken
const reconn_strategy = (retries: number): number | Error => {
    if (retries > env.REDIS_MAX_CONNECTION_RETRY) {
        console.error("Too many retries to connect to Redis. Connection closed!")
        return new Error("Too many retries! Could not connect to Redis!")
    } else {
        const wait = Math.min(
            env.REDIS_MIN_CONNECTION_DELAY_IN_MS * Math.pow(2, retries),
            env.REDIS_MAX_CONNECTION_DELAY_IN_MS
        )
        console.log("waiting", wait, "milliseconds")
        return wait
    }
}

//Then we can create redis client which can interact with redis
const redisClient: RedisClientType = env.REDIS_URL || process.env.NODE_ENV === "production"
    ? createClient({ url: env.REDIS_URL })
    : createClient({
        socket: {
            host: env.REDIS_HOST,
            port: env.REDIS_PORT,
            reconnectStrategy: reconn_strategy
        }
    })

redisClient.on("connect", () => {
    console.log("Connected to Redis!")
})

redisClient.on("error", (err) => {
    console.error("Redis Client Error", err)
})

// Connect to Redis
redisClient.connect().catch(console.error)

export default redisClient