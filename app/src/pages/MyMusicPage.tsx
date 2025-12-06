import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SongList from "@/sections/SongList"
import { fetchUserSongList } from "@/lib/httpClient"
import type { Song } from "@/@types/song"
import { useLocales } from "@/lib/locales"

const MyMusicPage: React.FC = () => {
    const [songs, setSongs] = useState<Song[]>([])
    const [loading, setLoading] = useState(true)
    const { translate } = useLocales()

    useEffect(() => {
        const loadUserSongs = async () => {
            try {
                const response = await fetchUserSongList()
                console.log(response)
                setSongs(response.data ?? [])
            } catch (error) {
                console.error('Failed to fetch user songs:', error)
            } finally {
                setLoading(false)
            }
        }
        loadUserSongs()
    }, [])

    return (
        <div className="p-0">
            <h1 className="text-2xl font-bold mb-6">{translate('my_music')}</h1>
            <Tabs defaultValue="song" className="w-full">
                <TabsList>
                    <TabsTrigger value="song">{translate('song')}</TabsTrigger>
                    <TabsTrigger value="playlist">{translate('playlist')}</TabsTrigger>
                    <TabsTrigger value="album">{translate('album')}</TabsTrigger>
                    <TabsTrigger value="artist">{translate('artist')}</TabsTrigger>
                </TabsList>
                <TabsContent value="song" className="mt-4">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <SongList songs={songs} showHeader={true} />
                    )}
                </TabsContent>
                <TabsContent value="playlist" className="mt-4">
                    <div>Playlist content coming soon...</div>
                </TabsContent>
                <TabsContent value="album" className="mt-4">
                    <div>Album content coming soon...</div>
                </TabsContent>
                <TabsContent value="artist" className="mt-4">
                    <div>Artist content coming soon...</div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default MyMusicPage