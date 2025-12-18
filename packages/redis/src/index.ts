import redisClient from "./redisClient"

/**
 * Cache wrapper for database queries
 * @param key - Redis cache key
 * @param ttl - Time to live in seconds
 * @param fn - Database query function
 */
export async function cached<T>(
    key: string,
    ttl: number,
    fn: () => Promise<T>
): Promise<T> {
    try {
        const cached = await redisClient.get(key) as string
        if (cached) {
            console.log(`Cache hit: ${key}`)
            return JSON.parse(cached) as T
        }
        console.log(`Cache miss: ${key}`)
        const result = await fn()
        // Store in cache
        await redisClient.setEx(key, ttl, JSON.stringify(result))
        return result
    } catch (error) {
        console.error('Cache error:', error)
        // If Redis fails, fall back to direct query
        return fn()
    }
}

/**
 * Invalidate cache by key or pattern
 */
export async function invalidateCache(pattern: string): Promise<void> {
    try {
        const keys = await redisClient.keys(pattern)
        if (keys.length > 0) {
            await redisClient.del(keys)
            console.log(`Invalidated ${keys.length} cache keys matching: ${pattern}`)
        }
    } catch (error) {
        console.error('Cache invalidation error:', error)
    }
}

export async function clearCache(): Promise<void> {
    try {
        await redisClient.flushDb()
        console.log('All cache cleared')
    } catch (error) {
        console.error('Cache clear error:', error)
    }
}