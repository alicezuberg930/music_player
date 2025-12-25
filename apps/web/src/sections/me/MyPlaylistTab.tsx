import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yukikaze/ui/tabs"
import { useApi } from "@/hooks/useApi"
import PlaylistCard from "@/sections/PlaylistCard"
import { useIsMobile } from "@/hooks/useMobile"
import { PlaylistListShimmer } from "@/components/loading-placeholder"
import { useState } from "react"
import { useLocales } from "@/lib/locales"

export const MyPlaylistTab: React.FC = () => {
    const [type, setType] = useState<string>('created')
    const { data: playlistData, isLoading: isPlaylistLoading } = useApi().useUserPlaylistList(type)
    const isMobile = useIsMobile()
    const { translate } = useLocales()

    return (
        <>
            <Tabs defaultValue="created" onValueChange={val => setType(val)}>
                <TabsList>
                    <TabsTrigger value="created">{translate('created')}</TabsTrigger>
                    <TabsTrigger value="favorite">{translate('favorite')}</TabsTrigger>
                </TabsList>
                <TabsContent value="created" className="mt-4">
                    {isPlaylistLoading ? (
                        <PlaylistListShimmer />
                    ) : playlistData?.data && (
                        <div className="flex flex-wrap -mx-3">
                            {playlistData?.data.map(playlist => (
                                <PlaylistCard playlist={playlist} visibleSlides={isMobile ? 2 : 5} key={playlist?.id} />
                            ))}
                        </div>
                    )}
                </TabsContent>
                <TabsContent value="favorite" className="mt-4">
                    {isPlaylistLoading ? (
                        <PlaylistListShimmer />
                    ) : playlistData?.data && (
                        <div className="flex flex-wrap -mx-3">
                            {playlistData?.data.map(playlist => (
                                <PlaylistCard playlist={playlist} visibleSlides={isMobile ? 2 : 5} key={playlist?.id} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </>
    )
}

export default MyPlaylistTab