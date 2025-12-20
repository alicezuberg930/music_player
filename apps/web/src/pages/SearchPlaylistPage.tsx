import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PlaylistCard from '@/sections/PlaylistCard'
import type { Playlist } from '@/@types/playlist'
import { Typography } from '@yukikaze/ui/typography'
import { useLocales } from '@/lib/locales'

const SearchPlaylistPage = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')
    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const { translate } = useLocales()

    useEffect(() => {
        setPlaylists([])
    }, [q, dispatch])

    return (
        <div className='w-full'>
            <Typography variant={'h5'}>{translate('playlist')}</Typography>
            <div className='flex flex-wrap -mx-2'>
                {playlists?.map(playlist => (
                    <PlaylistCard playlist={playlist} key={playlist?.id} sectionId='h100' isSearch={true} />
                ))}
            </div>
        </div>
    )
}

export default SearchPlaylistPage