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

            {/* Chart Section Shimmer */}
            <section className='mt-12 relative h-[700px] md:h-[600px] animate-pulse'>
                <div className='z-10 absolute top-0 bottom-0 w-full bg-linear-to-t from-[#33104cf2] to-[#33104cf2] rounded-lg'></div>
                <div className='z-20 absolute top-0 bottom-0 w-full flex flex-col gap-4 p-2 lg:p-4'>
                    {/* Title skeleton */}
                    <div className='flex gap-2 items-center'>
                        <div className='h-8 w-48 bg-white/20 rounded-md'></div>
                    </div>

                    <div className='flex lg:flex-row flex-col gap-4 h-full'>
                        {/* Song list skeleton */}
                        <div className='flex-3 flex flex-col gap-3'>
                            {[1, 2, 3].map((index) => (
                                <div
                                    key={index}
                                    className='flex items-center gap-3 p-3 bg-[#ffffff12] rounded-md'
                                >
                                    {/* Order number */}
                                    <div className='w-8 h-8 bg-white/20 rounded shrink-0'></div>

                                    {/* Image */}
                                    <div className='w-16 h-16 bg-white/20 rounded shrink-0'></div>

                                    {/* Song info */}
                                    <div className='flex-1 min-w-0'>
                                        <div className='h-4 bg-white/20 rounded w-3/4 mb-2'></div>
                                        <div className='h-3 bg-white/20 rounded w-1/2'></div>
                                    </div>

                                    {/* Percentage */}
                                    <div className='w-12 h-6 bg-white/20 rounded shrink-0'></div>
                                </div>
                            ))}

                            {/* Button skeleton */}
                            <div className='w-32 h-8 mx-auto bg-white/20 rounded-2xl'></div>
                        </div>

                        {/* Chart skeleton */}
                        <div className='flex-7 h-full relative w-full max-w-full flex flex-col'>
                            {/* Legend skeleton */}
                            <div className='flex gap-4 justify-center mb-4'>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className='flex items-center gap-2'>
                                        <div className='w-8 h-0.5 bg-white/20'></div>
                                        <div className='h-4 w-24 bg-white/20 rounded'></div>
                                    </div>
                                ))}
                            </div>

                            {/* Chart area */}
                            <div className='flex-1 bg-white/5 rounded-lg relative overflow-hidden'>
                                {/* Grid lines skeleton */}
                                <div className='absolute inset-0 flex flex-col justify-between p-4'>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className='h-px bg-white/10'></div>
                                    ))}
                                </div>

                                {/* X-axis labels skeleton */}
                                <div className='absolute bottom-2 left-0 right-0 flex justify-between px-4'>
                                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                        <div key={i} className='h-3 w-10 bg-white/20 rounded'></div>
                                    ))}
                                </div>

                                {/* Animated shimmer effect */}
                                <div className='absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent shimmer'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HomeShimmer