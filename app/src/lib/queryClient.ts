import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'
import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client'
import { persistReactQueryClient, removeReactQueryClient, restoreReactQueryClient } from './indexDB'

/**
 * Creates an IndexedDB persister for React Query cache
 * Stores cache in IndexedDB for better performance and larger storage capacity
 */
export function createIDBPersister() {
    return {
        persistClient: async (client: PersistedClient) => {
            await persistReactQueryClient(client)
        },
        restoreClient: async () => {
            return await restoreReactQueryClient()
        },
        removeClient: async () => {
            await removeReactQueryClient()
        },
    } satisfies Persister
}

export const createQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 60 * 1000, // 60 minutes
            gcTime: 1000 * 60 * 60 * 6, // 6 hours (must be >= maxAge for persister)
            retry: 2, // retry 2 times on failure
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false, // Disable refetch on window focus
            refetchOnReconnect: true, // Refetch when internet reconnects
            refetchOnMount: true, // Refetch when component mounts if data is stale
        },
        mutations: {
            retry: 1, // Retry mutations once
            retryDelay: 3000, // Wait 3 seconds before retry
        },
        dehydrate: {
            shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
        },
        hydrate: {},
    },
})

let clientQueryClientSingleton: QueryClient | undefined = undefined

export const getQueryClient = () => {
    // Server: always return a new query client
    if (typeof globalThis === 'undefined') return createQueryClient()
    // Browser: reuse singleton to avoid creating new clients on every request
    clientQueryClientSingleton ??= createQueryClient();
    return clientQueryClientSingleton
}