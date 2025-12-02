import { useIsMobile } from "@/hooks/useMobile"
import PlaylistCard from "./PlaylistCard"
import type { Playlist } from "@/@types/playlist"
import { Typography } from "@/components/ui/typography"

type Props = {
    playlists: Playlist[]
}

const PlaylistSection: React.FC<Props> = ({ playlists }) => {
    const isMobile = useIsMobile()
    let displayAmount = isMobile ? 2 : 5

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
                <Typography variant={'h5'}>Danh sách phát</Typography>
                <span className="text-xs uppercase">Tất cả</span>
            </div>
            <div className="-mx-3 flex items-start justify-start">
                {playlists?.slice(0, displayAmount).map(item => (
                    <PlaylistCard item={item} visibleSlides={displayAmount} key={item?.id} />
                ))}
            </div>
        </div>
    )
}

export default PlaylistSection