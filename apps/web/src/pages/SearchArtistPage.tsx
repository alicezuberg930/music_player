import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import React from 'react'
import ArtistCard from '../sections/ArtistCard'
import type { Artist } from '@/@types/artist'
import { Typography } from '@yukikaze/ui/typography'
import { useLocales } from '@/lib/locales'

const SearchArtistPage = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')
    const [artists, setArtists] = React.useState<Artist[]>([])
    const { translate } = useLocales()

    React.useEffect(() => {
        setArtists([])
    }, [q, dispatch])

    return (
        <div className='w-full'>
            <Typography variant={'h5'}>{translate('artist')}</Typography>
            <div className='flex flex-wrap -mx-2'>
                {artists.map(artist => (
                    <ArtistCard artist={artist} key={artist?.id} />
                ))}
            </div>
        </div>
    )
}

export default SearchArtistPage