const PlaylistDetailsShimmer: React.FC = () => {
    const isMobile = false;
    const artistCount = isMobile ? 2 : 5;

    return (
        <>
            <section className="flex flex-col md:flex-row gap-6 mt-10 animate-pulse">
                <div className="w-full md:w-1/4 h-fit space-y-3 relative md:sticky top-10 self-start shrink-0">
                    <div className="relative">
                        <div className={`w-full aspect-square rounded-lg bg-foreground/10`}></div>
                        <div className="rounded-md text-white absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center">
                            <div className={`w-12 h-12 rounded-full bg-foreground/10`}></div>
                        </div>
                    </div>
                    <div className={`h-6 w-3/4 mx-auto rounded bg-foreground/10`}></div>
                    <div className="flex flex-col items-center gap-2 text-gray-700 text-xs">
                        <div className={`h-4 w-1/2 rounded bg-foreground/10`}></div>
                        <div className={`h-4 w-1/3 rounded bg-foreground/10`}></div>
                        <div className={`h-4 w-1/4 rounded bg-foreground/10`}></div>
                    </div>
                </div>
                <div className="flex-1 mt-10">
                    <div className="text-sm mb-4">
                        <span className="text-gray-700">Lời tựa: </span>
                        <span className={`inline-block h-4 w-2/3 rounded bg-foreground/10`}></span>
                    </div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-md bg-foreground/10`}></div>
                                <div className="flex-1">
                                    <div className={`h-4 w-1/2 mb-2 rounded bg-foreground/10`}></div>
                                    <div className={`h-3 w-1/3 rounded bg-foreground/10`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Artist Section Shimmer */}
            <section className="mt-12">
                <div className="mb-5">
                    <div className="h-4 w-1/3 bg-foreground/10 rounded" />
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
        </>
    );
};

export default PlaylistDetailsShimmer;
