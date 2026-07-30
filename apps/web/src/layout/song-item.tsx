import type { Playlist, Song } from '@/@types'
import { addRecentSong, setCurrentSong } from '@/redux/slices/music'
import { memo, type MouseEvent } from 'react'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { cn, HeartIcon, MoreHorizontalIcon } from '@yukikaze/ui'
import { songOptionMenuHandle } from './song-options-dropdown'
import { DropdownMenuTrigger } from '@yukikaze/ui/dropdown-menu'
import { LazyLoadImage } from '@/components/lazy-load-image'
import { useMutation } from '@tanstack/react-query'
import { userQueries } from '@/lib/queries/user'

dayjs.extend(relativeTime)

type Props = {
  song: Song
  playlists?: Playlist[]
  order?: number
  percent?: number
  imgSize?: 'sm' | 'md' | 'lg' | 'xl'
  wrapperClassName?: string
  showTime?: boolean
}

const SongItem: React.FC<Props> = ({ song, playlists, order, percent, imgSize = 'sm', wrapperClassName, showTime }) => {
  const dispatch = useDispatch()
  const { mutate: favoriteSong } = useMutation(userQueries().favoriteSong.mutationOptions())

  const handlePlay = () => {
    dispatch(addRecentSong(song))
    dispatch(setCurrentSong(song))
  }

  const handleFavorite = (e: MouseEvent<SVGSVGElement>) => {
    e.stopPropagation()
    favoriteSong(song.id)
  }

  return (
    <div
      className={cn('w-full p-2 h-auto rounded-md cursor-pointer hover:bg-black/10', wrapperClassName)}
      onClick={handlePlay}
    >
      <div className='flex items-center gap-2 group'>
        {order && (
          <span className={
            cn(
              'text-3xl px-1 text-[#33104cf2]',
              order === 1 && 'text-shadow-1',
              order === 2 && 'text-shadow-2',
              order === 3 && 'text-shadow-3'
            )}
          >
            {order}
          </span>
        )}
        <LazyLoadImage
          widths={[
            { screenWidth: 1024, imageWidth: 60 }, // Tablet & Phone
            { screenWidth: 1920, imageWidth: 100 }, // Desktop and larger
          ]}
          className={cn('object-cover rounded-md',
            imgSize === 'xl' && 'w-20 h-20',
            imgSize === 'lg' && 'w-14 h-14',
            imgSize === 'md' && 'w-12 h-12',
            imgSize === 'sm' && 'w-10 h-10',
          )}
          alt={song.id}
          src={song.thumbnail}
          effect='blur'
        />
        <div className='flex flex-col flex-auto text-start'>
          <span className='text-sm font-semibold line-clamp-1'>
            {song.title}
          </span>
          <span className='text-xs line-clamp-1'>{song.artistNames}</span>
          {showTime && (
            <span className='text-xs text-gray-600'>
              {dayjs(song.createdAt).fromNow()}
            </span>
          )}
        </div>
        {percent && <span className='pr-1 font-bold'>{percent}%</span>}
        {!percent && (
          <>
            <HeartIcon
              className={cn('group-hover:opacity-100 opacity-0 stroke-primary/80',
                song.liked && 'fill-primary/80'
              )}
              onClick={handleFavorite}
              aria-label='like/unlike song'
            />
            <DropdownMenuTrigger
              handle={songOptionMenuHandle}
              payload={{ song, playlists }}
              render={
                <button
                  onClick={(e) => e.stopPropagation()}
                  className='group-hover:opacity-100 opacity-0'
                  aria-label='More song options'
                >
                  <MoreHorizontalIcon aria-hidden='true' />
                </button>
              }
            />
          </>
        )}
      </div>
    </div>
  )
}

export default memo(SongItem)