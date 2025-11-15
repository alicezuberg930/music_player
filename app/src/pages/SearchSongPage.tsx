import { useDispatch, useSelector } from 'react-redux'
import SongList from '../sections/SongList'
import { useSearchParams } from 'react-router-dom'
import { searchTypeAction } from '../store/actions/music_actions'
import { useEffect } from 'react'

const SearchSongPage = () => {
    const { searchTypeData } = useSelector(state => state.music)
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')

    useEffect(() => {
        if (q.length > 0) dispatch(searchTypeAction(q, 'song'))
    }, [q, dispatch])

    return (
        <div className='w-full'>
            <h3 className='text-xl font-bold mb-4'>Bài hát</h3>
            <SongList songs={searchTypeData?.items} showHeader={false} />
        </div>
    )
}

export default SearchSongPage