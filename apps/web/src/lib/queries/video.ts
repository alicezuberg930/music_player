import { infiniteQueryOptions, mutationOptions, queryOptions } from '@tanstack/react-query'
import type {
  Response,
  QueryVideo,
  Video
} from '@/@types'
import { httpClient } from '../repository/http-client'
import { getQueryClient } from '../queryClient'

export const keys = {
  all: (opts: QueryVideo) => ['videos', opts],
  one: (id: string) => ['videos', id],
  create: () => ['videos', 'create'],
  update: () => ['videos', 'update'],
  delete: () => ['videos', 'delete'],
} as const

export const videoQueries = () => ({
  all: {
    queryOptions: (opts: QueryVideo = {}) =>
      infiniteQueryOptions({
        queryKey: keys.all(opts),
        queryFn: async ({ pageParam }) => {
          const response = await httpClient.get<
            Response<Video[]>
          >('/videos', { search: opts?.search ?? '', page: pageParam + 1, limit: 15 })
          return response
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
          return lastPage.paginate!.totalPages > lastPageParam + 1 ? lastPageParam + 1 : undefined
        }
      }),
  },

  one: {
    queryOptions: (id: string) =>
      queryOptions({
        queryKey: keys.one(id),
        queryFn: async () => {
          const { data } = await httpClient.get<Response<Video>>(
            `/videos/${id}`
          )
          return data
        },
        enabled: !!id,
      }),
  },

  create: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.create(),
        mutationFn: async (input: FormData) => {
          return await httpClient.post<Response<Video>>(
            '/videos',
            input
          )
        },
        onSuccess: () => {
          // invalidates all videos
          getQueryClient().invalidateQueries({ queryKey: keys.all({}) })
        },
      }),
  },

  // update: {
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
