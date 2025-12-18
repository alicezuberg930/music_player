import SongList from '../sections/SongList'
import { useSearchParams } from 'react-router-dom'
import { useApi } from '@/hooks/useApi'
import { SongListShimmer } from '@/components/loading-placeholder'

const SearchSongPage = () => {
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')
    const { data: songData, isLoading } = useApi().useSongList({ search: q || '', page: 1, limit: 10 })
    console.log('search song render')
    return (
        <div className='w-full'>
            <h3 className='text-xl font-bold mb-4'>Bài hát</h3>
            {isLoading ? <SongListShimmer /> : songData?.data && <SongList songs={songData.data} showHeader={false} />}
        </div>
    )
}

export default SearchSongPage