import { Tabs, TabsContent, TabsList, TabsTrigger } from "@yukikaze/ui/tabs"
import { SongListShimmer } from "@/components/loading-placeholder"
import SongList from "../SongList"
import { useLocales } from "@/lib/locales"
import { useState } from "react"
import type { SongType } from "@/@types"
import { useQuery } from "@tanstack/react-query"
import { userQueries } from "@/lib/queries/user"

export const MySongTab: React.FC = () => {
    const [type, setType] = useState<SongType>('uploaded')
    const { data, isLoading } = useQuery(userQueries().song.queryOptions(type))
    const { translate } = useLocales()

    return (
        <>
            <Tabs defaultValue="uploaded" onValueChange={val => setType(val as SongType)}>
                <TabsList>
                    <TabsTrigger value="uploaded">{translate('uploaded')}</TabsTrigger>
                    <TabsTrigger value="favorite">{translate('favorite')}</TabsTrigger>
                </TabsList>
                <TabsContent value="uploaded" className="mt-4">
                    {isLoading ? (
                        <SongListShimmer showHeader={true} count={10} />
                    ) : data && (
                        <SongList songs={data} showHeader={true} />
                    )}
                </TabsContent>
                <TabsContent value="favorite" className="mt-4">
                    {isLoading ? (
                        <SongListShimmer showHeader={true} count={10} />
                    ) : data && (
                        <SongList songs={data} showHeader={true} />
                    )}
                </TabsContent>
            </Tabs>
        </>
    )
}

export default MySongTab