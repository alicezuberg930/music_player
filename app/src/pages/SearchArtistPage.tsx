import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import React from 'react'
import ArtistCard from '../sections/ArtistCard'
import type { Artist } from '@/@types/artist'

const SearchArtistPage = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')
    const [artists, setArtists] = React.useState<Artist[]>([])

    React.useEffect(() => {
        setArtists([])
        // if (q) dispatch(searchTypeAction(q, 'artist'))
    }, [q, dispatch])

    return (
        <div className='w-full'>
            <h3 className='text-xl font-bold mb-4'>Tác giả</h3>
            <div className='flex flex-wrap -mx-2'>
                {artists && artists.map(artist => (
                    <ArtistCard artist={artist} key={artist?.id} />
                ))}
            </div>
        </div>
    )
}

export default SearchArtistPage