import { useEffect, useState } from "react"
import SongItem from "./SongItem"
import type { Song } from "@/@types/song"
import { fetchSongList } from "@/lib/http.client"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

const NewReleaseList: React.FC = () => {
    const [type, setType] = useState(-1)
    const [songs, setSongs] = useState<Song[]>([])

    const setNewReleaseSongs = async () => {
        try {
            const response = await fetchSongList()
            setSongs(response.data || [])
        } catch (error) {

        }
        // if (type === -1) setSongs(newRelease?.items?.all || [])
        // if (type === 0) setSongs(newRelease?.items?.others || [])
        // if (type === 1) setSongs(newRelease?.items?.vPop || [])
    }

    useEffect(() => {
        setNewReleaseSongs()
    }, [])

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-3">
                <Typography variant={'h5'}>Các bài hát mới</Typography>
                <span className="text-xs uppercase">Tất cả</span>
            </div>
            <div className="flex items-center gap-4">
                <Button onClick={() => setType(-1)} variant={type === -1 ? 'default' : 'secondary'} className='text-xs'>
                    Tất cả
                </Button>
                <Button onClick={() => setType(0)} variant={type === 0 ? 'default' : 'secondary'} className='text-xs'>
                    Quốc tế
                </Button>
                <Button onClick={() => setType(1)} variant={type === 1 ? 'default' : 'secondary'} className='text-xs'>
                    Việt nam
                </Button>
            </div>
            <div className="mt-5">
                {songs.length > 0 ? (
                    <div className="flex flex-wrap">
                        {[0, 1, 2].map((col) => (
                            <div key={col} className="w-full md:w-1/2 xl:w-1/3">
                                {songs.slice(col * 3, (col + 1) * 3).map(item => (
                                    <SongItem key={item.id} song={item} imgSize="lg" showTime={true} />
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <>loading</>
                )}
            </div>
        </div >
    )
}

export default NewReleaseList