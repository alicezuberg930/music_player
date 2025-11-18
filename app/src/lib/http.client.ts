import type { Response } from "@/@types/response"
import { axios } from "./axios.config"
import type { Song } from "@/@types/song"
import type { Video } from "@/@types/video"

export const fetchSong = async (songId: number): Promise<Response<Song>> => {
    try {
        const response = await axios.get<Response<Song>>(`/songs/${songId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export const fetchVideoList = async (): Promise<Response<Video[]>> => {
    try {
        const response = await axios.get<Response<Video[]>>('/videos')
        return response.data
    } catch (error) {
        throw error
    }
}