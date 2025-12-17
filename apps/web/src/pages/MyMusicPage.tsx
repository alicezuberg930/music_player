import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yukikaze/ui/tabs"
import SongList from "@/sections/SongList"
import { useLocales } from "@/lib/locales"
import SongListShimmer from "@/components/loading-placeholder/SongListShimmer"
import { useApi } from "@/hooks/useApi"
import PlaylistCard from "@/sections/PlaylistCard"
import { useIsMobile } from "@/hooks/useMobile"

const MyMusicPage: React.FC = () => {
    const { translate } = useLocales()
    const { data: songData, isLoading: isSongLoading } = useApi().useUserSongList()
    const { data: playlistData, isLoading: isPlaylistLoading } = useApi().useUserPlaylistList()
    const isMobile = useIsMobile()

    return (
        <div className="">
            <h1 className="text-2xl font-bold mt-12">{translate('my_music')}</h1>
            <Tabs defaultValue="song" className="mt-4">
                <TabsList className="w-full md:w-1/2">
                    <TabsTrigger value="song">{translate('song')}</TabsTrigger>
                    <TabsTrigger value="playlist">{translate('playlist')}</TabsTrigger>
                    <TabsTrigger value="album">{translate('album')}</TabsTrigger>
                    <TabsTrigger value="artist">{translate('artist')}</TabsTrigger>
                </TabsList>
                <TabsContent value="song" className="mt-4">
                    {isSongLoading ? (
                        <SongListShimmer showHeader={true} count={10} />
                    ) : songData?.data && (
                        <SongList songs={songData?.data} showHeader={true} />
                    )}
                </TabsContent>
                <TabsContent value="playlist" className="mt-4">
                    {isPlaylistLoading ? (
                        <div>Loading playlists...</div>
                    ) : playlistData?.data && (
                        <div className="flex flex-wrap -mx-3">
                            {playlistData?.data.map(playlist => (
                                <PlaylistCard playlist={playlist} visibleSlides={isMobile ? 2 : 5} key={playlist?.id} />
                            ))}
                        </div>
                    )}
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