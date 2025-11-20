import PlaylistCard from "./PlaylistCard"
import type { Playlist } from "@/@types/playlist"

type Props = {
    playlists: Playlist[]
}

const PlaylistSection = ({ playlists }: Props) => {
    let displayAmount = 5

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold">{"playlist title"}</h3>
                <span className="text-xs uppercase">Tất cả</span>
            </div>
            <div className="-mx-3 flex items-start justify-start">
                {
                    playlists?.slice(0, displayAmount).map(item => {
                        return (
                            <PlaylistCard item={item} visibleSlides={displayAmount} key={item?.id} />
                        )
                    })
                }
            </div>
        </div>
    )
}
export default PlaylistSection