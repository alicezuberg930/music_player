import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { searchTypeAction } from '../store/actions/music_actions'
import { useEffect } from 'react'
import PlaylistCard from '@/sections/PlaylistCard'

const SearchPlaylistPage = () => {
    const { searchTypeData } = useSelector(state => state.music)
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')

    useEffect(() => {
        if (q.length > 0) dispatch(searchTypeAction(q, 'playlist'))
    }, [q, dispatch])

    return (
        <div className='w-full'>
            <h3 className='text-xl font-bold mb-4'>Danh sách phát/album</h3>
            <div className='flex flex-wrap -mx-2'>
                {searchTypeData && searchTypeData.items?.map(playlist => (
                    <PlaylistCard item={playlist} key={playlist?.encodeId} sectionId='h100' isSearch={true} />
                ))}
            </div>
        </div>
    )
}

export default SearchPlaylistPage