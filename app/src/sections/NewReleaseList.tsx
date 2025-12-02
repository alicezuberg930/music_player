import { useMemo, useState } from "react"
import SongItem from "./SongItem"
import type { Song } from "@/@types/song"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

type Props = {
    songs: Song[]
}

const NewReleaseList: React.FC<Props> = ({ songs }) => {
    const [type, setType] = useState(-1)

    const memoizedSongs = useMemo(() => {
        if (type === -1) return songs //all
        if (type === 0) return songs //international
        if (type === 1) return songs //vpop
        return songs
    }, [type, songs])

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
                {memoizedSongs.length > 0 ? (
                    <div className="flex flex-wrap">
                        {[0, 1, 2].map((col) => (
                            <div key={col} className="w-full md:w-1/2 xl:w-1/3">
                                {memoizedSongs.slice(col * 3, (col + 1) * 3).map(item => (
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