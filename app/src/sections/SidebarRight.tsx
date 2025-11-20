import { useState } from "react"
import { icons } from "@/lib/icons"
import { useSelector } from "@/redux/store"
import SongItem from "./SongItem"

const SidebarRight = () => {
    const [type, setType] = useState(0)
    const { ImBin } = icons
    const { currentSong, currentPlaylistName, recentSongs, currentSongs } = useSelector(state => state.music)

    return (
        <div className="animate-slide-left hidden xl:block w-[330px] flex-none border-l">
            <div className="flex flex-col text-xs w-full h-full">
                <div className="h-16 flex-none py-3 flex items-center justify-between px-2 gap-8" >
                    <div className="flex flex-auto bg-main-200 rounded-full p-1 cursor-pointer">
                        <span className={`py-1 flex-1 rounded-full flex justify-center ${type === 0 && 'bg-main-100'}`}
                            onClick={() => setType(0)}
                        >
                            Danh sách phát
                        </span>
                        <span className={`py-1 flex-1 rounded-full flex justify-center ${type === 1 && 'bg-main-100'}`}
                            onClick={() => setType(1)}
                        >
                            Nghe gần đây
                        </span>
                    </div>
                    <span className="p-1 rounded-full hover:bg-main-100 cursor-pointer">
                        <ImBin size={18} />
                    </span>
                </div>
                <div className={`${type === 1 && 'hidden'} flex flex-col px-2`}>
                    {currentSong && <SongItem song={currentSong} imgSize="sm" style="bg-main-500 text-white" />}
                    <div className="px-2 py-3">
                        <span className="text-sm font-bold">Tiếp theo</span>
                        <span className="w-full flex">
                            <span className="w-1/4 opacity-70 text-xs">Từ playlist</span>
                            <span className="font-semibold text-main-500 line-clamp-1">{currentPlaylistName}</span>
                        </span>
                    </div>
                </div>
                <div className="flex flex-col overflow-hidden">
                    <div className="h-full overflow-y-scroll">
                        {
                            type === 0 ? currentSongs?.map(song => {
                                return (<SongItem song={song} imgSize="sm" key={song.id} />)
                            }) : recentSongs?.map(song => {
                                return (<SongItem song={song} imgSize="sm" key={song.id} />)
                            })
                        }
                    </div>
                    <div className="h-24"></div>
                </div>
            </div>
        </div>
    )
}

export default SidebarRight