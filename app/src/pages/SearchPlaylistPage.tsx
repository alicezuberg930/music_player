import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PlaylistCard from '@/sections/PlaylistCard'
import type { Playlist } from '@/@types/playlist'

const SearchPlaylistPage = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')
    const [playlists, setPlaylists] = useState<Playlist[]>([])

    useEffect(() => {
        setPlaylists([])
        // if (q) dispatch(searchTypeAction(q, 'playlist'))
    }, [q, dispatch])

    return (
        <div className='w-full'>
            <h3 className='text-xl font-bold mb-4'>Danh sách phát/album</h3>
            <div className='flex flex-wrap -mx-2'>
                {playlists && playlists.map(playlist => (
                    <PlaylistCard item={playlist} key={playlist?.id} sectionId='h100' isSearch={true} />
                ))}
            </div>
        </div>
    )
}

export default SearchPlaylistPage