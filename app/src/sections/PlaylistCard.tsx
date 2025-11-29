import { Link, useNavigate } from "react-router-dom"
import type { Playlist } from "@/@types/playlist"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { Ellipsis, Heart, Play } from "lucide-react"
import { Typography } from "@/components/ui/typography"

type Props = {
    item: Playlist
    sectionId?: string
    isSearch?: boolean
    visibleSlides?: number
}

const PlaylistCard: React.FC<Props> = ({ item, sectionId, isSearch, visibleSlides = 5 }) => {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(`/playlist/${item.id}`)}
            className={`flex flex-col gap-3 cursor-pointer px-3 ${isSearch ? 'mb-5' : ''}`}
            style={{ width: `${100 / visibleSlides}%`, flex: '0 0 auto' }}
        >
            <div className="relative w-full group overflow-hidden rounded-lg bg-main-200">
                <div className="z-1 text-white absolute w-full h-full gap-3 bg-overlay invisible group-hover:visible flex items-center justify-center">
                    <Heart />
                    <Link to={`/playlist/${item.id}`} state={{ playAlbum: true }}>
                        <Play size={48} className="p-1 border border-white rounded-full" />
                    </Link>
                    <Ellipsis />
                </div>
                <LazyLoadImage
                    src={item?.thumbnail} alt={item?.id}
                    className="group-hover:animate-scale-up-center aspect-square"
                />
            </div>
            <div>
                <Typography className="font-semibold line-clamp-1">{item?.title}</Typography>
                <span className="line-clamp-2">{sectionId && sectionId === "h100" ? item?.artistNames : item?.description}</span>
            </div>
        </div>
    )
}

export default PlaylistCard