import type { Song } from '@/@types/song'
import { addRecentSong, setCurrentSong } from '@/redux/slices/music'
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { HeartIcon } from 'lucide-react'
import { addSongsToPlaylist } from '@/lib/httpClient'
import { useSnackbar } from '@/components/snackbar'
import SongOptionDropdown from './SongOptionDropdown'

dayjs.extend(relativeTime)

type Props = {
    song: Song
    order?: number
    percent?: number
    imgSize?: 'sm' | 'md' | 'lg' | 'xl'
    style?: string
    showTime?: boolean
}

const SongItem: React.FC<Props> = ({ song, order, percent, imgSize, style, showTime }) => {
    const dispatch = useDispatch()
    const imageSizeCss = () => {
        if (imgSize === 'xl') return 'w-20 h-20'
        if (imgSize == 'lg') return 'w-14 h-14'
        if (imgSize == 'md') return 'w-12 h-12'
        if (imgSize == 'sm') return 'w-10 h-10'
        return 'w-10 h-10'
    }
    const textColor = () => {
        if (order === 1) return 'text-shadow-1'
        if (order === 2) return 'text-shadow-2'
        if (order === 3) return 'text-shadow-3'
        return 'text-shadow-3'
    }
    const { enqueueSnackbar } = useSnackbar()

    const handlePlay = () => {
        dispatch(addRecentSong(song))
        dispatch(setCurrentSong(song))
    }

    const addToPlaylist = async (playlistId: string) => {
        const response = await addSongsToPlaylist(playlistId, [song.id])
        if (response.statusCode === 200) {
            enqueueSnackbar('Đã thêm bài hát vào playlist', { variant: 'success' })
        } else {
            enqueueSnackbar(response.message, { variant: 'error' })
        }
    }

    const addToFavorite = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.stopPropagation()
        enqueueSnackbar('Đã thêm bài hát vào yêu thích', { variant: 'success' })
    }

    return (
        <div className={`${style || 'text-black hover:bg-main-200'} w-full p-2 h-auto rounded-md cursor-pointer`} onClick={handlePlay}>
            <div className='h-full flex justify-start items-center gap-2'>
                {order && (
                    <span className={`text-3xl px-1 text-[#33104cf2] ${textColor()}`}>
                        {order}
                    </span>
                )}
                <LazyLoadImage
                    className={`${imageSizeCss()} object-cover rounded-md`}
                    alt={song.id}
                    src={song.thumbnail}
                    effect='blur'
                />
                <div className='flex flex-col flex-auto'>
                    <span className='text-sm font-semibold line-clamp-1'>{song.title}</span>
                    <span className='text-xs opacity-70 line-clamp-1'>{song.artistNames}</span>
                    {showTime && <span className='text-xs opacity-70'>{dayjs(song.createdAt).fromNow()}</span>}
                </div>
                {percent && <span className='pr-1 font-bold'>{percent}%</span>}
                <HeartIcon className={`text-gray-500 ${song.liked && 'fill-main-500'}`} onClick={addToFavorite} />
                <SongOptionDropdown addToPlaylist={(playlistId) => addToPlaylist(playlistId)} />
            </div>
        </div>
    )
}

export default memo(SongItem)