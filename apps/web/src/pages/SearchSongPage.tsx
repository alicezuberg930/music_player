import { useDispatch } from 'react-redux'
import SongList from '../sections/SongList'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Song } from '@/@types/song'

const SearchSongPage = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')
    const [songs, setSongs] = useState<Song[]>([])

    useEffect(() => {
        setSongs([])
    }, [q, dispatch])

    return (
        <div className='w-full'>
            <h3 className='text-xl font-bold mb-4'>Bài hát</h3>
            <SongList songs={songs} showHeader={false} />
        </div>
    )
}

export default SearchSongPage