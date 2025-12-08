import { roundPeopleAmount } from '@/lib/utils'
import SongItem from '../sections/SongItem'
import SongCard from '../sections/SongCard'
import PlaylistCard from '../sections/PlaylistCard'
import ArtistCard from '../sections/ArtistCard'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'

const SearchAllPage = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')
    const searchData: any = {}

    useEffect(() => {
        // if (q) dispatch(searchMultiAction(q))
    }, [q, dispatch])

    return (
        <div className='w-full'>
            {searchData?.top && (
                <div className='w-full'>
                    <h3 className='text-xl font-bold mb-4'>Nổi bật</h3>
                    <div className='flex gap-8 mb-7'>
                        {searchData?.top && (
                            <div className='flex-1 p-2 flex gap-8 items-center bg-main-200 rounded-md'>
                                <img src={searchData?.top?.thumbnail} className='w-20 h-20 object-cover rounded-full' alt='avatar' />
                                <div className='flex flex-col text-xs'>
                                    <span className='mb-1'>{searchData?.top?.objectType === 'artist' ? 'Nghệ sĩ' : ''}</span>
                                    <span className='text-sm font-semibold'>{searchData?.top?.title || searchData?.top?.name}</span>
                                    {searchData?.top?.objectType === 'artist' && (
                                        <span>{roundPeopleAmount(searchData?.artists[0]?.totalFollow)} quan tâm</span>
                                    )}
                                </div>
                            </div>
                        )}
                        {searchData?.songs?.slice(0, 2).map((song: any) => (
                            <div className='flex-1 h-full bg-main-200 rounded-md' key={song?.encodeId}>
                                <SongItem song={song} imgSize='xl' />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {searchData?.songs && (
                <div className='w-full'>
                    <h3 className='text-lg font-bold mb-4'>Bài hát</h3>
                    <div className='grid grid-cols-2 gap-x-5 mb-7'>
                        {searchData?.songs?.slice(0, 6).map((song: any) => (
                            <SongCard
                                key={song.encodeId}
                                song={song}
                                playlistTitle='Kết quả tìm kiếm'
                                hideAlbum={true}
                            />
                        ))}
                    </div>
                </div>
            )}
            {searchData?.playlists && (
                <div className='w-full'>
                    <h3 className='text-lg font-bold mb-4'>Playlist/Album</h3>
                    <div className='flex justify-start mb-7 -mx-3'>
                        {searchData?.playlists?.slice(0, 5).map((playlist: any) => (
                            <PlaylistCard playlist={playlist} key={playlist?.encodeId} />
                        ))}
                    </div>
                </div>
            )}
            {searchData?.artists && (
                <div className='w-full'>
                    <h3 className='text-lg font-bold mb-4'>Nghệ sĩ</h3>
                    <div className='flex gap-6 mb-7'>
                        {searchData?.artists?.slice(0, 5).map((artist: any) => (
                            <ArtistCard artist={artist} key={artist?.id} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchAllPage