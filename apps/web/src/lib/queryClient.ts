import { defaultShouldDehydrateQuery, QueryCache, QueryClient } from '@tanstack/react-query'
import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client'
import { persistReactQueryClient, removeReactQueryClient, restoreReactQueryClient } from './indexDB'
import { HttpError } from './repository/http-error'
import { toast } from '@yukikaze/ui'
import { handleServerError } from './utils'

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
            retry: (failureCount, error) => {
                // eslint-disable-next-line no-console
                if (failureCount > 3) return false

                return !(
                    error instanceof HttpError && [401, 403].includes(error.status ?? 0)
                )
            },
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 60 * 1000, // 60 minutes
            gcTime: 1000 * 60 * 60 * 1, // 1 hours (must be >= maxAge for persister)
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false, // Disable refetch on window focus
            refetchOnReconnect: true, // Refetch when internet reconnects
            refetchOnMount: true, // Refetch when component mounts if data is stale
        },
        mutations: {
            onError: (error) => {
                handleServerError(error)

                if (error instanceof HttpError && error.status === 304) {
                    toast.error('Content not modified!')
                }
            },
        },
        dehydrate: {
            shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
        },
        hydrate: {},
    },
    queryCache: new QueryCache({
        onError: (error) => {
            if (error instanceof HttpError) {
                if (error.status === 401) {
                    toast.error('Session expired!')
                    // const redirect = `${router.history.location.href}`
                    // router.navigate({ to: '/sign-in', search: { redirect } })
                }
                if (error.status === 500) {
                    toast.error('Internal Server Error!')
                    // Only navigate to error page in production to avoid disrupting HMR in development
                    // if (import.meta.env.PROD) {
                    //     router.navigate({ to: '/500' })
                    // }
                }
                if (error.status === 403) {
                }
            }
        },
    }),
})


let clientQueryClientSingleton: QueryClient | undefined = undefined

export const getQueryClient = () => {
    // Server: always return a new query client
    if (typeof globalThis === 'undefined') return createQueryClient()
    // Browser: reuse singleton to avoid creating new clients on every request
    clientQueryClientSingleton ??= createQueryClient();
    return clientQueryClientSingleton
}