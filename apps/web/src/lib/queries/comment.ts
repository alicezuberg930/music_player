import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type { Query, Response } from '@/@types'
import { queryClient } from '../../providers/query-client-provider'
import { httpClient } from '../repository/http-client'
import type { SocialValidators } from '@yukikaze/validator'

export type PublicUser = {
  id: string
  fullname: string
  avatar?: string | null
}

export type Comment = {
  id: string
  userId: string
  content: string
  parentCommentId: string | null
  songId: string
  likes: number | null
  createdAt: string
  updatedAt: string
  user: PublicUser
  replies: Comment[]
}

export const keys = {
  all: (songId: string, opts: Query) => ['comments', songId, opts],
  create: () => ['comments', 'create'],
} as const

export const commentQueries = () => ({
  all: {
    queryOptions: (songId: string, opts: Query = {}) =>
      queryOptions({
        queryKey: keys.all(songId, opts),
        queryFn: async () => {
          const { data } = await httpClient.get<Response<Comment[]>>(
            `/social/comments/${songId}`,
            opts
          )
          return data
        },
        enabled: !!songId,
      }),
  },

  create: {
    mutationOptions: () =>
      mutationOptions({
        mutationKey: keys.create(),
        mutationFn: async (input: SocialValidators.CreateCommentInput) => {
          return await httpClient.post<Response<Comment>>('/social/comments', input)
        },
        onSuccess: () => {
          // invalidates all comments
          queryClient().invalidateQueries({ queryKey: ['comments'] })
        },
      }),
  },
})
