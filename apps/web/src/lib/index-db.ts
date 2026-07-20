import type { PersistedClient } from '@tanstack/react-query-persist-client'
import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

interface MusicPlayerDBSchema extends DBSchema {
    'audio-files': {
        key: string
        value: {
            songId: string
            blob: Blob
            url: string
            cachedAt: number
        }
    },
    'react-query-store': {
        key: string,
        value: PersistedClient
    }
}

const DB_NAME = 'music-player'
const AUDIO_FILES_STORE = 'audio-files'
const REACT_QUERY_STORE = 'react-query-store'
const idbValidKey = 'tanstack-react-query'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<MusicPlayerDBSchema>> | null = null

const getDB = async () => {
    dbPromise ??= openDB<MusicPlayerDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(AUDIO_FILES_STORE)) db.createObjectStore(AUDIO_FILES_STORE)
            if (!db.objectStoreNames.contains(REACT_QUERY_STORE)) db.createObjectStore(REACT_QUERY_STORE)
        }
    })
    return dbPromise
}

export const persistReactQueryClient = async (client: PersistedClient) => {
    try {
        const db = await getDB()
        // Serialize the client data to JSON string to avoid cloning issues with Promises
        const serialized = JSON.stringify(client)
        await db.put(REACT_QUERY_STORE, JSON.parse(serialized), idbValidKey)
    } catch (error) {
        console.error('Error persisting React Query client:', error)
    }
}

export const restoreReactQueryClient = async (): Promise<PersistedClient | undefined> => {
    try {
        const db = await getDB()
        const client = await db.get(REACT_QUERY_STORE, idbValidKey)
        return client ?? undefined
    } catch (error) {
        console.error('Error restoring React Query client:', error)
        return undefined
    }
}

export const removeReactQueryClient = async () => {
    try {
        const db = await getDB()
        await db.delete(REACT_QUERY_STORE, idbValidKey)
    } catch (error) {
        console.error('Error removing React Query client:', error)
    }
}

/**
 * Save audio file from URL to IndexedDB
 * @param songId - Unique identifier for the song
 * @param audioBlob - Blob of the audio file
 * @returns Promise<void>
 */
export const saveAudioToCache = async (songId: string, audioBlob: Blob): Promise<void> => {
    const db = await getDB()
    await db.put(AUDIO_FILES_STORE, {
        songId,
        blob: audioBlob,
        url: '',
        cachedAt: Date.now()
    }, songId)
}

/**
 * Check if audio file exists in IndexedDB cache
 * @param songId - Unique identifier for the song
 * @returns Promise<boolean> - true if exists
 */
export const isAudioCached = async (songId: string): Promise<boolean> => {
    const db = await getDB()
    const result = await db.get(AUDIO_FILES_STORE, songId)
    return !!result
}

/**
 * Retrieve audio file from IndexedDB cache
 * @param songId - Unique identifier for the song
 * @returns Promise<Blob | null> - Object URL of the cached audio or null if not found
 */
export const getAudioFromCache = async (songId: string): Promise<Blob | null> => {
    const db = await getDB()
    const result = await db.get(AUDIO_FILES_STORE, songId)
    return result?.blob || null
}

/**
 * Delete audio file from IndexedDB cache
 * @param songId - Unique identifier for the song
 * @returns Promise<boolean> - true if deleted successfully
 */
export const deleteAudioFromCache = async (songId: string): Promise<boolean> => {
    try {
        const db = await getDB()
        await db.delete(AUDIO_FILES_STORE, songId)
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
        await db.clear(AUDIO_FILES_STORE)
        console.log('Audio cache cleared successfully')
        return true
    } catch (error) {
        console.error('Error clearing audio cache:', error)
        return false
    }
}
