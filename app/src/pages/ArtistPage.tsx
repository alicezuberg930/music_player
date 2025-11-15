import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getArtist } from '../services/api.service'
import { toast } from 'react-toastify'
import { icons } from '../utils/icons'
import SongItem from '../sections/SongItem'
import PlaylistSection from '../sections/PlaylistSection'
import ArtistCard from '../sections/ArtistCard'
import MVSection from '../sections/MVSection'
import { useSelector } from 'react-redux'

const ArtistPage = () => {
    const { AiOutlineUserAdd, BsPlayFill } = icons
    const { name } = useParams()
    const [artist, setArtist] = useState(null)
    const ref = useRef()
    const { screenWidth } = useSelector(state => state.app)
    let displayAmount = 5
    if (screenWidth < 1024) displayAmount = 4
    if (screenWidth < 768) displayAmount = 3
    if (screenWidth < 640) displayAmount = 2
    if (screenWidth < 475) displayAmount = 1

    const fetchArtist = async () => {
        try {
            const response = await getArtist(name)
            if (response.err === 0) setArtist(response.data)
            else toast.warn(response.msg)
        } catch (error) {
            toast.warn(error)
        }
    }

    useEffect(() => {
        fetchArtist()
        // ref.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
    }, [name])

    return (
        <div className='flex flex-col w-full'>
            <div ref={ref} className='h-[300px] relative -mx-2 md:-mx-6 -mt-20'>
                <div className='absolute w-full h-full bg-no-repeat bg-cover bg-center blur-xl' style={{ backgroundImage: `url(${artist?.thumbnailM})` }}></div>
                <div className='px-2 sm:px-10 absolute w-full h-full bg-[#291547b3] text-white'>
                    <div className='absolute bottom-0 pb-6 flex flex-col sm:flex-row gap-4'>
                        <img src={artist?.thumbnail} alt={artist?.thumbnail} className='h-32 w-32 rounded-full' />
                        <div>
                            <div className='flex items-center gap-8 mb-4'>
                                <h1 className='text-3xl md:text-6xl font-bold'>{artist?.name}</h1>
                                <span className='p-2 text-main-500 hover:bg-main-200 cursor-pointer rounded-full bg-white'>
                                    <BsPlayFill size={36} />
                                </span>
                            </div>
                            <div className='flex items-center gap-4'>
                                <span className='text-sm text-gray-300'>
                                    {(+artist?.totalFollow).toLocaleString()} người quan tâm
                                </span>
                                <button className='bg-main-500 text-white px-4 py-2 text-sm rounded-full flex items-center justify-center gap-1'>
                                    <span><AiOutlineUserAdd /></span>
                                    <span className='text-xs'>QUAN TÂM</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-12 flex flex-col sm:flex-row gap-4'>
                {artist?.topAlbum &&
                    <div className='w-full sm:w-1/3'>
                        <h3 className='mb-5 text-lg font-bold'>Mới nhất</h3>
                        <div className='p-2 sm:p-4 bg-[#C4CDCC] rounded-md flex gap-4'>
                            <img src={artist?.topAlbum?.thumbnail} alt='thumbnail' className='object-cover w-1/3 aspect-square rounded-md' />
                            <div className='flex flex-col text-xs text-black opacity-80 gap-3'>
                                <span>{artist?.topAlbum?.textType}</span>
                                <div>
                                    <span className='text-sm font-bold opacity-100'>{artist?.topAlbum?.title}</span>
                                    <span className='inline-block'>{artist?.topAlbum?.artistsNames}</span>
                                </div>
                                <span>{artist?.topAlbum?.releaseDate}</span>
                            </div>
                        </div>
                    </div>
                }
                <div className='w-full sm:w-2/3'>
                    <h3 className='mb-5 text-lg font-bold'>Bài hát nổi bật</h3>
                    <div className=''>
                        <div className='grid md:grid-cols-1 xl:grid-cols-2 w-full gap-x-8'>
                            {
                                artist?.sections?.find(i => i.sectionType === 'song')?.items?.slice(0, 6).map(item => {
                                    return (
                                        <div key={item?.encodeId} className='border-b border-gray-400'>
                                            <SongItem song={item} imgSize='sm' />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full'>
                {artist?.sections?.filter(i => i.sectionType === 'playlist')?.map(playlists => (
                    <PlaylistSection key={playlists?.title} playlists={playlists} />
                ))}
            </div>
            <div className='w-full'>
                <MVSection videos={artist?.sections?.find(i => i.sectionType === 'video')} />
            </div>
            <div className='mt-12'>
                <h3 className='text-lg font-bold mb-4'>Có thể bạn sẽ thích</h3>
                <div className='flex -mx-2'>
                    {
                        artist?.sections?.find(i => i.sectionType === 'artist')?.items?.slice(0, displayAmount).map(artist => {
                            return (
                                <ArtistCard visibleSlides={displayAmount} artist={artist} key={artist?.id} />
                            )
                        })
                    }
                </div>
            </div>
            <div className='mt-12'>
                <h3 className='text-lg font-bold mb-5'>Về {artist?.name}</h3>
                <div className='flex gap-8 flex-col sm:flex-row'>
                    <div className='w-full sm:w-2/5 h-auto'>
                        <img src={artist?.thumbnailM} className='flex-auto object-cover rounded-md' />
                    </div>
                    <div className='w-full sm:w-3/5 flex-auto flex flex-col gap-8 text-xs'>
                        <p className='text-sm font-semibold text-gray-500' dangerouslySetInnerHTML={{ __html: artist?.biography || 'No description' }}></p>
                        <div>
                            <span className='font-bold text-xl text-gray-700'>{(+artist?.follow).toLocaleString()}</span>
                            <span className='block text-gray-500'>người quan tâm</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArtistPage