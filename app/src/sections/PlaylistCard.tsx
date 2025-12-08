import { Link, useNavigate } from "react-router-dom"
import type { Playlist } from "@/@types/playlist"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { Ellipsis, Heart, PlayCircle } from "lucide-react"
import { Typography } from "@/components/ui/typography"
import { useAddFavoritePlaylist, useRemoveFavoritePlaylist } from "@/hooks/useApi"

type Props = {
    playlist: Playlist
    sectionId?: string
    isSearch?: boolean
    visibleSlides?: number
}

const PlaylistCard: React.FC<Props> = ({ playlist, sectionId, isSearch, visibleSlides = 5 }) => {
    const removeFavoritePlaylistMutation = useRemoveFavoritePlaylist()
    const addFavoritePlaylistMutation = useAddFavoritePlaylist()
    const navigate = useNavigate()

    const handleFavorite = (e: React.MouseEvent<SVGSVGElement>) => {
        e.stopPropagation()
        if (playlist.liked) {
            removeFavoritePlaylistMutation.mutate(playlist.id)
        } else {
            addFavoritePlaylistMutation.mutate(playlist.id)
        }
    }

    return (
        <div
            onClick={() => navigate(`/playlist/${playlist.id}`)}
            // to={`/playlist/${playlist.id}`}
            className={`flex flex-col gap-3 cursor-pointer px-3 ${isSearch ? 'mb-5' : ''}`}
            style={{ width: `${100 / visibleSlides}%`, flex: '0 0 auto' }}
        >
            <div className="relative w-full group overflow-hidden rounded-lg bg-main-200 aspect-square">
                <div className="z-1 text-white absolute w-full h-full gap-3 bg-overlay invisible group-hover:visible flex items-center justify-center">
                    <Heart onClick={handleFavorite} className={`${playlist.liked && 'fill-main-500'}`} />
                    <Link to={`/playlist/${playlist.id}`} state={{ playAlbum: true }}>
                        <PlayCircle size={56} />
                    </Link>
                    <Ellipsis />
                </div>
                <LazyLoadImage
                    src={playlist?.thumbnail} alt={playlist?.id}
                    className="group-hover:animate-scale-up-center object-cover w-full h-full"
                />
            </div>
            <div>
                <Typography variant={'span'} className="font-semibold line-clamp-1">{playlist?.title}</Typography>
                <Typography className="line-clamp-2">{sectionId && sectionId === "h100" ? playlist?.artistNames : playlist?.description}</Typography>
            </div>
        </div>
    )
}

export default PlaylistCard