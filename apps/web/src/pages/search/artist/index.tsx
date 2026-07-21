import { useDispatch } from 'react-redux'
import { useLocation } from '@tanstack/react-router'
import React from 'react'
import ArtistCard from '@/layout/artist-card'
import type { Artist } from '@/@types'
import { Typography } from '@yukikaze/ui/typography'
import { useLocales } from '@/lib/locales'

const SearchArtistPage = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const q = new URLSearchParams(location.search).get('q')
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
