import { useMutation, useQuery, useQueryClient, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query'
import type { Response } from '@/@types/response'
import type { Song } from '@/@types/song'
import type { Video } from '@/@types/video'
import type { Artist } from '@/@types/artist'
import type { Playlist } from '@/@types/playlist'
import type { User } from '@/@types/user'
import * as api from '@/lib/httpClient'

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

// ============ Mutation Hooks ============

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
