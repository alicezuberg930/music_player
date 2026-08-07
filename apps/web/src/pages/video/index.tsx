import { useEffect, useState } from 'react'
import { useParams } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { videoQueries } from "@/lib/queries/video"
import { VideoPlayer } from "@/components/video-player/video-player"

const VideoPage = () => {
    const { id } = useParams({ strict: false })
    const { data } = useQuery(videoQueries().one.queryOptions(id))
    const [videoUrl, setVideoUrl] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return

        let isCancelled = false
        const controller = new AbortController()

        fetch(`${import.meta.env.VITE_API_URL}/videos/stream/${id}`, {
            signal: controller.signal,
            headers: { Accept: 'application/json' },
        })
            .then(async (response) => {
                if (!response.ok) throw new Error('Failed to resolve video stream URL')
                const payload = await response.json() as { url?: string }
                if (!isCancelled && typeof payload.url === 'string' && payload.url) {
                    setVideoUrl(payload.url)
                }
            })
            .catch((error) => {
                if (!isCancelled) console.error('Failed to resolve video stream URL:', error)
            })

        return () => {
            isCancelled = true
            controller.abort()
        }
    }, [id])

    // const toggleTheaterMode = () => {
    //     if (!videoContainer.current || !videoPlayer.current) return
    //     videoContainer.current.classList.toggle('theater')
    //     videoPlayer.current.classList.toggle('h-[90vh]')
    //     setIsTheater(prev => !prev)
    // }

    return (
        <div className={`all-container w-full bg-purple-950 py-10 gap-6 ${'h-screen flex justify-between px-5'}`}>
            {data && videoUrl && (<VideoPlayer videoUrl={videoUrl} />)}
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
