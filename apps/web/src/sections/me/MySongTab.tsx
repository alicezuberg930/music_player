import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yukikaze/ui/tabs"
import { SongListShimmer } from "@/components/loading-placeholder"
import { useApi } from "@/hooks/useApi"
import SongList from "../SongList"
import { useLocales } from "@/lib/locales"
import { useState } from "react"

export const MySongTab: React.FC = () => {
    const [type, setType] = useState<string>('uploaded')
    const { data: songData, isLoading: isSongLoading } = useApi().useUserSongList(type)
    const { translate } = useLocales()

    return (
        <>
            <Tabs defaultValue="uploaded" onValueChange={val => setType(val)}>
                <TabsList>
                    <TabsTrigger value="uploaded">{translate('uploaded')}</TabsTrigger>
                    <TabsTrigger value="favorite">{translate('favorite')}</TabsTrigger>
                </TabsList>
                <TabsContent value="uploaded" className="mt-4">
                    {isSongLoading ? (
                        <SongListShimmer showHeader={true} count={10} />
                    ) : songData?.data && (
                        <SongList songs={songData?.data} showHeader={true} />
                    )}
                </TabsContent>
                <TabsContent value="favorite" className="mt-4">
                    {isSongLoading ? (
                        <SongListShimmer showHeader={true} count={10} />
                    ) : songData?.data && (
                        <SongList songs={songData?.data} showHeader={true} />
                    )}
                </TabsContent>
            </Tabs>
        </>
    )
}

export default MySongTab