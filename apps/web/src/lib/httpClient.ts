import { axios } from './axiosConfig'
// types
import type { Response } from '@/@types/response'
import type { QuerySong, Song } from '@/@types/song'
import type { Video } from '@/@types/video'
import type { Artist } from '@/@types/artist'
import type { Playlist } from '@/@types/playlist'
import type { User } from '@/@types/user'
import type { Banner } from '@/@types/banner'
import type { HomeData } from '@/@types/home'

export const fetchHomeData = async (): Promise<Response<HomeData>> => {
    try {
        const response = await axios.get<Response<HomeData>>(`/home/get`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const fetchSongList = async (query?: QuerySong): Promise<Response<Song[]>> => {
    console.log(query)
    try {
        const response = await axios.get<Response<Song[]>>(`/songs`, { params: query })
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const createSong = async (formData: FormData): Promise<Response> => {
    try {
        const response = await axios.post<Response>(`/songs`, formData)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const fetchSong = async (songId: string): Promise<Response<Song>> => {
    try {
        const response = await axios.get<Response<Song>>(`/songs/${songId}`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const fetchVideo = async (videoId: string): Promise<Response<Video>> => {
    try {
        const response = await axios.get<Response<Video>>(`/app/videos/${videoId}`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const fetchArtistList = async (): Promise<Response<Artist[]>> => {
    try {
        const response = await axios.get<Response<Artist[]>>(`/app/artists`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const fetchArtist = async (artistId: string): Promise<Response<Artist>> => {
    try {
        const response = await axios.get<Response<Artist>>(`/app/artists/${artistId}`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const createArtist = async (formData: FormData): Promise<Response> => {
    try {
        const response = await axios.post<Response>(`/app/artists`, formData)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const createPlaylist = async (formData: FormData): Promise<Response> => {
    try {
        const response = await axios.post<Response>(`/app/playlists`, formData)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const updatePlaylist = async (id: string, formData: FormData): Promise<Response> => {
    try {
        const response = await axios.put<Response>(`/app/playlists/${id}`, formData)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const addSongsToPlaylist = async (playlistId: string, songIds: string[]): Promise<Response> => {
    try {
        const response = await axios.put<Response>(`/app/playlists/add-songs/${playlistId}`, { songIds })
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const removeSongsFromPlaylist = async (playlistId: string, songIds: string[]): Promise<Response> => {
    try {
        const response = await axios.put<Response>(`/app/playlists/remove-songs/${playlistId}`, { songIds })
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const fetchPlaylist = async (playlistId: string): Promise<Response<Playlist>> => {
    try {
        const response = await axios.get<Response<Playlist>>(`/app/playlists/${playlistId}`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const fetchPlaylistList = async (): Promise<Response<Playlist[]>> => {
    try {
        const response = await axios.get<Response<Playlist[]>>(`/app/playlists`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const signIn = async (email: string, password: string): Promise<Response<{ user: User }>> => {
    try {
        const response = await axios.post<Response<{ user: User }>>(`/app/users/sign-in`, { email, password })
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const signUp = async (fullname: string, email: string, password: string): Promise<Response> => {
    try {
        const response = await axios.post<Response>(`/app/users/sign-up`, { fullname, email, password })
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const signOut = async (): Promise<Response> => {
    try {
        const response = await axios.post<Response>(`/app/users/sign-out`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const fetchProfile = async (): Promise<Response<User>> => {
    try {
        const response = await axios.get<Response<User>>(`/app/me/profile`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const verifyEmail = async (userId: string, token: string): Promise<Response> => {
    try {
        const response = await axios.get<Response>(`/app/users/verify-email/${userId}`, { params: { token } })
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const fetchUserSongList = async (): Promise<Response<Song[]>> => {
    try {
        const response = await axios.get<Response<Song[]>>(`/app/users/song/list`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const fetchUserPlaylistList = async (): Promise<Response<Playlist[]>> => {
    try {
        const response = await axios.get<Response<Playlist[]>>(`/app/users/playlist/list`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const fetchUserArtistList = async (): Promise<Response<Artist[]>> => {
    try {
        const response = await axios.get<Response<Artist[]>>(`/app/users/artist/list`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const addFavoriteSong = async (songId: string): Promise<Response> => {
    try {
        const response = await axios.put<Response>(`/app/users/favorite/song/${songId}`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const removeFavoriteSong = async (songId: string): Promise<Response> => {
    try {
        const response = await axios.delete<Response>(`/app/users/favorite/song/${songId}`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const addFavoritePlaylist = async (playlistId: string): Promise<Response> => {
    try {
        const response = await axios.put<Response>(`/app/users/favorite/playlist/${playlistId}`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const removeFavoritePlaylist = async (playlistId: string): Promise<Response> => {
    try {
        const response = await axios.delete<Response>(`/app/users/favorite/playlist/${playlistId}`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const fetchBannerList = async (): Promise<Response<Banner[]>> => {
    try {
        const response = await axios.get<Response<Banner[]>>(`/app/banners`)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}