import { memo } from "react"
import { roundPeopleAmount } from "@/lib/utils"
import { Link } from "react-router-dom"
import type { Artist } from "@/@types/artist"
import { UserRoundPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LazyLoadImage } from "react-lazy-load-image-component"

type Props = {
    artist: Omit<Artist, 'recommendedArtists' | 'songs' | 'topAlbum' | 'playlists' | 'videos'>
    visibleSlides?: number
}

const ArtistCard = ({ artist, visibleSlides = 5 }: Props) => {
    return (
        <div className="space-x-3 text-center flex flex-col items-center gap-3 px-2" style={{ width: `${100 / visibleSlides}%` }}>
            <Link className="w-full h-full relative aspect-square rounded-full overflow-hidden group" to={`/artist/${artist.id}`}>
                <LazyLoadImage
                    src={artist.thumbnail} alt={artist.name}
                    effect="blur" wrapperClassName="w-full"
                    className="group-hover:animate-scale-up-center object-cover w-full"
                />
                <div className="absolute left-0 right-0 top-0 bottom-0 z-30 group-hover:bg-overlay"></div>
            </Link>
            <div className="flex flex-col items-center">
                <span className="text-sm font-medium hover:underline hover:text-main-500">{artist.name}</span>
                <span className="text-xs opacity-70">{roundPeopleAmount(artist.totalFollow)} quan tâm</span>
            </div>
            <Button className="rounded-full">
                <UserRoundPlus size={14} />
                <span className="text-xs">QUAN TÂM</span>
            </Button>
        </div>
    )
}

export default memo(ArtistCard)