import { useEffect, useState } from "react"
import SongCard from "./SongCard"
import { useNavigate } from "react-router-dom"
import type { Song } from "@/@types/song"

type Props = {
    songs: Song[]
    hideAlbum?: boolean
    initialAmount: number
    link?: string
}

const RankListCard = ({ songs, hideAlbum, initialAmount, link }: Props) => {
    const [isShowAll, setIsShowAll] = useState(false)
    const [currentSongs, setCurrentSongs] = useState<any[] | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (isShowAll) {
            setCurrentSongs(songs)
        } else {
            setCurrentSongs(songs?.slice(0, initialAmount))
        }
    }, [isShowAll, songs])

    return (
        <div className="w-full">
            {
                currentSongs?.map((item, i) => {
                    return (
                        <SongCard key={item.encodeId} song={item} hideAlbum={hideAlbum} songs={songs} order={i + 1} />
                    )
                })
            }
            {
                initialAmount < Infinity &&
                <div className="mx-auto my-4 w-fit">
                    <button onClick={() => link ? navigate(link.split('.')[0]) : setIsShowAll(!isShowAll)}
                        className="hover:bg-main-200 bg-transparent text-main-500 border border-[#0e8080] rounded-3xl py-2 px-5 text-sm font-semibold"
                    >
                        {isShowAll ? 'Ẩn bớt' : 'Xem tất cả'}
                    </button>
                </div>
            }
        </div>
    )
}

export default RankListCard