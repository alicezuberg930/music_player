import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import SongItem from '../sections/SongItem'
import PlaylistSection from '../sections/home/PlaylistSection'
import ArtistCard from '../sections/ArtistCard'
import MVSection from '../sections/MVSection'
import { useMetaTags } from '@/hooks/useMetaTags'
import { getBaseUrl } from '@/lib/utils'
import { PlayCircle, UserPlus } from '@yukikaze/ui/icons'
import { Button } from '@yukikaze/ui/button'
import { useQuery } from '@tanstack/react-query'
import { artistQueries } from '@/lib/queries/artist'

const ArtistPage = () => {
    const { id } = useParams()
    const { data } = useQuery(artistQueries().one.queryOptions(id!))
    const ref = useRef<HTMLDivElement | null>(null)
    const displayAmount = 5

    useMetaTags({
        title: data?.name ? `${data.name} - Yukikaze Music Player` : 'Artist - Yukikaze Music Player',
        description: data?.description || `${data?.name || 'Artist'} - Yukikaze Music Player.`,
        image: data?.thumbnail || `${getBaseUrl()}/web-app-manifest-512x512.png`,
        url: `${getBaseUrl()}/artist/${id}`
    })

    return (
        <div className='flex flex-col w-full'>
            <div ref={ref} className='h-[300px] relative -mx-2 md:-mx-6 -mt-20'>
                <div className='absolute w-full h-full bg-no-repeat bg-cover bg-center blur-xl' style={{ backgroundImage: `url(${data?.thumbnail})` }}></div>
                <div className='px-2 sm:px-10 absolute w-full h-full bg-[#291547b3] text-white'>
                    <div className='absolute bottom-0 pb-6 flex flex-col sm:flex-row gap-4'>
                        <img src={data?.thumbnail} alt={data?.thumbnail} className='h-32 w-32 rounded-full' />
                        <div>
                            <div className='flex items-center gap-8 mb-4'>
                                <h1 className='text-3xl md:text-6xl font-bold'>{data?.name}</h1>
                                <span className='p-2 text-main-500 hover:bg-main-200 cursor-pointer rounded-full bg-white'>
                                    <PlayCircle size={36} />
                                </span>
                            </div>
                            <div className='flex items-center gap-4'>
                                <span className='text-sm text-gray-300'>
                                    {(+(data?.totalFollow ?? 0)).toLocaleString()} người quan tâm
                                </span>
                                <Button className='bg-primary text-white px-4 py-2 text-sm rounded-full flex items-center justify-center gap-1' aria-label="Follow artist">
                                    <UserPlus />
                                    <span className='text-xs'>QUAN TÂM</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-12 flex flex-col sm:flex-row gap-4'>
                {data?.topAlbum &&
                    <div className='w-full sm:w-1/3'>
                        <h3 className='mb-5 text-lg font-bold'>Mới nhất</h3>
                        <div className='p-2 sm:p-4 bg-[#C4CDCC] rounded-md flex gap-4'>
                            <img src={data?.topAlbum?.thumbnail} alt='thumbnail' className='object-cover w-1/3 aspect-square rounded-md' />
                            <div className='flex flex-col text-xs text-black opacity-80 gap-3'>
                                <span>{data?.topAlbum?.title}</span>
                                <div>
                                    <span className='text-sm font-bold opacity-100'>{data?.topAlbum?.title}</span>
                                    <span className='inline-block'>{data?.topAlbum?.artistNames}</span>
                                </div>
                                <span>{data?.topAlbum?.releaseDate}</span>
                            </div>
                        </div>
                    </div>
                }
                <div className='w-full sm:w-2/3'>
                    <h3 className='mb-5 text-lg font-bold'>Bài hát nổi bật</h3>
                    <div className=''>
                        <div className='grid md:grid-cols-1 xl:grid-cols-2 w-full gap-x-8'>
                            {
                                data?.songs?.slice(0, 6).map(song => {
                                    return (
                                        <div key={song?.id} className='border-b border-gray-400'>
                                            <SongItem song={song} imgSize='sm' />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full'>
                {data?.playlists && (<PlaylistSection playlists={data?.playlists} />)}
            </div>
            <div className='w-full'>
                {data?.videos && (<MVSection videos={data.videos} />)}
            </div>
            <div className='mt-12'>
                <h3 className='text-lg font-bold mb-4'>Có thể bạn sẽ thích</h3>
                <div className='flex -mx-2'>
                    {
                        data?.recommendedArtists?.slice(0, displayAmount).map(artist => {
                            return (
                                <ArtistCard visibleSlides={displayAmount} artist={artist} key={artist?.id} />
                            )
                        })
                    }
                </div>
            </div>
            <div className='mt-12'>
                <h3 className='text-lg font-bold mb-5'>Về {data?.name}</h3>
                <div className='flex gap-8 flex-col sm:flex-row'>
                    <div className='w-full sm:w-2/5 h-auto'>
                        <img src={data?.thumbnail} className='flex-auto object-cover rounded-md' alt='' />
                    </div>
                    <div className='w-full sm:w-3/5 flex-auto flex flex-col gap-8 text-xs'>
                        <p className='text-sm font-semibold text-gray-700' dangerouslySetInnerHTML={{ __html: data?.biography || 'No description' }}></p>
                        <div>
                            <span className='font-bold text-xl text-gray-700'>{(+(data?.totalFollow ?? 0)).toLocaleString()}</span>
                            <span className='block text-gray-700'>người quan tâm</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArtistPage