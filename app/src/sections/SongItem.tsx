import type { Song } from '@/@types/song'
import { addRecentSong, setCurrentSong } from '@/redux/slices/music'
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

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
    const imageSizeCss = imgSize === 'xl' ? 'w-20 h-20' : imgSize == 'lg' ? 'w-14 h-14' : 'w-10 h-10'

    const handlePlay = () => {
        dispatch(addRecentSong(song))
        dispatch(setCurrentSong(song))
    }

    return (
        <div className={`${style || 'text-black hover:bg-main-200'} w-full p-2 h-auto rounded-md cursor-pointer`} onClick={handlePlay}>
            <div className='h-full flex justify-start items-center gap-2'>
                {order && (
                    <span className={`text-3xl px-1 text-[#33104cf2] ${order === 1 ? 'text-shadow-1' : order === 2 ? 'text-shadow-2' : 'text-shadow-3'}`}>
                        {order}
                    </span>
                )}
                <LazyLoadImage
                    className={`${imageSizeCss} object-cover rounded-md`}
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
            </div>
        </div>
    )
}

export default memo(SongItem)