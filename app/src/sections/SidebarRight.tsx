import { memo, useCallback, useState } from "react"
import { useSelector } from "@/redux/store"
import SongItem from "./SongItem"
import { Trash } from "lucide-react"
import { Typography } from "@/components/ui/typography"

const SidebarRight = () => {
    const [type, setType] = useState<'playlist' | 'recent'>('playlist')
    const { currentSong, currentPlaylistName, recentSongs, currentSongs } = useSelector(state => state.music)
    const { showSideBarRight } = useSelector(state => state.app)

    const handleClearAll = () => useCallback(() => {

    }, [])

    return (
        <div className={`absolute bottom-0 top-0 w-[330px] border-l transition-all duration-1500 ease-in-out z-40 bg-main-300 ${showSideBarRight ? 'right-0' : 'right-[-330px]'}`}>
            <div className="flex flex-col h-full">
                <div className="h-16 flex items-center justify-between px-2 gap-8" >
                    <div className="flex flex-auto bg-main-200 rounded-full cursor-pointer">
                        <Typography className={`py-1 m-0 rounded-full flex-1 text-center ${type === 'playlist' && 'bg-main-100'}`} onClick={() => setType('playlist')}>
                            Danh sách phát
                        </Typography>
                        <Typography className={`py-1 m-0 rounded-full flex-1 text-center ${type === 'recent' && 'bg-main-100'}`} onClick={() => setType('recent')}>
                            Nghe gần đây
                        </Typography>
                    </div>
                    <Trash className="cursor-pointer" onClick={handleClearAll} />
                </div>
                <div className={`${type === 'recent' && 'hidden'} flex flex-col px-2`}>
                    {currentSong && <SongItem song={currentSong} imgSize="sm" style="bg-main-500 text-white" />}
                    <div className="px-2 py-3">
                        <Typography variant={'span'} className="font-bold">Tiếp theo</Typography>
                        <div className="flex items-center text-xs gap-1 overflow-hidden">
                            <Typography className="opacity-70 flex-none">Từ playlist:</Typography>
                            <Typography className="font-semibold text-main-500 text-ellipsis line-clamp-1">{currentPlaylistName}</Typography>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col overflow-hidden">
                    <div className="overflow-y-scroll">
                        {type === 'playlist' && currentSongs?.map(song => <SongItem song={song} imgSize="sm" key={song.id} />)}
                        {type === 'recent' && recentSongs?.map(song => <SongItem song={song} imgSize="sm" key={song.id} />)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(SidebarRight)