import { Link } from "react-router-dom"
import type { Playlist } from "@/@types/playlist"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { Ellipsis, Heart, PlayCircle } from "lucide-react"
import { Typography } from "@/components/ui/typography"

type Props = {
    item: Playlist
    sectionId?: string
    isSearch?: boolean
    visibleSlides?: number
}

const PlaylistCard: React.FC<Props> = ({ item, sectionId, isSearch, visibleSlides = 5 }) => {
    return (
        <Link
            suppressHydrationWarning
            to={`/playlist/${item.id}`}
            className={`flex flex-col gap-3 cursor-pointer px-3 ${isSearch ? 'mb-5' : ''}`}
            style={{ width: `${100 / visibleSlides}%`, flex: '0 0 auto' }}
        >
            <div className="relative w-full group overflow-hidden rounded-lg bg-main-200 aspect-square">
                <div className="z-1 text-white absolute w-full h-full gap-3 bg-overlay invisible group-hover:visible flex items-center justify-center">
                    <Heart />
                    <Link to={`/playlist/${item.id}`} state={{ playAlbum: true }}>
                        <PlayCircle size={56} className="" />
                    </Link>
                    <Ellipsis />
                </div>
                <LazyLoadImage
                    src={item?.thumbnail} alt={item?.id}
                    className="group-hover:animate-scale-up-center object-cover w-full h-full"
                />
            </div>
            <div>
                <Typography variant={'span'} className="font-semibold line-clamp-1">{item?.title}</Typography>
                <Typography className="line-clamp-2">{sectionId && sectionId === "h100" ? item?.artistNames : item?.description}</Typography>
            </div>
        </Link>
    )
}

export default PlaylistCard