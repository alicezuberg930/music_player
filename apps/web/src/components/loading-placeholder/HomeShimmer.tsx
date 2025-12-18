import { useIsMobile } from "@/hooks/useMobile"

const HomeShimmer: React.FC = () => {
    const isMobile = useIsMobile()
    const bannerCount = isMobile ? 2 : 3
    const playlistCount = isMobile ? 2 : 5
    const artistCount = isMobile ? 2 : 5

    return (
        <div className="animate-pulse">
            {/* Banner Slider Shimmer */}
            <div className="w-full mt-12">
                <div className="flex gap-7 relative">
                    {Array.from({ length: bannerCount }).map((_, i) => (
                        <div key={i} className="flex-1 h-[220px] bg-foreground/10 rounded-lg" />
                    ))}
                </div>
            </div>

            {/* New Release List Shimmer */}
            <section className="mt-12">
                <div className="flex items-center justify-between mb-3">
                    <div className="h-7 w-40 bg-foreground/10 rounded" />
                    <div className="h-4 w-16 bg-foreground/10 rounded" />
                </div>
                <div className="flex items-center gap-4 mb-5">
                    <div className="h-9 w-20 bg-foreground/10 rounded" />
                    <div className="h-9 w-32 bg-foreground/10 rounded" />
                    <div className="h-9 w-24 bg-foreground/10 rounded" />
                </div>
                <div className="flex flex-wrap">
                    {[0, 1, 2].map((col) => (
                        <div key={col} className="w-full md:w-1/2 xl:w-1/3">
                            {Array.from({ length: 3 }).map((_, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3">
                                    <div className="w-16 h-16 bg-foreground/10 rounded" />
                                    <div className="flex-1">
                                        <div className="h-4 w-3/4 bg-foreground/10 rounded mb-2" />
                                        <div className="h-3 w-1/2 bg-foreground/10 rounded" />
                                    </div>
                                    <div className="h-4 w-12 bg-foreground/10 rounded" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* Playlist Section Shimmer */}
            <section className="mt-12">
                <div className="flex items-center justify-between mb-5">
                    <div className="h-7 w-32 bg-foreground/10 rounded" />
                    <div className="h-4 w-16 bg-foreground/10 rounded" />
                </div>
                <div className="-mx-3 flex items-start justify-start">
                    {Array.from({ length: playlistCount }).map((_, i) => (
                        <div key={i} className="px-3 flex-1">
                            <div className="aspect-square bg-foreground/10 rounded-lg mb-3" />
                            <div className="h-4 w-full bg-foreground/10 rounded mb-2" />
                            <div className="h-3 w-3/4 bg-foreground/10 rounded" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Artist Section Shimmer */}
            <section className="mt-12">
                <div className="flex items-center justify-between mb-5">
                    <div className="h-7 w-48 bg-foreground/10 rounded" />
                    <div className="h-4 w-16 bg-foreground/10 rounded" />
                </div>
                <div className="-mx-3 flex items-start justify-start">
                    {Array.from({ length: artistCount }).map((_, i) => (
                        <div key={i} className="px-3 flex-1">
                            <div className="aspect-square bg-foreground/10 rounded-full mb-3" />
                            <div className="h-4 w-full bg-foreground/10 rounded mb-2" />
                            <div className="h-3 w-2/3 bg-foreground/10 rounded mx-auto" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default HomeShimmer