import type { Playlist, Song } from '@/@types'
import { addRecentSong, setCurrentSong } from '@/redux/slices/music'
import { memo, type MouseEvent } from 'react'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { HeartIcon, MoreHorizontalIcon } from '@yukikaze/ui/icons'
import SongOptionDropdown from './SongOptionDropdown'
import { LazyLoadImage } from '@/components/lazy-load-image'
import { toast } from '@yukikaze/ui'
import { useMutation } from '@tanstack/react-query'
import { userQueries } from '@/lib/queries/user'
import { playlistQueries } from '@/lib/queries/playlist'

dayjs.extend(relativeTime)

type Props = {
    song: Song
    playlists?: Playlist[]
    order?: number
    percent?: number
    imgSize?: 'sm' | 'md' | 'lg' | 'xl'
    style?: string
    showTime?: boolean
}

const SongItem: React.FC<Props> = ({ song, playlists, order, percent, imgSize, style, showTime }) => {
    const dispatch = useDispatch()
    const { mutate: favoriteSong } = useMutation(userQueries().favoriteSong.mutationOptions())
    const { mutate: addToPlaylist } = useMutation(playlistQueries().addToPlaylist.mutationOptions())
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

    const handlePlay = () => {
        dispatch(addRecentSong(song))
        dispatch(setCurrentSong(song))
    }

    const handleAddToPlaylist = async (playlistId: string) => {
        addToPlaylist({ id: playlistId, songIds: [song.id] }, {
            onSuccess: (res) => {
                toast.success(res.message)
            },
            onError: (err) => {
                toast.error(err.message)
            }
        })
    }

    const handleFavorite = (e: MouseEvent<SVGSVGElement>) => {
        e.stopPropagation()
        favoriteSong(song.id)
    }

    return (
        <div className={`${style || 'text-black hover:bg-sidebar-accent'} w-full p-2 h-auto rounded-md cursor-pointer`} onClick={handlePlay}>
            <div className='flex items-center gap-2 group'>
                {order && (
                    <span className={`text-3xl px-1 text-[#33104cf2] ${textColor()}`}>
                        {order}
                    </span>
                )}
                <LazyLoadImage
                    widths={[
                        { screenWidth: 1024, imageWidth: 60 },  // Tablet & Phone
                        { screenWidth: 1920, imageWidth: 100 },  // Desktop and larger
                    ]}
                    className={`${imageSizeCss()} object-cover rounded-md`}
                    alt={song.id}
                    src={song.thumbnail}
                    effect='blur'
                />
                <div className='flex flex-col flex-auto text-start'>
                    <span className='text-sm font-semibold line-clamp-1'>{song.title}</span>
                    <span className='text-xs line-clamp-1'>{song.artistNames}</span>
                    {showTime && <span className='text-xs text-gray-600'>{dayjs(song.createdAt).fromNow()}</span>}
                </div>
                {percent && <span className='pr-1 font-bold'>{percent}%</span>}
                {!percent && (
                    <>
                        <HeartIcon
                            className={`group-hover:opacity-100 opacity-0 stroke-primary/80 ${song.liked && 'fill-primary/80'}`}
                            onClick={handleFavorite}
                            aria-label='like/unlike song'
                        />
                        <button onClick={(e) => e.stopPropagation()} className='group-hover:opacity-100 opacity-0' aria-label="More song options">
                            <SongOptionDropdown
                                triggerElement={<MoreHorizontalIcon aria-label='More song options' />}
                                playlists={playlists}
                                addToPlaylist={(playlistId) => handleAddToPlaylist(playlistId)}
                            />
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default memo(SongItem)