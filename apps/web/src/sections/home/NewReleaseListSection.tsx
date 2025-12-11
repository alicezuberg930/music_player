import { useMemo, useState } from "react"
import SongItem from "../SongItem"
import type { Song } from "@/@types/song"
import { Button } from "@yukikaze/ui/button"
import { Typography } from "@yukikaze/ui/typography"
import { useLocales } from "@/lib/locales"

type Props = {
    songs: Song[]
}

const NewReleaseListSection: React.FC<Props> = ({ songs }) => {
    const [type, setType] = useState(-1)
    const { translate } = useLocales()

    const memoizedSongs = useMemo(() => {
        if (type === -1) return songs //all
        if (type === 0) return songs //international
        if (type === 1) return songs //vpop
        return songs
    }, [type, songs])

    return (
        <section className="mt-12">
            <div className="flex items-center justify-between mb-3">
                <Typography variant={'h5'}>{translate('new_songs')}</Typography>
                <span className="text-xs uppercase">{translate('all')}</span>
            </div>
            <div className="flex items-center gap-4">
                <Button onClick={() => setType(-1)} variant={type === -1 ? 'default' : 'secondary'} className='text-xs'>
                    {translate('all')}
                </Button>
                <Button onClick={() => setType(0)} variant={type === 0 ? 'default' : 'secondary'} className='text-xs'>
                    {translate('international')}
                </Button>
                <Button onClick={() => setType(1)} variant={type === 1 ? 'default' : 'secondary'} className='text-xs'>
                    {translate('vietnam')}
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
        </section >
    )
}

export default NewReleaseListSection