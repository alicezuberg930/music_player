import { infiniteQueryOptions } from '@tanstack/react-query'
import type {
    Response,
    Notification,
    QueryNotification
} from '@/@types'
import { httpClient } from '../repository/http-client'
// import { queryClient } from '@/providers/query-client-provider'

export const keys = {
    all: (opts: QueryNotification) => ['notifications', opts],
    read: (id: string) => ['notifications', id],
} as const

export const notificationQueries = () => ({
    all: {
        queryOptions: (opts: QueryNotification) =>
            infiniteQueryOptions({
                queryKey: keys.all(opts),
                queryFn: async ({ pageParam }) => {
                    const response = await httpClient.get<Response<Notification[]>>('/notifications', { page: pageParam + 1, limit: opts.limit ?? 15 })
                    return response
                },
                initialPageParam: 0,
                getNextPageParam: (lastPage, _allPages, lastPageParam) => {
                    return lastPage.paginate!.totalPages > lastPageParam + 1 ? lastPageParam + 1 : undefined
                }
            }),
    },

    // create: {
    //     mutationOptions: () =>
    //         mutationOptions({
    //             mutationKey: keys.create(),
    //             mutationFn: async (input: FormData) => {
    //                 return await httpClient.post<Response<Video>>(
    //                     '/videos',
    //                     input
    //                 )
    //             },
    //             onSuccess: () => {
    //                 // invalidates all videos
    //                 queryClient().invalidateQueries({ queryKey: keys.all({}) })
    //             },
    //         }),
    // },
})
