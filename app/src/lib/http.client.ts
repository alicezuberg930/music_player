import type { Response } from "@/@types/response"
import { axios } from "./axios.config"
import type { Song } from "@/@types/song"
import type { Video } from "@/@types/video"
import type { Artist } from "@/@types/artist"
import type { Playlist } from "@/@types/playlist"

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