import { mutationOptions, queryOptions } from '@tanstack/react-query'
import type {
    Artist,
    HomeData,
    Playlist,
    PlaylistType,
    Response,
    Song,
    SongType,
    User
} from '@/@types'
import { httpClient } from '../repository/http-client'
import { getQueryClient } from '../queryClient'
import { keys as homeKeys } from './home'
import type { AuthValidators } from '@yukikaze/validator'

export const keys = {
    profile: () => ['user', 'profile'],
    one: (id: string) => ['artists', id],
    create: () => ['artists', 'create'],
    update: () => ['artists', 'update'],
    delete: () => ['artists', 'delete'],
    artist: () => ['user', 'artist'],
    song: (type: SongType) => ['user', 'songs', type],
    playlist: (type: PlaylistType) => ['user', 'playlists', type],
    verify: () => ['user', 'verify'],
    favoriteSong: () => ['user', 'favorite', 'song'],
    favoritePlaylist: () => ['user', 'favorite', 'playlist'],
    followArtist: () => ['user', 'follow', 'artist'],
    refreshToken: () => ['user', 'refresh', 'token'],
    signIn: () => ['user', 'signIn'],
    signUp: () => ['user', 'signUp'],
    signOut: () => ['user', 'signOut'],
} as const

export const userQueries = () => ({
    profile: {
        queryOptions: () =>
            queryOptions({
                queryKey: keys.profile(),
                queryFn: async () => {
                    const { data } = await httpClient.get<
                        Response<User>
                    >('/users/me/profile')
                    return data
                },
            }),
    },

    song: {
        queryOptions: (type: SongType) =>
            queryOptions({
                queryKey: keys.song(type),
                queryFn: async () => {
                    const { data } = await httpClient.get<Response<Song[]>>(
                        `/users/song/list`, { type }
                    )
                    return data
                },
            }),
    },

    playlist: {
        queryOptions: (type: PlaylistType) =>
            queryOptions({
                queryKey: keys.playlist(type),
                queryFn: async () => {
                    const { data } = await httpClient.get<Response<Playlist[]>>(
                        `/users/playlist/list`, { type }
                    )
                    return data
                },
            }),
    },

    artist: {
        queryOptions: () =>
            queryOptions({
                queryKey: keys.artist(),
                queryFn: async () => {
                    const { data } = await httpClient.get<Response<Artist[]>>(
                        `/users/artist/list`
                    )
                    return data
                },
            }),
    },

    verify: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.verify(),
                mutationFn: async ({ userId, token }: { userId: string, token: string }) => {
                    return await httpClient.put<Response>(
                        `/users/verify-email/${userId}`,
                        { token }
                    )
                },
                onSuccess: () => {
                    getQueryClient().invalidateQueries({ queryKey: keys.profile() })
                },
            }),
    },

    refreshToken: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.refreshToken(),
                mutationFn: async () => {
                    return await httpClient.post<Response<{ accessToken: string }>>(
                        `/auth/refresh`,
                    )
                },
            }),
    },

    signIn: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.signIn(),
                mutationFn: async (input: AuthValidators.SignInInput) => {
                    return await httpClient.post<Response<{ user: User, accessToken: string }>>(`/auth/sign-in`, input)
                },
            }),
    },

    signUp: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.signUp(),
                mutationFn: async (input: AuthValidators.SignUpInput) => {
                    return await httpClient.post<Response>(`/auth/sign-up`, input)
                },
            }),
    },

    signOut: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.signOut(),
                mutationFn: async () => {
                    return await httpClient.post<Response>(`/auth/sign-out`)
                },
            }),
    },

    favoriteSong: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.favoriteSong(),
                mutationFn: async (id: string) => {
                    return await httpClient.put<Response>(`/users/favorite/song/${id}`)
                },
                onMutate: async (id: string) => {
                    // Cancel ongoing queries to prevent overwriting optimistic update
                    await getQueryClient().cancelQueries({ queryKey: homeKeys.all() })
                    await getQueryClient().cancelQueries({ queryKey: keys.song('favorite') })
                    await getQueryClient().cancelQueries({ queryKey: keys.song('uploaded') })

                    // Snapshot previous data
                    const previousHome = getQueryClient().getQueryData(homeKeys.all())
                    const previousFavorite = getQueryClient().getQueryData(keys.song('favorite'))
                    const previousUploaded = getQueryClient().getQueryData(keys.song('uploaded'))

                    // Optimistic update for home data
                    if (previousHome) {
                        getQueryClient().setQueryData<Response<HomeData>>(homeKeys.all(), (old) => {
                            if (!old?.data) return old
                            return {
                                ...old,
                                data: {
                                    ...old.data,
                                    newReleases: old.data.newReleaseSongs?.map((song: Song) =>
                                        song.id === id ? { ...song, liked: !song.liked } : song
                                    ),
                                }
                            }
                        })
                    }

                    // Optimistic update for favorite songs list
                    if (previousFavorite) {
                        getQueryClient().setQueryData<Response<Song[]>>(keys.song('favorite'), (old) => {
                            if (!old?.data) return old
                            return {
                                ...old,
                                data: old.data.map((song: Song) =>
                                    song.id === id ? { ...song, liked: !song.liked } : song
                                )
                            }
                        })
                    }

                    if (previousUploaded) {
                        getQueryClient().setQueryData<Response<Song[]>>(keys.song('uploaded'), (old) => {
                            if (!old?.data) return old
                            return {
                                ...old,
                                data: old.data.map((song: Song) =>
                                    song.id === id ? { ...song, liked: !song.liked } : song
                                )
                            }
                        })
                    }

                    return { previousHome, previousFavorite, previousUploaded }
                },
                onSuccess: () => {
                    // getQueryClient().invalidateQueries({ queryKey: keys.song('favorite') })
                    // getQueryClient().invalidateQueries({ queryKey: keys.song('uploaded') })
                    // getQueryClient().invalidateQueries({ queryKey: homeKeys.all() })
                },
                onError: (_err, _id, context) => {
                    // Revert to previous data on error
                    if (context?.previousHome) {
                        getQueryClient().setQueryData(homeKeys.all(), context.previousHome)
                    }
                    if (context?.previousFavorite) {
                        getQueryClient().setQueryData(keys.song('favorite'), context.previousFavorite)
                    }
                    if (context?.previousUploaded) {
                        getQueryClient().setQueryData(keys.song('favorite'), context.previousUploaded)
                    }
                },
            }),
    },

    favoritePlaylist: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.favoritePlaylist(),
                mutationFn: async (id: string) => {
                    return await httpClient.put<Response>(`/users/favorite/playlist/${id}`)
                },
                onMutate: async (id: string) => {
                    // Cancel ongoing queries to prevent overwriting optimistic update
                    await getQueryClient().cancelQueries({ queryKey: homeKeys.all() })
                    await getQueryClient().cancelQueries({ queryKey: keys.playlist('favorite') })
                    await getQueryClient().cancelQueries({ queryKey: keys.playlist('created') })

                    // Snapshot previous data
                    const previousHome = getQueryClient().getQueryData(homeKeys.all())
                    const previousFavorite = getQueryClient().getQueryData(keys.playlist('favorite'))
                    const previousCreated = getQueryClient().getQueryData(keys.playlist('created'))

                    // Optimistic update for home data
                    if (previousHome) {
                        getQueryClient().setQueryData<Response<HomeData>>(homeKeys.all(), (old) => {
                            if (!old?.data) return old
                            return {
                                ...old,
                                data: {
                                    ...old.data,
                                    newReleases: old.data.newPlaylists?.map((playlist: Playlist) =>
                                        playlist.id === id ? { ...playlist, liked: !playlist.liked } : playlist
                                    ),
                                }
                            }
                        })
                    }

                    // Optimistic update for favorite songs list
                    if (previousFavorite) {
                        getQueryClient().setQueryData<Response<Playlist[]>>(keys.playlist('favorite'), (old) => {
                            if (!old?.data) return old
                            return {
                                ...old,
                                data: old.data.map((playlist: Playlist) =>
                                    playlist.id === id ? { ...playlist, liked: !playlist.liked } : playlist
                                )
                            }
                        })
                    }

                    if (previousCreated) {
                        getQueryClient().setQueryData<Response<Playlist[]>>(keys.playlist('favorite'), (old) => {
                            if (!old?.data) return old
                            return {
                                ...old,
                                data: old.data.map((playlist: Playlist) =>
                                    playlist.id === id ? { ...playlist, liked: !playlist.liked } : playlist
                                )
                            }
                        })
                    }

                    return { previousHome, previousFavorite, previousCreated }
                },
                onSuccess: () => {
                    // getQueryClient().invalidateQueries({ queryKey: keys.song('favorite') })
                    // getQueryClient().invalidateQueries({ queryKey: keys.song('uploaded') })
                    // getQueryClient().invalidateQueries({ queryKey: homeKeys.all() })
                },
                onError: (_err, _id, context) => {
                    // Revert to previous data on error
                    if (context?.previousHome) {
                        getQueryClient().setQueryData(homeKeys.all(), context.previousHome)
                    }
                    if (context?.previousFavorite) {
                        getQueryClient().setQueryData(keys.playlist('favorite'), context.previousFavorite)
                    }
                    if (context?.previousCreated) {
                        getQueryClient().setQueryData(keys.playlist('created'), context.previousCreated)
                    }
                },
            }),
    },

    followArtist: {
        mutationOptions: () =>
            mutationOptions({
                mutationKey: keys.update(),
                mutationFn: async (id: string) => {
                    return await httpClient.put<Response>(
                        `/users/follow/artist/${id}`
                    )
                },
                onSuccess: () => {
                    getQueryClient().invalidateQueries({ queryKey: homeKeys.all() })
                },
            }),
    }
})