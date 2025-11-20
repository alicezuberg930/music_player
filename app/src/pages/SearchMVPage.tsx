import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import VideoCard from '@/sections/VideoCard'

const SearchMVPage = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')
    const searchTypeData: any = {}
    useEffect(() => {
        // if (q) dispatch(searchTypeAction(q, 'video'))
    }, [q, dispatch])

    return (
        <div className='w-full'>
            <h3 className='text-xl font-bold mb-4'>MV</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8'>
                {searchTypeData && searchTypeData?.items?.map((video: any) => (
                    <VideoCard video={video} key={video?.encodeId} />
                ))}
            </div>
        </div>
    )
}

export default SearchMVPage