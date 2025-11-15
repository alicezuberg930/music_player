import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useSearchParams } from 'react-router-dom'
import { searchTypeAction } from '../store/actions/music_actions'
import { useEffect } from 'react'
import { formatDuration } from '../utils/utils'
import { icons } from '@/lib/icons'
import VideoCard from '@/sections/VideoCard'

const SearchMVPage = () => {
    const { BsPlayFill } = icons
    const { searchTypeData } = useSelector(state => state.music)
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')

    useEffect(() => {
        if (q.length > 0) dispatch(searchTypeAction(q, 'video'))
    }, [q, dispatch])

    return (
        <div className='w-full'>
            <h3 className='text-xl font-bold mb-4'>MV</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8'>
                {searchTypeData && searchTypeData?.items?.map(video => (
                    <VideoCard video={video} key={video?.encodeId} />
                ))}
            </div>
        </div>
    )
}

export default SearchMVPage