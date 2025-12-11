import { memo } from "react"
import { formatDuration } from "@/lib/utils"
import { useDispatch } from "react-redux"
import { setIsPlaying, addRecentSong, setCurrentSong, setCurrentPlaylistName } from "@/redux/slices/music"
import type { Song } from "@/@types/song"
import { MusicIcon } from '@yukikaze/ui/icons'

type Props = {
    song: Song
    playlistTitle?: string
    hideAlbum?: boolean
    order?: number
}

const SongCard: React.FC<Props> = ({ song, playlistTitle, hideAlbum, order }) => {
    const dispatch = useDispatch()
    const orderCss = () => {
        switch (order) {
            case 1: return 'text-shadow-1'
            case 2: return 'text-shadow-2'
            case 3: return 'text-shadow-3'
            default: return 'text-shadow-other'
        }
    }

    const handleSongClick = () => {
        dispatch(setCurrentSong(song))
        dispatch(setIsPlaying(true))
        dispatch(addRecentSong(song))
        dispatch(setCurrentPlaylistName(playlistTitle))
    }

    return (
        <div onClick={handleSongClick} className="flex justify-between items-center p-2 border-t border-[#0000000d] hover:bg-main-200 cursor-pointer">
            <div className="flex w-[45%] items-center justify-start gap-2">
                {order && (
                    <div className={`w-1/12 flex justify-center text-3xl px-1 text-[#33104cf2] ${orderCss}`}>
                        {order}
                    </div>
                )}
                {!order && <MusicIcon size={16} />}
                <img src={song.thumbnail} alt="thumbnail" className="w-10 h-10 object-cover rounded-md" />
                <div className="flex flex-col whitespace-nowrap w-3/4">
                    <span className="font-semibold text-sm text-ellipsis overflow-hidden">{song.title}</span>
                    <span className="text-xs text-ellipsis overflow-hidden">{song.artistNames}</span>
                </div>
            </div>
            {!hideAlbum && (
                <div className="flex w-[45%] justify-start font-semibold whitespace-nowrap text-xs text-gray-500">
                    <span className="text-ellipsis overflow-hidden">{""}</span>
                </div>
            )}
            <div className="flex w-[10%] justify-end text-xs font-semibold text-gray-600">
                {formatDuration(song.duration)}
            </div>
        </div>
    )
}

export default memo(SongCard)