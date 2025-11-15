import VideoCard from "./VideoCard"

type Props = {
    videos: any[]
}

const MVSection = ({ videos }: Props) => {
    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold">{videos?.title}</h3>
                <span className="text-xs uppercase">Tất cả</span>
            </div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {videos?.items?.slice(0, 6).map(video => (
                    <VideoCard video={video} key={video?.encodeId} />
                ))}
            </div>
        </div>
    )
}

export default MVSection