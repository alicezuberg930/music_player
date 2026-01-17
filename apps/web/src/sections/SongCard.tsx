import { memo, type MouseEvent } from "react"
import { formatDuration } from "@/lib/utils"
import { useDispatch } from "react-redux"
import { setIsPlaying, addRecentSong, setCurrentSong, setCurrentPlaylistName } from "@/redux/slices/music"
import type { Song } from "@/@types/song"
import { HeartIcon, MusicIcon } from '@yukikaze/ui/icons'
import { LazyLoadImage } from "@/components/lazy-load-image"
import { useApi } from "@/hooks/useApi"

type Props = {
    song: Song
    playlistTitle?: string
    hideAlbum?: boolean
    order?: number
}

const SongCard: React.FC<Props> = ({ song, playlistTitle, hideAlbum, order }) => {
    const dispatch = useDispatch()
    const toggleFavoriteSongMutation = useApi().useToggleFavoriteSong()
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

    const handleFavorite = (e: MouseEvent<SVGSVGElement>) => {
        e.stopPropagation()
        toggleFavoriteSongMutation.mutate(song.id)
    }

    return (
        <div onClick={handleSongClick} className="flex justify-between items-center p-2 border-t border-[#0000000d] hover:bg-sidebar-accent cursor-pointer">
            <div className="flex w-[45%] items-center justify-start gap-2">
                {order && (
                    <div className={`w-1/12 flex justify-center text-3xl px-1 text-[#33104cf2] ${orderCss}`}>
                        {order}
                    </div>
                )}
                {!order && <MusicIcon size={16} />}
                <LazyLoadImage
                    widths={[
                        { screenWidth: 1024, imageWidth: 60 },  // Tablet & Phone
                        { screenWidth: 1920, imageWidth: 100 },  // Desktop and larger
                    ]}
                    src={song.thumbnail} alt="thumbnail" className="w-10 h-10 object-cover rounded-md"
                />
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
            <div className="flex gap-5 w-[10%] justify-end text-xs font-semibold text-gray-600">
                <HeartIcon
                    className={`${song.liked && 'fill-primary/80'} stroke-primary/80`}
                    onClick={handleFavorite} size={16}
                    aria-label='like/unlike song'
                />
                {formatDuration(song.duration)}
            </div>
        </div>
    )
}

export default memo(SongCard)