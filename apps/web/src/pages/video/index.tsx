import { useParams } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { videoQueries } from "@/lib/queries/video"
import { VideoPlayer } from "@/components/video-player/video-player"
import { videoStreamUrl } from "@/lib/constants"
// import { useMobile } from "@/hooks/useMobile"

// var hls: Hls | null = null

const VideoPage = () => {
    const { id } = useParams({ strict: false })
    const { data } = useQuery(videoQueries().one.queryOptions(id))
    // const isMobile = useMobile()

    // const toggleTheaterMode = () => {
    //     if (!videoContainer.current || !videoPlayer.current) return
    //     videoContainer.current.classList.toggle('theater')
    //     videoPlayer.current.classList.toggle('h-[90vh]')
    //     setIsTheater(prev => !prev)
    // }

    return (
        <div className={`all-container w-full bg-purple-950 py-10 gap-6 ${'h-screen flex justify-between px-5'}`}>
            {data && (<VideoPlayer videoUrl={videoStreamUrl(data.id)} />)}
            <div className={`overflow-x-scroll text-white rounded-md h-[90%] max-h-[90%] ${'bg-[rgba(255,255,255,0.1)] w-1/4'}`}>
                <div className="p-4">
                    <span className="font-bold text-lg">Danh sách phát</span>
                </div>
                {/* <div className={`${isTheater && 'overflow-x-auto whitespace-nowrap thin-scrollbar'} mx-4`}>
                    {video?.recommends?.map(item => (
                        <div key={item?.id} className={`${isTheater && 'last:mr-0 mr-4 w-[330px] inline-block'} py-2`}>
                            <Link to={`/video/${item.id}`} className={`${isTheater && 'flex-col'} flex gap-2 items-center hover:bg-[#ffffff0d]`}>
                                <img src={item?.thumbnail} className={`${isTheater ? 'aspect-video w-full' : 'w-32 h-16'} object-cover rounded-md`} />
                                <div className="w-full">
                                    <span className="line-clamp-1 font-bold text-sm">{item?.title}</span>
                                    <span className="line-clamp-1 font-semibold text-xs text-[rgba(255,255,255,0.4)]">
                                        {item?.artists?.map((artist: any, i: number) => (
                                            <Link to={`/artist/${artist.alias}`} key={i}>
                                                {`${artist.name}${i < item.artists.length - 1 && ', '}`}
                                            </Link>
                                        ))}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div> */}
            </div>
        </div >
    )
}

export default VideoPage 
