import { useMutation, useQuery, useQueryClient, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query'
import type { Response } from '@/@types/response'
import type { Song } from '@/@types/song'
import type { Video } from '@/@types/video'
import type { Artist } from '@/@types/artist'
import type { Playlist } from '@/@types/playlist'
import type { User } from '@/@types/user'
import * as api from '@/lib/httpClient'
import { useLocales } from '@/lib/locales'
import { useSnackbar } from 'notistack'

export const useApi = () => {
    const queryClient = useQueryClient()
    const { translate } = useLocales()
    const { enqueueSnackbar } = useSnackbar()

    // Query Keys
    const queryKeys = {
        songs: ['songs'] as const,
        song: (id: string) => ['songs', id] as const,
        video: (id: string) => ['videos', id] as const,
        artists: ['artists'] as const,
        artist: (id: string) => ['artists', id] as const,
        playlists: ['playlists'] as const,
        playlist: (id: string) => ['playlists', id] as const,
        profile: ['profile'] as const,
        userSongs: ['user', 'songs'] as const,
        userPlaylists: ['user', 'playlists'] as const,
        userArtists: ['user', 'artists'] as const,
    }

    // Query Hooks 
    const useSongList = (options?: UseQueryOptions<Response<Song[]>>) => {
        return useQuery({
            queryKey: queryKeys.songs,
            queryFn: api.fetchSongList,
            ...options,
        })
    }

    const useSong = (songId: string, options?: UseQueryOptions<Response<Song>>) => {
        return useQuery({
            queryKey: queryKeys.song(songId),
            queryFn: () => api.fetchSong(songId),
            enabled: !!songId,
            ...options,
        })
    }

    const useVideo = (videoId: string, options?: UseQueryOptions<Response<Video>>) => {
        return useQuery({
            queryKey: queryKeys.video(videoId),
            queryFn: () => api.fetchVideo(videoId),
            enabled: !!videoId,
            ...options,
        })
    }

    const useArtistList = (options?: UseQueryOptions<Response<Artist[]>>) => {
        return useQuery({
            queryKey: queryKeys.artists,
            queryFn: api.fetchArtistList,
            ...options,
        })
    }

    const useArtist = (artistId: string, options?: UseQueryOptions<Response<Artist>>) => {
        return useQuery({
            queryKey: queryKeys.artist(artistId),
            queryFn: () => api.fetchArtist(artistId),
            enabled: !!artistId,
            ...options,
        })
    }

    const usePlaylistList = (options?: UseQueryOptions<Response<Playlist[]>>) => {
        return useQuery({
            queryKey: queryKeys.playlists,
            queryFn: api.fetchPlaylistList,
            ...options,
        })
    }

    const usePlaylist = (playlistId: string, options?: UseQueryOptions<Response<Playlist>>) => {
        return useQuery({
            queryKey: queryKeys.playlist(playlistId),
            queryFn: () => api.fetchPlaylist(playlistId),
            enabled: !!playlistId,
            ...options,
        })
    }

    const useProfile = (options?: UseQueryOptions<Response<User>>) => {
        return useQuery({
            queryKey: queryKeys.profile,
            queryFn: api.fetchProfile,
            ...options,
        })
    }

    const useUserSongList = (options?: UseQueryOptions<Response<Song[]>>) => {
        return useQuery({
            queryKey: queryKeys.userSongs,
            queryFn: api.fetchUserSongList,
            ...options,
        })
    }

    const useUserPlaylistList = (options?: UseQueryOptions<Response<Playlist[]>>) => {
        return useQuery({
            queryKey: queryKeys.userPlaylists,
            queryFn: api.fetchUserPlaylistList,
            ...options,
        })
    }

    const useUserArtistList = (options?: UseQueryOptions<Response<Artist[]>>) => {
        return useQuery({
            queryKey: queryKeys.userArtists,
            queryFn: api.fetchUserArtistList,
            ...options,
        })
    }

    // Mutation Hooks
    const useCreateSong = (options?: UseMutationOptions<Response, Error, FormData>) => {
        return useMutation({
            mutationFn: api.createSong,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.songs })
                queryClient.invalidateQueries({ queryKey: queryKeys.userSongs })
            },
            ...options,
        })
    }

    const useCreateArtist = (options?: UseMutationOptions<Response, Error, FormData>) => {
        return useMutation({
            mutationFn: api.createArtist,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.artists })
                queryClient.invalidateQueries({ queryKey: queryKeys.userArtists })
            },
            ...options,
        })
    }

    const useCreatePlaylist = (options?: UseMutationOptions<Response, Error, FormData>) => {
        return useMutation({
            mutationFn: api.createPlaylist,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.playlists })
                queryClient.invalidateQueries({ queryKey: queryKeys.userPlaylists })
            },
            ...options,
        })
    }

    const useUpdatePlaylist = (options?: UseMutationOptions<Response, Error, { id: string; formData: FormData }>) => {
        return useMutation({
            mutationFn: ({ id, formData }) => api.updatePlaylist(id, formData),
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({ queryKey: queryKeys.playlist(variables.id) })
                queryClient.invalidateQueries({ queryKey: queryKeys.playlists })
                queryClient.invalidateQueries({ queryKey: queryKeys.userPlaylists })
            },
            ...options,
        })
    }

    const useAddSongsToPlaylist = (options?: UseMutationOptions<Response, Error, { playlistId: string; songIds: string[] }>) => {
        return useMutation({
            mutationFn: ({ playlistId, songIds }) => api.addSongsToPlaylist(playlistId, songIds),
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({ queryKey: queryKeys.playlist(variables.playlistId) })
                queryClient.invalidateQueries({ queryKey: queryKeys.playlists })
            },
            ...options,
        })
    }

    const useRemoveSongsFromPlaylist = (options?: UseMutationOptions<Response, Error, { playlistId: string; songIds: string[] }>) => {
        return useMutation({
            mutationFn: ({ playlistId, songIds }) => api.removeSongsFromPlaylist(playlistId, songIds),
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries({ queryKey: queryKeys.playlist(variables.playlistId) })
                queryClient.invalidateQueries({ queryKey: queryKeys.playlists })
            },
            ...options,
        })
    }

    const useVerifyEmail = (options?: UseMutationOptions<Response, Error, { userId: string; token: string }>) => {
        return useMutation({
            mutationFn: ({ userId, token }) => api.verifyEmail(userId, token),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: queryKeys.profile })
            },
            ...options,
        })
    }

    const useAddFavoriteSong = (options?: UseMutationOptions<Response, Error, string>) => {
        return useMutation({
            mutationFn: (songId: string) => api.addFavoriteSong(songId),
            onMutate: async (songId) => {
                // Cancel outgoing refetches
                await queryClient.cancelQueries({ queryKey: queryKeys.songs })
                await queryClient.cancelQueries({ queryKey: queryKeys.userSongs })
                // Optimistically update song list
                queryClient.setQueryData<Response<Song[]>>(queryKeys.songs, (old) => {
                    if (!old?.data) return old
                    return {
                        ...old,
                        data: old.data.map(song => song.id === songId ? { ...song, liked: true } : song)
                    }
                })
                // Optimistically add to user songs
                queryClient.setQueryData<Response<Song[]>>(queryKeys.userSongs, (old) => {
                    if (!old?.data) return old
                    const songExists = old.data.some(song => song.id === songId)
                    if (songExists) {
                        return {
                            ...old,
                            data: old.data.map(song => song.id === songId ? { ...song, liked: true } : song)
                        }
                    }
                    // If song not in user songs, we need to fetch it from the songs cache
                    const allSongs = queryClient.getQueryData<Response<Song[]>>(queryKeys.songs)
                    const songToAdd = allSongs?.data?.find(s => s.id === songId)
                    if (songToAdd) {
                        return {
                            ...old,
                            data: [{ ...songToAdd, liked: true }, ...old.data]
                        }
                    }
                    return old
                })
            },
            onSuccess: (response) => {
                enqueueSnackbar(translate(response.message), { variant: 'success' })
            },
            onError: (error) => {
                // Revert optimistic update on error
                queryClient.invalidateQueries({ queryKey: queryKeys.songs })
                queryClient.invalidateQueries({ queryKey: queryKeys.userSongs })
                enqueueSnackbar(translate(error.message ?? 'unknown_error'), { variant: 'error' })
            },
            ...options,
        })
    }

    const useRemoveFavoriteSong = (options?: UseMutationOptions<Response, Error, string>) => {
        return useMutation({
            mutationFn: (songId: string) => api.removeFavoriteSong(songId),
            onMutate: async (songId) => {
                // Cancel outgoing refetches
                await queryClient.cancelQueries({ queryKey: queryKeys.songs })
                await queryClient.cancelQueries({ queryKey: queryKeys.userSongs })
                // Optimistically update song list
                queryClient.setQueryData<Response<Song[]>>(queryKeys.songs, (old) => {
                    if (!old?.data) return old
                    return {
                        ...old,
                        data: old.data.map(song => song.id === songId ? { ...song, liked: false } : song)
                    }
                })
                // Optimistically remove from user songs
                queryClient.setQueryData<Response<Song[]>>(queryKeys.userSongs, (old) => {
                    if (!old?.data) return old
                    return {
                        ...old,
                        data: old.data.filter(song => song.id !== songId)
                    }
                })
            },
            onSuccess: (response) => {
                enqueueSnackbar(translate(response.message), { variant: 'success' })
            },
            onError: (error) => {
                // Revert optimistic update on error
                queryClient.invalidateQueries({ queryKey: queryKeys.songs })
                queryClient.invalidateQueries({ queryKey: queryKeys.userSongs })
                enqueueSnackbar(translate(error.message ?? 'unknown_error'), { variant: 'error' })
            },
            ...options,
        })
    }

    const useAddFavoritePlaylist = (options?: UseMutationOptions<Response, Error, string>) => {
        return useMutation({
            mutationFn: (playlistId: string) => api.addFavoritePlaylist(playlistId),
            onMutate: async (playlistId) => {
                // Cancel outgoing refetches
                await queryClient.cancelQueries({ queryKey: queryKeys.playlists })
                await queryClient.cancelQueries({ queryKey: queryKeys.userPlaylists })
                // Optimistically update playlist list
                queryClient.setQueryData<Response<Playlist[]>>(queryKeys.playlists, (old) => {
                    if (!old?.data) return old
                    return {
                        ...old,
                        data: old.data.map(playlist =>
                            playlist.id === playlistId ? { ...playlist, liked: true } : playlist
                        )
                    }
                })
                // Optimistically update individual playlist
                queryClient.setQueryData<Response<Playlist>>(queryKeys.playlist(playlistId), (old) => {
                    if (!old?.data) return old
                    return {
                        ...old,
                        data: { ...old.data, liked: true }
                    }
                })
                // Optimistically add to user playlists
                queryClient.setQueryData<Response<Playlist[]>>(queryKeys.userPlaylists, (old) => {
                    if (!old?.data) return old
                    const playlistExists = old.data.some(playlist => playlist.id === playlistId)
                    if (playlistExists) {
                        return {
                            ...old,
                            data: old.data.map(playlist =>
                                playlist.id === playlistId ? { ...playlist, liked: true } : playlist
                            )
                        }
                    }
                    // If playlist not in user playlists, fetch it from the playlists cache
                    const allPlaylists = queryClient.getQueryData<Response<Playlist[]>>(queryKeys.playlists)
                    const playlistToAdd = allPlaylists?.data?.find(p => p.id === playlistId)
                    if (playlistToAdd) {
                        return {
                            ...old,
                            data: [{ ...playlistToAdd, liked: true }, ...old.data]
                        }
                    }
                    return old
                })
            },
            onSuccess: (response) => {
                enqueueSnackbar(translate(response.message), { variant: 'success' })
            },
            onError: (error, playlistId) => {
                // Revert optimistic update on error
                queryClient.invalidateQueries({ queryKey: queryKeys.playlists })
                queryClient.invalidateQueries({ queryKey: queryKeys.playlist(playlistId) })
                queryClient.invalidateQueries({ queryKey: queryKeys.userPlaylists })
                enqueueSnackbar(translate(error.message ?? 'unknown_error'), { variant: 'error' })
            },
            ...options,
        })
    }

    const useRemoveFavoritePlaylist = (options?: UseMutationOptions<Response, Error, string>) => {
        return useMutation({
            mutationFn: (playlistId: string) => api.removeFavoritePlaylist(playlistId),
            onMutate: async (playlistId) => {
                // Cancel outgoing refetches
                await queryClient.cancelQueries({ queryKey: queryKeys.playlists })
                await queryClient.cancelQueries({ queryKey: queryKeys.userPlaylists })
                // Optimistically update playlist list
                queryClient.setQueryData<Response<Playlist[]>>(queryKeys.playlists, (old) => {
                    if (!old?.data) return old
                    return {
                        ...old,
                        data: old.data.map(playlist =>
                            playlist.id === playlistId ? { ...playlist, liked: false } : playlist
                        )
                    }
                })
                // Optimistically update individual playlist
                queryClient.setQueryData<Response<Playlist>>(queryKeys.playlist(playlistId), (old) => {
                    if (!old?.data) return old
                    return {
                        ...old,
                        data: { ...old.data, liked: false }
                    }
                })
                // Optimistically remove from user playlists
                queryClient.setQueryData<Response<Playlist[]>>(queryKeys.userPlaylists, (old) => {
                    if (!old?.data) return old
                    return {
                        ...old,
                        data: old.data.filter(playlist => playlist.id !== playlistId)
                    }
                })
            },
            onSuccess: (response) => {
                enqueueSnackbar(translate(response.message), { variant: 'success' })
            },
            onError: (error, playlistId) => {
                // Revert optimistic update on error
                queryClient.invalidateQueries({ queryKey: queryKeys.playlists })
                queryClient.invalidateQueries({ queryKey: queryKeys.playlist(playlistId) })
                queryClient.invalidateQueries({ queryKey: queryKeys.userPlaylists })
                enqueueSnackbar(translate(error.message ?? 'unknown_error'), { variant: 'error' })
            },
            ...options,
        })
    }

    return {
        // Query Hooks
        useSongList,
        useSong,
        useVideo,
        useArtistList,
        useArtist,
        usePlaylistList,
        usePlaylist,
        useProfile,
        useUserSongList,
        useUserPlaylistList,
        useUserArtistList,
        // Mutation Hooks
        useCreateSong,
        useCreateArtist,
        useCreatePlaylist,
        useUpdatePlaylist,
        useAddSongsToPlaylist,
        useRemoveSongsFromPlaylist,
        useVerifyEmail,
        useAddFavoriteSong,
        useRemoveFavoriteSong,
        useAddFavoritePlaylist,
        useRemoveFavoritePlaylist,
    }
}

// Query Keys
export const queryKeys = {
    songs: ['songs'] as const,
    song: (id: string) => ['songs', id] as const,
    video: (id: string) => ['videos', id] as const,
    artists: ['artists'] as const,
    artist: (id: string) => ['artists', id] as const,
    playlists: ['playlists'] as const,
    playlist: (id: string) => ['playlists', id] as const,
    profile: ['profile'] as const,
    userSongs: ['user', 'songs'] as const,
    userPlaylists: ['user', 'playlists'] as const,
    userArtists: ['user', 'artists'] as const,
}

// Query Hooks 
export const useSongList = (options?: UseQueryOptions<Response<Song[]>>) => {
    return useQuery({
        queryKey: queryKeys.songs,
        queryFn: api.fetchSongList,
        ...options,
    })
}

export const useSong = (songId: string, options?: UseQueryOptions<Response<Song>>) => {
    return useQuery({
        queryKey: queryKeys.song(songId),
        queryFn: () => api.fetchSong(songId),
        enabled: !!songId,
        ...options,
    })
}

export const useVideo = (videoId: string, options?: UseQueryOptions<Response<Video>>) => {
    return useQuery({
        queryKey: queryKeys.video(videoId),
        queryFn: () => api.fetchVideo(videoId),
        enabled: !!videoId,
        ...options,
    })
}

export const useArtistList = (options?: UseQueryOptions<Response<Artist[]>>) => {
    return useQuery({
        queryKey: queryKeys.artists,
        queryFn: api.fetchArtistList,
        ...options,
    })
}

export const useArtist = (artistId: string, options?: UseQueryOptions<Response<Artist>>) => {
    return useQuery({
        queryKey: queryKeys.artist(artistId),
        queryFn: () => api.fetchArtist(artistId),
        enabled: !!artistId,
        ...options,
    })
}

export const usePlaylistList = (options?: UseQueryOptions<Response<Playlist[]>>) => {
    return useQuery({
        queryKey: queryKeys.playlists,
        queryFn: api.fetchPlaylistList,
        ...options,
    })
}

export const usePlaylist = (playlistId: string, options?: UseQueryOptions<Response<Playlist>>) => {
    return useQuery({
        queryKey: queryKeys.playlist(playlistId),
        queryFn: () => api.fetchPlaylist(playlistId),
        enabled: !!playlistId,
        ...options,
    })
}

export const useProfile = (options?: UseQueryOptions<Response<User>>) => {
    return useQuery({
        queryKey: queryKeys.profile,
        queryFn: api.fetchProfile,
        ...options,
    })
}

export const useUserSongList = (options?: UseQueryOptions<Response<Song[]>>) => {
    return useQuery({
        queryKey: queryKeys.userSongs,
        queryFn: api.fetchUserSongList,
        ...options,
    })
}

export const useUserPlaylistList = (options?: UseQueryOptions<Response<Playlist[]>>) => {
    return useQuery({
        queryKey: queryKeys.userPlaylists,
        queryFn: api.fetchUserPlaylistList,
        ...options,
    })
}

export const useUserArtistList = (options?: UseQueryOptions<Response<Artist[]>>) => {
    return useQuery({
        queryKey: queryKeys.userArtists,
        queryFn: api.fetchUserArtistList,
        ...options,
    })
}

// Mutation Hooks
export const useCreateSong = (options?: UseMutationOptions<Response, Error, FormData>) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: api.createSong,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.songs })
            queryClient.invalidateQueries({ queryKey: queryKeys.userSongs })
        },
        ...options,
    })
}

export const useCreateArtist = (options?: UseMutationOptions<Response, Error, FormData>) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: api.createArtist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.artists })
            queryClient.invalidateQueries({ queryKey: queryKeys.userArtists })
        },
        ...options,
    })
}

export const useCreatePlaylist = (options?: UseMutationOptions<Response, Error, FormData>) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: api.createPlaylist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.playlists })
            queryClient.invalidateQueries({ queryKey: queryKeys.userPlaylists })
        },
        ...options,
    })
}

export const useUpdatePlaylist = (options?: UseMutationOptions<Response, Error, { id: string; formData: FormData }>) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, formData }) => api.updatePlaylist(id, formData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.playlist(variables.id) })
            queryClient.invalidateQueries({ queryKey: queryKeys.playlists })
            queryClient.invalidateQueries({ queryKey: queryKeys.userPlaylists })
        },
        ...options,
    })
}

export const useAddSongsToPlaylist = (options?: UseMutationOptions<Response, Error, { playlistId: string; songIds: string[] }>) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ playlistId, songIds }) => api.addSongsToPlaylist(playlistId, songIds),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.playlist(variables.playlistId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.playlists })
        },
        ...options,
    })
}

export const useRemoveSongsFromPlaylist = (options?: UseMutationOptions<Response, Error, { playlistId: string; songIds: string[] }>) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ playlistId, songIds }) => api.removeSongsFromPlaylist(playlistId, songIds),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.playlist(variables.playlistId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.playlists })
        },
        ...options,
    })
}

export const useVerifyEmail = (options?: UseMutationOptions<Response, Error, { userId: string; token: string }>) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ userId, token }) => api.verifyEmail(userId, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.profile })
        },
        ...options,
    })
}

export const useAddFavoriteSong = (options?: UseMutationOptions<Response, Error, string>) => {
    const queryClient = useQueryClient()
    const { translate } = useLocales()
    const { enqueueSnackbar } = useSnackbar()
    return useMutation({
        mutationFn: (songId: string) => api.addFavoriteSong(songId),
        onMutate: async (songId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.songs })
            await queryClient.cancelQueries({ queryKey: queryKeys.userSongs })
            // Optimistically update song list
            queryClient.setQueryData<Response<Song[]>>(queryKeys.songs, (old) => {
                if (!old?.data) return old
                return {
                    ...old,
                    data: old.data.map(song => song.id === songId ? { ...song, liked: true } : song)
                }
            })
            // Optimistically add to user songs
            queryClient.setQueryData<Response<Song[]>>(queryKeys.userSongs, (old) => {
                if (!old?.data) return old
                const songExists = old.data.some(song => song.id === songId)
                if (songExists) {
                    return {
                        ...old,
                        data: old.data.map(song => song.id === songId ? { ...song, liked: true } : song)
                    }
                }
                // If song not in user songs, we need to fetch it from the songs cache
                const allSongs = queryClient.getQueryData<Response<Song[]>>(queryKeys.songs)
                const songToAdd = allSongs?.data?.find(s => s.id === songId)
                if (songToAdd) {
                    return {
                        ...old,
                        data: [{ ...songToAdd, liked: true }, ...old.data]
                    }
                }
                return old
            })
        },
        onSuccess: (response) => {
            enqueueSnackbar(translate(response.message), { variant: 'success' })
        },
        onError: (error) => {
            // Revert optimistic update on error
            queryClient.invalidateQueries({ queryKey: queryKeys.songs })
            queryClient.invalidateQueries({ queryKey: queryKeys.userSongs })
            enqueueSnackbar(translate(error.message ?? 'unknown_error'), { variant: 'error' })
        },
        ...options,
    })
}

export const useRemoveFavoriteSong = (options?: UseMutationOptions<Response, Error, string>) => {
    const queryClient = useQueryClient()
    const { translate } = useLocales()
    const { enqueueSnackbar } = useSnackbar()
    return useMutation({
        mutationFn: (songId: string) => api.removeFavoriteSong(songId),
        onMutate: async (songId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.songs })
            await queryClient.cancelQueries({ queryKey: queryKeys.userSongs })
            // Optimistically update song list
            queryClient.setQueryData<Response<Song[]>>(queryKeys.songs, (old) => {
                if (!old?.data) return old
                return {
                    ...old,
                    data: old.data.map(song => song.id === songId ? { ...song, liked: false } : song)
                }
            })
            // Optimistically remove from user songs
            queryClient.setQueryData<Response<Song[]>>(queryKeys.userSongs, (old) => {
                if (!old?.data) return old
                return {
                    ...old,
                    data: old.data.filter(song => song.id !== songId)
                }
            })
        },
        onSuccess: (response) => {
            enqueueSnackbar(translate(response.message), { variant: 'success' })
        },
        onError: (error) => {
            // Revert optimistic update on error
            queryClient.invalidateQueries({ queryKey: queryKeys.songs })
            queryClient.invalidateQueries({ queryKey: queryKeys.userSongs })
            enqueueSnackbar(translate(error.message ?? 'unknown_error'), { variant: 'error' })
        },
        ...options,
    })
}

export const useAddFavoritePlaylist = (options?: UseMutationOptions<Response, Error, string>) => {
    const queryClient = useQueryClient()
    const { translate } = useLocales()
    const { enqueueSnackbar } = useSnackbar()
    return useMutation({
        mutationFn: (playlistId: string) => api.addFavoritePlaylist(playlistId),
        onMutate: async (playlistId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.playlists })
            await queryClient.cancelQueries({ queryKey: queryKeys.userPlaylists })
            // Optimistically update playlist list
            queryClient.setQueryData<Response<Playlist[]>>(queryKeys.playlists, (old) => {
                if (!old?.data) return old
                return {
                    ...old,
                    data: old.data.map(playlist =>
                        playlist.id === playlistId ? { ...playlist, liked: true } : playlist
                    )
                }
            })
            // Optimistically update individual playlist
            queryClient.setQueryData<Response<Playlist>>(queryKeys.playlist(playlistId), (old) => {
                if (!old?.data) return old
                return {
                    ...old,
                    data: { ...old.data, liked: true }
                }
            })
            // Optimistically add to user playlists
            queryClient.setQueryData<Response<Playlist[]>>(queryKeys.userPlaylists, (old) => {
                if (!old?.data) return old
                const playlistExists = old.data.some(playlist => playlist.id === playlistId)
                if (playlistExists) {
                    return {
                        ...old,
                        data: old.data.map(playlist =>
                            playlist.id === playlistId ? { ...playlist, liked: true } : playlist
                        )
                    }
                }
                // If playlist not in user playlists, fetch it from the playlists cache
                const allPlaylists = queryClient.getQueryData<Response<Playlist[]>>(queryKeys.playlists)
                const playlistToAdd = allPlaylists?.data?.find(p => p.id === playlistId)
                if (playlistToAdd) {
                    return {
                        ...old,
                        data: [{ ...playlistToAdd, liked: true }, ...old.data]
                    }
                }
                return old
            })
        },
        onSuccess: (response) => {
            enqueueSnackbar(translate(response.message), { variant: 'success' })
        },
        onError: (error, playlistId) => {
            // Revert optimistic update on error
            queryClient.invalidateQueries({ queryKey: queryKeys.playlists })
            queryClient.invalidateQueries({ queryKey: queryKeys.playlist(playlistId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.userPlaylists })
            enqueueSnackbar(translate(error.message ?? 'unknown_error'), { variant: 'error' })
        },
        ...options,
    })
}

export const useRemoveFavoritePlaylist = (options?: UseMutationOptions<Response, Error, string>) => {
    const queryClient = useQueryClient()
    const { translate } = useLocales()
    const { enqueueSnackbar } = useSnackbar()
    return useMutation({
        mutationFn: (playlistId: string) => api.removeFavoritePlaylist(playlistId),
        onMutate: async (playlistId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.playlists })
            await queryClient.cancelQueries({ queryKey: queryKeys.userPlaylists })
            // Optimistically update playlist list
            queryClient.setQueryData<Response<Playlist[]>>(queryKeys.playlists, (old) => {
                if (!old?.data) return old
                return {
                    ...old,
                    data: old.data.map(playlist =>
                        playlist.id === playlistId ? { ...playlist, liked: false } : playlist
                    )
                }
            })
            // Optimistically update individual playlist
            queryClient.setQueryData<Response<Playlist>>(queryKeys.playlist(playlistId), (old) => {
                if (!old?.data) return old
                return {
                    ...old,
                    data: { ...old.data, liked: false }
                }
            })
            // Optimistically remove from user playlists
            queryClient.setQueryData<Response<Playlist[]>>(queryKeys.userPlaylists, (old) => {
                if (!old?.data) return old
                return {
                    ...old,
                    data: old.data.filter(playlist => playlist.id !== playlistId)
                }
            })
        },
        onSuccess: (response) => {
            enqueueSnackbar(translate(response.message), { variant: 'success' })
        },
        onError: (error, playlistId) => {
            // Revert optimistic update on error
            queryClient.invalidateQueries({ queryKey: queryKeys.playlists })
            queryClient.invalidateQueries({ queryKey: queryKeys.playlist(playlistId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.userPlaylists })
            enqueueSnackbar(translate(error.message ?? 'unknown_error'), { variant: 'error' })
        },
        ...options,
    })
}