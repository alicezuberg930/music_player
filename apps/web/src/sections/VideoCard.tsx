import { NavLink } from 'react-router-dom'
import { formatDuration } from '@/lib/utils'
import type { Video } from '@/@types/video'

type Props = {
    video: Video
    variant?: 'horizontal' | 'vertical'
}

const VideoCard = ({ video, variant = 'horizontal' }: Props) => {
    // const { BsPlayFill } = icons

    return (
        variant === 'horizontal' ? (
            <NavLink to={`/video/${video.id}`} className='relative group' key={video?.id}>
                <div className='relative aspect-video rounded-md overflow-hidden mb-3'>
                    <img src={video?.thumbnail} alt={video?.title} className='w-full h-full object-cover rounded-md mb-2 group-hover:scale-110 transition-all' />
                    {/* Duration */}
                    <div className='absolute bottom-1 right-1 bg-[rgba(0,0,0,.7)] py-1 px-1.5 rounded-md'>
                        <p className='text-xs text-white'>{formatDuration(video?.duration)}</p>
                    </div>
                    {/* Overlay */}
                    <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-all duration-300 top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
                        {/* <BsPlayFill size={64} fill='white' /> */}
                    </div>
                </div>
                <div className='flex gap-2 items-center'>
                    <img src={video?.mainArtist?.thumbnail} alt={video?.mainArtist?.name} className='w-10 h-10 object-cover rounded-full' />
                    <div className='flex-1'>
                        <h4 className='text-sm font-semibold'>{video?.title}</h4>
                        {video?.artists?.map((artist, i) => (
                            <NavLink className='text-xs text-gray-500' to={`/artist/${artist?.id}`} key={artist?.id}>
                                {artist?.name + (i < video?.artists?.length - 1 ? ', ' : '')}
                            </NavLink>
                        ))}
                    </div>
                </div>
            </NavLink>
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

export default VideoCard