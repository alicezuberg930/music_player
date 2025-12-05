import { memo, useCallback } from "react"
import { useDispatch, useSelector } from "@/redux/store"
import SongItem from "./SongItem"
import { Trash } from "lucide-react"
import { Typography } from "@/components/ui/typography"
import { deleteCurrentSongs } from "@/redux/slices/music"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocales } from "@/lib/locales"
import { Button } from "@/components/ui/button"

const SidebarRight: React.FC = () => {
    const { currentSong, currentPlaylistName, recentSongs, currentPlaylistSongs } = useSelector(state => state.music)
    const { showSideBarRight } = useSelector(state => state.app)
    const dispatch = useDispatch()
    const { translate } = useLocales()

    const handleClearAll = useCallback(() => {
        dispatch(deleteCurrentSongs())
    }, [dispatch])

    return (
        <div className={`absolute bottom-0 top-0 w-[330px] border-l transition-all duration-1500 ease-in-out z-105 bg-main-300 ${showSideBarRight ? 'right-0' : 'right-[-330px]'}`}>
            <div className="flex flex-col h-full">
                <Tabs defaultValue="playlist" className="px-2 mt-4">
                    <div className="flex items-center justify-between gap-2">
                        <TabsList className="flex-1">
                            <TabsTrigger value="playlist">{translate('playlist')}</TabsTrigger>
                            <TabsTrigger value="recently_played">{translate('recently_played')}</TabsTrigger>
                        </TabsList>
                        <Button variant={'ghost'} onClick={handleClearAll}>
                            <Trash className="cursor-pointer shrink-0" />
                        </Button>
                    </div>
                    <TabsContent value="playlist">
                        <div className='flex flex-col'>
                            {currentSong && <SongItem song={currentSong} imgSize="sm" style="bg-main-500 text-white" />}
                            <div className="py-3">
                                <Typography variant={'span'} className="font-bold">Tiếp theo</Typography>
                                <div className="flex items-center text-xs gap-1 overflow-hidden">
                                    <Typography className="opacity-70 flex-none">Từ playlist:</Typography>
                                    <Typography className="font-semibold text-main-500 text-ellipsis line-clamp-1">{currentPlaylistName}</Typography>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <div className="overflow-y-scroll">
                                {currentPlaylistSongs?.map(song => <SongItem song={song} imgSize="sm" key={song.id} />)}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="recently_played">
                        <div className="flex flex-col overflow-hidden">
                            <div className="overflow-y-scroll">
                                {recentSongs?.map(song => <SongItem song={song} imgSize="sm" key={song.id} />)}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default memo(SidebarRight)