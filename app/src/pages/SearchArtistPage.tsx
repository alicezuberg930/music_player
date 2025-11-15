import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { searchTypeAction } from '../store/actions/music_actions'
import { useEffect } from 'react'
import ArtistCard from '../sections/ArtistCard'

const SearchArtistPage = () => {
    const { searchTypeData } = useSelector(state => state.music)
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')

    useEffect(() => {
        if (q.length > 0) dispatch(searchTypeAction(q, 'artist'))
    }, [q, dispatch])

    return (
        <div className='w-full'>
            <h3 className='text-xl font-bold mb-4'>Tác giả</h3>
            <div className='flex flex-wrap -mx-2'>
                {searchTypeData && searchTypeData.items && searchTypeData.items?.map(artist => (
                    <ArtistCard artist={artist} key={artist?.id} />
                ))}
            </div>
        </div>
    )
}

export default SearchArtistPage