import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

interface AudioCacheDB extends DBSchema {
    'audio-files': {
        key: string
        value: {
            songId: string
            blob: Blob
            url: string
            cachedAt: number
        }
    },
    'cover-files': {
        key: string
        value: {
            songId: string
            blob: Blob
            url: string
            cachedAt: number
        }
    }
}

const DB_NAME = 'music-player-audio'
const STORE_NAME = 'audio-files'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<AudioCacheDB>> | null = null

const getDB = async () => {
    if (!dbPromise) {
        dbPromise = openDB<AudioCacheDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME)
                }
            },
        })
    }
    return dbPromise
}

/**
 * Save audio file from URL to IndexedDB
 * @param songId - Unique identifier for the song
 * @param url - URL to fetch the audio file from
 * @returns Promise<boolean> - true if saved successfully
 */
export const saveAudioToCache = async (songId: string, url: string): Promise<boolean> => {
    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Failed to fetch audio: ${response.statusText}`)

        const blob = await response.blob()
        const db = await getDB()

        await db.put(STORE_NAME, {
            songId,
            blob,
            url,
            cachedAt: Date.now(),
        }, songId)

        console.log(`Audio cached successfully for song: ${songId}`)
        return true
    } catch (error) {
        console.error(`Error caching audio for song ${songId}:`, error)
        return false
    }
}

/**
 * Check if audio file exists in IndexedDB cache
 * @param songId - Unique identifier for the song
 * @returns Promise<boolean> - true if exists
 */
export const isAudioCached = async (songId: string): Promise<boolean> => {
    try {
        const db = await getDB()
        const data = await db.get(STORE_NAME, songId)
        return !!data
    } catch (error) {
        console.error(`Error checking cache for song ${songId}:`, error)
        return false
    }
}

/**
 * Retrieve audio file from IndexedDB cache
 * @param songId - Unique identifier for the song
 * @returns Promise<string | null> - Object URL of the cached audio or null if not found
 */
export const getAudioFromCache = async (songId: string): Promise<string | null> => {
    try {
        const db = await getDB()
        const data = await db.get(STORE_NAME, songId)

        if (data) {
            // Create an object URL from the blob
            const objectUrl = URL.createObjectURL(data.blob)
            console.log(`Audio retrieved from cache for song: ${songId}`)
            return objectUrl
        }

        return null
    } catch (error) {
        console.error(`Error retrieving audio from cache for song ${songId}:`, error)
        return null
    }
}

/**
 * Delete audio file from IndexedDB cache
 * @param songId - Unique identifier for the song
 * @returns Promise<boolean> - true if deleted successfully
 */
export const deleteAudioFromCache = async (songId: string): Promise<boolean> => {
    try {
        const db = await getDB()
        await db.delete(STORE_NAME, songId)
        console.log(`Audio deleted from cache for song: ${songId}`)
        return true
    } catch (error) {
        console.error(`Error deleting audio from cache for song ${songId}:`, error)
        return false
    }
}

/**
 * Clear all cached audio files
 * @returns Promise<boolean> - true if cleared successfully
 */
export const clearAudioCache = async (): Promise<boolean> => {
    try {
        const db = await getDB()
        await db.clear(STORE_NAME)
        console.log('Audio cache cleared successfully')
        return true
    } catch (error) {
        console.error('Error clearing audio cache:', error)
        return false
    }
}
