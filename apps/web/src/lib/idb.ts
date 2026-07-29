import type { PersistedClient } from '@tanstack/react-query-persist-client'
import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

interface MusicPlayerDBSchema extends DBSchema {
    'react-query-store': {
        key: string,
        value: PersistedClient
    }
}

const DB_NAME = 'music-player'
const REACT_QUERY_STORE = 'react-query-store'
const IDB_VALID_KEY = 'tanstack-react-query'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<MusicPlayerDBSchema>> | null = null

const getDB = async (): Promise<IDBPDatabase<MusicPlayerDBSchema>> => {
    dbPromise ??= openDB<MusicPlayerDBSchema>(DB_NAME, DB_VERSION, {
        upgrade(db) {
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
        await db.put(REACT_QUERY_STORE, JSON.parse(serialized), IDB_VALID_KEY)
    } catch (error) {
        console.error('Error persisting React Query client:', error)
    }
}

export const restoreReactQueryClient = async (): Promise<PersistedClient | undefined> => {
    try {
        const db = await getDB()
        const client = await db.get(REACT_QUERY_STORE, IDB_VALID_KEY)
        return client ?? undefined
    } catch (error) {
        console.error('Error restoring React Query client:', error)
        return undefined
    }
}

export const removeReactQueryClient = async () => {
    try {
        const db = await getDB()
        await db.delete(REACT_QUERY_STORE, IDB_VALID_KEY)
    } catch (error) {
        console.error('Error removing React Query client:', error)
    }
}
