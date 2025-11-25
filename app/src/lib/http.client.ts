import type { Response } from '@/@types/response'
import { axios } from './axios.config'
import type { Song } from '@/@types/song'
import type { Video } from '@/@types/video'
import type { Artist } from '@/@types/artist'
import type { Playlist } from '@/@types/playlist'
import type { User } from '@/@types/user'

export const fetchSongList = async () => {
    try {
        const response = await axios.get<Response<Song[]>>(`/songs`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const createSong = async (formData: FormData): Promise<Response> => {
    try {
        const response = await axios.post<Response>(`/songs`, formData)
        console.log(response)
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const fetchSong = async (songId: string): Promise<Response<Song>> => {
    try {
        const response = await axios.get<Response<Song>>(`/songs/${songId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchVideo = async (videoId: string): Promise<Response<Video>> => {
    try {
        const response = await axios.get<Response<Video>>(`/videos/${videoId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchArtistList = async (): Promise<Response<Artist[]>> => {
    try {
        const response = await axios.get<Response<Artist[]>>(`/artists`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchArtist = async (artistId: string): Promise<Response<Artist>> => {
    try {
        const response = await axios.get<Response<Artist>>(`/artists/${artistId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchPlaylist = async (playlistId: string): Promise<Response<Playlist>> => {
    try {
        const response = await axios.get<Response<Playlist>>(`/playlists/${playlistId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const signIn = async (email: string, password: string): Promise<Response> => {
    try {
        const response = await axios.post<Response>(`/users/sign-in`, { email, password })
        return response.data
    } catch (error) {
        throw error
    }
}

export const signUp = async (fullname: string, email: string, password: string): Promise<Response> => {
    try {
        const response = await axios.post<Response>(`/users/sign-up`, { fullname, email, password })
        return response.data
    } catch (error) {
        throw error
    }
}

export const signOut = async (): Promise<Response> => {
    try {
        const response = await axios.post<Response>(`/users/sign-out`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchProfile = async (): Promise<Response<User>> => {
    try {
        const response = await axios.get<Response<User>>(`/me/profile`)
        return response.data
    } catch (error) {
        throw error
    }
}