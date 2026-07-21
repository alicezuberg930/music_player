import { useDispatch } from 'react-redux'
import { useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import VideoCard from '@/layout/video-card'
import { Typography } from '@yukikaze/ui/typography'
import { useLocales } from '@/lib/locales'

const SearchMVPage = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const q = new URLSearchParams(location.search).get('q')
    const searchTypeData: any = {}
    const { translate } = useLocales()
    
    useEffect(() => {
    }, [q, dispatch])

    return (
        <div className='w-full'>
            <Typography variant={'h5'}>{translate('MV')}</Typography>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8'>
                {searchTypeData?.items?.map((video: any) => (
                    <VideoCard video={video} key={video?.encodeId} />
                ))}
            </div>
        </div>
    )
}

export default SearchMVPage
