import { useIsMobile } from '@/hooks/useMobile'

const PlaylistListShimmer: React.FC = () => {
    const isMobile = useIsMobile()
    const visibleSlides = isMobile ? 2 : 5

    return (
        <div className="flex flex-wrap -mx-3">
            {Array.from({ length: visibleSlides }).map((_, index) => (
                <div key={index} className="w-1/2 sm:w-1/5 px-3 mb-6">
                    <div className="animate-pulse">
                        {/* Playlist image placeholder */}
                        <div className="aspect-square bg-foreground/10 rounded-lg mb-3"></div>

                        {/* Playlist title placeholder */}
                        <div className="h-4 bg-foreground/10 rounded mb-2"></div>

                        {/* Playlist description/info placeholder */}
                        <div className="h-3 bg-foreground/10 rounded w-3/4"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PlaylistListShimmer