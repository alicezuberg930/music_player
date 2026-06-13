import { queryOptions } from '@tanstack/react-query'
import type {
    Response,
    Banner
} from '@/@types'
import { httpClient } from '../repository/http-client'

export const keys = {
    all: () => ['banners'],
    create: () => ['banners', 'create'],
    update: () => ['banners', 'update'],
    delete: () => ['banners', 'delete'],
} as const

export const banner = () => ({
    all: {
        queryOptions: () =>
            queryOptions({
                queryKey: keys.all(),
                queryFn: async () => {
                    const { data } = await httpClient.get<
                        Response<Banner[]>
                    >('/banners')
                    return data
                },
            }),
    },

    // create: {
    //     mutationOptions: () =>
    //         mutationOptions({
    //             mutationKey: keys.create(),
    //             mutationFn: async (input: PlaylistValidators.AddSongsInput) => {
    //                 return await httpClient.post<Response<Playlist>>(
    //                     '/playlists',
    //                     input
    //                 )
    //             },
    //             onSuccess: () => {
    //                 // invalidates all playlists
    //                 getQueryClient().invalidateQueries({ queryKey: keys.all({}) })
    //                 // invalidates my playlists
    //                 getQueryClient().invalidateQueries({ queryKey: userKeys.playlist('created') })
    //             },
    //         }),
    // },

    // update: {
    //   mutationKey: keys.update,
    //   mutationOptions: () =>
    //     mutationOptions({
    //       mutationKey: keys.update(),
    //       mutationFn: async ({
    //         id,
    //         ...input
    //       }: TemplateValidators.TemplateForm) => {
    //         return await httpClient.put<ApiResponse<Template[]>>(
    //           `/templates/${id}`,
    //           input
    //         )
    //       },
    //       onSuccess: () => {
    //         getQueryClient().invalidateQueries({ queryKey: keys.all({}) })
    //       },
    //     }),
    // },

    // delete: {
    //   mutationKey: keys.delete,
    //   mutationOptions: () =>
    //     mutationOptions({
    //       mutationKey: keys.delete(),
    //       mutationFn: async (id: string) => {
    //         return await httpClient.delete<ApiResponse<Template[]>>(
    //           `/templates/${id}`
    //         )
    //       },
    //       onSuccess: () => {
    //         getQueryClient().invalidateQueries({ queryKey: keys.all({}) })
    //       },
    //     }),
    // },
})
