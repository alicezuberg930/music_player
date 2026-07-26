import { createClient, type RedisClientType } from "redis"
import { env } from "@yukikaze/lib/create-env"

//reconnecting to redis incase connection is broken
const reconn_strategy = (retries: number): number | Error => {
    if (retries > Number(env.REDIS_MAX_CONNECTION_RETRY)) {
        console.error("Too many retries to connect to Redis. Connection closed!")
        return new Error("Too many retries! Could not connect to Redis!")
    } else {
        const wait = Math.min(
            Number(env.REDIS_MIN_CONNECTION_DELAY_IN_MS) * Math.pow(2, retries),
            Number(env.REDIS_MAX_CONNECTION_DELAY_IN_MS)
        )
        console.log("waiting", wait, "milliseconds")
        return wait
    }
}

// Then we can create redis client which can interact with redis
const redisClient: RedisClientType = createClient({
    url: env.REDIS_URL,
    socket: {
        reconnectStrategy: reconn_strategy
    }
})

redisClient.connect().then(() => {
    console.log("Connected to Redis!")
}).catch((err) => {
    console.error("Redis Client Error", err)
})

export default redisClient