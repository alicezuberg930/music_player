import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yukikaze/ui/tabs"
import PlaylistCard from "@/sections/PlaylistCard"
import { useIsMobile } from "@/hooks/useMobile"
import { PlaylistListShimmer } from "@/components/loading-placeholder"
import { memo, useState } from "react"
import { useLocales } from "@/lib/locales"
import { useQuery } from "@tanstack/react-query"
import { userQueries } from "@/lib/queries/user"
import type { PlaylistType } from "@/@types"

export const MyPlaylistTab: React.FC = () => {
    const [type, setType] = useState<PlaylistType>('created')
    const { data, isLoading } = useQuery(userQueries().playlist.queryOptions(type))
    const isMobile = useIsMobile()
    const { translate } = useLocales()

    return (
        <Tabs
            defaultValue="created"
            onValueChange={val => setType(val as PlaylistType)}
        >
            <TabsList>
                <TabsTrigger value="created">{translate('created')}</TabsTrigger>
                <TabsTrigger value="favorite">{translate('favorite')}</TabsTrigger>
            </TabsList>
            <TabsContent value="created" className="mt-4">
                {isLoading ? (
                    <PlaylistListShimmer />
                ) : data && (
                    <div className="flex flex-wrap -mx-3">
                        {data.map(playlist => (
                            <PlaylistCard playlist={playlist} visibleSlides={isMobile ? 2 : 5} key={playlist?.id} />
                        ))}
                    </div>
                )}
            </TabsContent>
            <TabsContent value="favorite" className="mt-4">
                {isLoading ? (
                    <PlaylistListShimmer />
                ) : data && (
                    <div className="flex flex-wrap -mx-3">
                        {data.map(playlist => (
                            <PlaylistCard playlist={playlist} visibleSlides={isMobile ? 2 : 5} key={playlist?.id} />
                        ))}
                    </div>
                )}
            </TabsContent>
        </Tabs>
    )
}

export default memo(MyPlaylistTab)