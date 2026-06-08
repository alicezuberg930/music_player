import { useEffect, useState } from 'react'
import { fetchUserPlaylistList } from '@/lib/httpClient'
import type { Playlist } from '@/@types/playlist'

export const useFetchUserPlaylists = (type: string = 'created') => {
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                setLoading(true)
                const response = await fetchUserPlaylistList(type)
                setPlaylists(response.data ?? [])
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch playlists'))
            } finally {
                setLoading(false)
            }
        }
        fetchPlaylist()
    }, [type])

    return { playlists, loading, error }
}
