import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'

export const createQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 60 * 1000, // 60 minutes
            gcTime: 5 * 60 * 1000, // 5 minutes (cache lifetime)
            retry: 2, // Retry failed requests twice
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
            refetchOnWindowFocus: false, // Disable refetch on window focus
            refetchOnReconnect: true, // Refetch when internet reconnects
            refetchOnMount: true, // Refetch when component mounts if data is stale
        },
        mutations: {
            retry: 1, // Retry mutations once
            retryDelay: 1000, // Wait 1 second before retry
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