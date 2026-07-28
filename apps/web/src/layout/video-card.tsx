import { Link } from '@tanstack/react-router'
import { formatDuration } from '@/lib/utils'
import type { Video } from '@/@types/video'
import { memo } from 'react'
import { PlayCircle } from '@yukikaze/ui'
import { Typography } from '@yukikaze/ui/typography'
import { LazyLoadImage } from '@/components/lazy-load-image'
import { Badge } from '@yukikaze/ui/badge'

type Props = {
    video: Video
    variant?: 'horizontal' | 'vertical'
}

const VideoCard = ({ video, variant = 'horizontal' }: Props) => {
    return (
        variant === 'horizontal' ? (
            <Link to={`/video/${video?.id}`} className='relative group' key={video?.id}>
                <div className='relative aspect-video rounded-md overflow-hidden mb-3'>
                    <LazyLoadImage
                        widths={[
                            { screenWidth: 1024, imageWidth: 120 },  // Tablet & Phone
                            { screenWidth: 1920, imageWidth: 240 },  // Desktop and larger
                        ]}
                        src={video?.thumbnail} alt={video?.title}
                        effect="blur"
                        className="w-full object-cover rounded-md group-hover:scale-110"
                    />
                    {/* Duration */}
                    <Badge className='bg-[#00000080] absolute bottom-1 right-1'>
                        {formatDuration(video?.duration)}
                    </Badge>
                    {/* Overlay */}
                    <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-50 transition-all flex items-center justify-center'>
                        <PlayCircle size={64} className='text-white' />
                    </div>
                </div>
                <div className='flex gap-2 items-center'>
                    <img src={video?.mainArtist?.thumbnail} alt={video?.mainArtist?.name} className='w-10 h-10 object-cover rounded-full' />
                    <div className='flex-1'>
                        <Typography variant='h6' className='font-normal'>{video?.title}</Typography>
                        <Typography variant='span' className='text-base'>{video?.artistNames}</Typography>
                    </div>
                </div>
            </Link>
        ) : (
            // <div className={`flex ${isTheater ? 'flex-col flex-1' : 'hover:bg-[#ffffff0d]'} py-1 items-center gap-2 px-4`}>
            //     <img src={item?.thumbnail} className={`${isTheater ? 'w-full h-28' : 'w-32 h-16'} object-cover rounded-md`} />
            //     <div className="block w-full">
            //         <span className="line-clamp-1 font-bold text-sm">{item?.title}</span>
            //         <span className="line-clamp-1 font-semibold text-xs text-[rgba(255,255,255,0.4)]">
            //             {item?.artists?.map((artist, i) => (
            //                 <Link to={`/artist/${artist.alias}`} key={i}>
            //                     {`${artist.name}${i < item.artists.length - 1 ? ', ' : ''}`}
            //                 </Link>
            //             ))}
            //         </span>
            //     </div>
            // </div>
            <></>
        )
    )
}

export default memo(VideoCard)
