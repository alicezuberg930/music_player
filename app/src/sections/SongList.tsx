import { memo } from "react"
import SongCard from "./SongCard"
import { formatDuration } from "@/lib/utils"
import type { Song } from "@/@types/song"
import { Dot } from "lucide-react"

type Props = {
    songs: Song[]
    totalDuration?: number
    playlistTitle?: string
    showHeader?: boolean
}

const SongList: React.FC<Props> = ({ songs, totalDuration, playlistTitle, showHeader = true }) => {
    return (
        <div className="w-full flex flex-col text-xs text-gray-600">
            {showHeader && (
                <div className="font-bold flex items-center justify-between p-2">
                    <div className="w-[45%]">
                        <span>BÀI HÁT</span>
                    </div>
                    <div className="w-[45%]">
                        <span>ALBUM</span>
                    </div>
                    <div className="w-[10%] text-end">
                        <span>THỜI GIAN</span>
                    </div>
                </div>
            )}
            <div className="flex flex-col">
                {songs && songs.map(song => (
                    <SongCard key={song.id} song={song} playlistTitle={playlistTitle} />
                ))}
            </div>
            {totalDuration && (
                <div className="flex items-center gap-2 border-t border-[rgba(0,0,0,0.05)] py-2">
                    <span>{songs?.length} bài hát</span>
                    <Dot />
                    <span>{formatDuration(totalDuration)}</span>
                </div>
            )}
        </div>
    )
}

export default memo(SongList)