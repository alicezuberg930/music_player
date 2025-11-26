import { useNavigate } from "react-router-dom"
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

    const navigateAndPlayAlbum = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.stopPropagation()
        navigate(`/playlist/${item.id}`, { state: { playAlbum: true } })
    }

    return (
        <div
            className={`flex flex-col gap-3 cursor-pointer px-3 ${isSearch ? 'mb-5' : ''}`}
            style={{ width: `${100 / visibleSlides}%`, flex: '0 0 auto' }}
        >
            <div className="relative w-full group overflow-hidden rounded-lg bg-main-200">
                <div className="text-white absolute w-full h-full gap-3 bg-overlay z-20 invisible group-hover:visible flex items-center justify-center">
                    <Heart />
                    <Play size={48} className="p-1 border border-white rounded-full" onClick={navigateAndPlayAlbum} />
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