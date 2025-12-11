import { useIsMobile } from "@/hooks/useMobile"
import PlaylistCard from "../PlaylistCard"
import type { Playlist } from "@/@types/playlist"
import { Typography } from "@yukikaze/ui/typography"
import { useLocales } from "@/lib/locales"

type Props = {
    playlists: Playlist[]
}

const PlaylistSection: React.FC<Props> = ({ playlists }) => {
    const isMobile = useIsMobile()
    const { translate } = useLocales()
    let displayAmount = isMobile ? 2 : 5

    return (
        <section className="mt-12">
            <div className="flex items-center justify-between mb-5">
                <Typography variant={'h5'}>{translate('playlist')}</Typography>
                <span className="text-xs uppercase">{translate('all')}</span>
            </div>
            <div className="-mx-3 flex items-start justify-start">
                {playlists?.slice(0, displayAmount).map(playlist => (
                    <PlaylistCard playlist={playlist} visibleSlides={displayAmount} key={playlist?.id} />
                ))}
            </div>
        </section>
    )
}

export default PlaylistSection