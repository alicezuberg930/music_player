type Props = {
    showHeader?: boolean
    count?: number
}

const SongListShimmer: React.FC<Props> = ({ showHeader = true, count = 10 }) => {
    return (
        <div className="w-full flex flex-col animate-pulse">
            {showHeader && (
                <div className="font-bold flex items-center justify-between p-2">
                    <div className="w-[45%]">
                        <div className="h-4 w-20 bg-foreground/10 rounded" />
                    </div>
                    <div className="w-[45%]">
                        <div className="h-4 w-16 bg-foreground/10 rounded" />
                    </div>
                    <div className="w-[10%] flex justify-end">
                        <div className="h-4 w-24 bg-foreground/10 rounded" />
                    </div>
                </div>
            )}
            <div className="flex flex-col">
                {Array.from({ length: count }).map((_, index) => (
                    <div 
                        key={index} 
                        className="flex justify-between items-center p-2 border-t border-[#0000000d]"
                    >
                        <div className="flex w-[45%] items-center justify-start gap-2">
                            <div className="w-4 h-4 bg-foreground/10 rounded" />
                            <div className="w-10 h-10 bg-foreground/10 rounded-md" />
                            <div className="flex flex-col gap-2 w-3/4">
                                <div className="h-4 w-3/4 bg-foreground/10 rounded" />
                                <div className="h-3 w-1/2 bg-foreground/10 rounded" />
                            </div>
                        </div>
                        <div className="w-[45%]">
                            <div className="h-4 w-1/2 bg-foreground/10 rounded" />
                        </div>
                        <div className="w-[10%] flex justify-end">
                            <div className="h-4 w-12 bg-foreground/10 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SongListShimmer
