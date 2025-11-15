import { useEffect, useRef, useState } from "react"
import { getVideo } from "../services/api.service"
import { Link, NavLink, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import Hls from "hls.js"
import { icons } from "@/lib/icons"
import { formatDuration } from "@/lib/utils"
import { useDispatch, useSelector } from "react-redux"
import { setTheater } from "../store/actions/music_actions"

var hls = null

const VideoClipPage = () => {
    const settingsRef = useRef()
    const timelineContainerRef = useRef()
    const { id } = useParams()
    const [video, setVideo] = useState(null)
    const videoContainerRef = useRef(null)
    const videoPlayerRef = useRef(null)
    const { BsPlayFill, BsPauseFill, LuRectangleHorizontal, MdFullscreen, MdOutlineFullscreenExit, MdPictureInPicture, SlVolume1, SlVolume2, SlVolumeOff, IoMdSettings } = icons
    const [isPlaying, setIsPlaying] = useState(false)
    const { isTheater } = useSelector(state => state.music)
    const dispatch = useDispatch()
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [volume, setVolume] = useState(50)
    const [currentTime, setCurrentTime] = useState(0)
    let isScrubbing = false
    const { screenWidth } = useSelector(state => state.app)
    const displayAmount = isTheater ? (screenWidth <= 1024 ? 4 : 7) : video?.recommends?.length

    const fetchVideo = async () => {
        try {
            const response = await getVideo(id)
            if (response?.err === 0) {
                setVideo(response?.data)
                if (response?.data?.streaming) {
                    initializeVideoPlayer(response?.data?.streaming?.hls['360p'])
                }
            } else {
                toast.warn(response?.msg)
            }
        } catch (error) {
            toast.warn(error)
        }
    }

    const initializeVideoPlayer = (url) => {
        if (Hls.isSupported() && videoContainerRef.current) {
            // if (hls === null)
            hls = new Hls()
            hls.loadSource(url)
            hls.attachMedia(videoPlayerRef.current)
        }
    }

    useEffect(() => {
        fetchVideo()
        return () => {
            if (hls) hls.destroy()
        }
    }, [videoContainerRef])

    const toggleVideo = () => {
        if (!isPlaying) {
            videoPlayerRef.current?.play()
            setIsPlaying(true)
        } else {
            videoPlayerRef.current?.pause()
            setIsPlaying(false)
        }
    }

    const videoKeyDown = (e) => {
        if (e.keyCode === 32) toggleVideo()
        if (e.keyCode === 37) videoPlayerRef.current.currentTime -= 5
        if (e.keyCode === 39) videoPlayerRef.current.currentTime += 5
    }

    const toggleTheaterMode = () => {
        videoContainerRef.current.classList.toggle('theater')
        videoPlayerRef.current.classList.toggle('h-[90vh]')
        dispatch(setTheater(!isTheater))
    }

    const toggleFullScreen = () => {
        setIsFullscreen(!isFullscreen)
        if (document.fullscreenElement === null) {
            dispatch(setTheater(false))
            videoContainerRef.current.classList.remove('theater')
            videoPlayerRef.current.classList.remove('h-[90vh]')
            videoContainerRef.current.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    const togglePictureInPicture = () => {
        if (videoPlayerRef.current.classList.contains("mini-player")) {
            document.exitPictureInPicture()
        } else {
            videoPlayerRef.current.requestPictureInPicture()
        }
    }

    const muteAudio = () => {
        videoPlayerRef.current.muted = !videoPlayerRef.current.muted
        if (videoPlayerRef.current.muted) setVolume(0)
        else setVolume(50)
    }

    const displaySettings = () => {
        if (settingsRef.current) {
            settingsRef.current.classList.toggle('hidden')
        }
    }

    const changePlayBackRate = (speed) => {
        if (videoPlayerRef.current) videoPlayerRef.current.playbackRate = speed
        displaySettings()
    }

    const toggleScrubbing = (e) => {
        const rect = timelineContainerRef.current?.getBoundingClientRect()
        const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
        isScrubbing = (e.buttons & 1) === 1
        timelineContainerRef.current?.classList.toggle("scrubbing", isScrubbing)
        if (isScrubbing) {
            videoPlayerRef.current.pause()
            videoPlayerRef.current.currentTime = percent * (videoPlayerRef.current?.duration || Infinity)
        } else {
            if (videoPlayerRef.current?.paused) videoPlayerRef.current.play()
        }
        handleVideoPlaying(e)
    }

    const handleVideoPlaying = (e) => {
        const rect = timelineContainerRef.current.getBoundingClientRect()
        const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
        timelineContainerRef.current.style.setProperty("--preview-position", percent)
        if (isScrubbing) {
            e.preventDefault()
            timelineContainerRef.current.style.setProperty("--progress-position", percent)
        }
    }

    useEffect(() => {
        if (videoPlayerRef.current) {
            videoPlayerRef.current.addEventListener('enterpictureinpicture', () => {
                videoPlayerRef.current.classList.add('mini-player')
            })
            videoPlayerRef.current.addEventListener('leavepictureinpicture', () => {
                videoPlayerRef.current.classList.remove('mini-player')
            })
            videoPlayerRef.current.addEventListener('timeupdate', () => {
                setCurrentTime(Math.round(videoPlayerRef.current.currentTime))
                const percent = videoPlayerRef.current.currentTime / (videoPlayerRef.current.duration || Infinity)
                timelineContainerRef.current.style.setProperty("--progress-position", percent)
            })
            timelineContainerRef.current.addEventListener('mousemove', handleVideoPlaying)
            timelineContainerRef.current.addEventListener('mousedown', toggleScrubbing)
            document.addEventListener('mouseup', (e) => {
                if (isScrubbing) toggleScrubbing(e)
            })
            document.addEventListener('mousemove', (e) => {
                if (isScrubbing) toggleScrubbing(e)
            })
        }
        return () => {
            document.removeEventListener('mouseup', (e) => {
                if (isScrubbing) toggleScrubbing(e)
            })
            document.removeEventListener('mousemove', (e) => {
                if (isScrubbing) toggleScrubbing(e)
            })
        }
    }, [videoPlayerRef, timelineContainerRef])

    useEffect(() => {
        if (videoPlayerRef.current) videoPlayerRef.current.volume = volume / 100
    }, [volume])

    return (
        <div className={`all-container w-full bg-purple-950 py-10 gap-6 ${isTheater ? 'h-fit' : 'h-screen flex justify-between px-5'}`}>
            {video && video.streaming && video.streaming.hls ? (
                <div ref={videoContainerRef} className={`relative h-fit ${isTheater ? 'w-full' : 'w-3/4'}`}>
                    <video ref={videoPlayerRef} className="rounded-md bg-black outline-none" width="100%" onClick={toggleVideo} tabIndex={0} onKeyDown={videoKeyDown} />
                    <img className="thumbnail-img" alt="thumbnail-img" />
                    <div className="px-2 absolute bottom-0 left-0 right-0 video-controls-container">
                        <div className="timeline-container h-2 rounded-full cursor-pointer flex items-center" ref={timelineContainerRef}>
                            <div className="timeline">
                                <img className="preview-img" alt="preview-img" src={video?.thumbnail} />
                                <div className="thumb-indicator"></div>
                            </div>
                        </div>
                        <div className="relative flex items-center text-white py-1 px-3 gap-3">
                            {isPlaying ? (
                                <span onClick={toggleVideo}><BsPauseFill size={40} /></span>
                            ) : (
                                <span onClick={toggleVideo}><BsPlayFill size={40} /></span>
                            )}
                            <div className="flex items-center group gap-2">
                                <span onClick={muteAudio}>
                                    {(volume < 50 && volume > 0) && <SlVolume1 size={30} />}
                                    {volume >= 50 && <SlVolume2 size={30} />}
                                    {volume === 0 && <SlVolumeOff size={30} />}
                                </span>
                                <input className="h-1 rounded-full transition-all w-0 scale-x-0 origin-left focus-within:w-24 focus-within:scale-x-100 group-hover:w-24 group-hover:scale-x-100" type="range" step={1} min={0} max={100} value={volume} onChange={(e) => setVolume(e.target.value)} />
                            </div>
                            <div className="flex gap-1 text-sm flex-1">
                                <span>{formatDuration(currentTime)}</span>
                                <span>/</span>
                                <span>{formatDuration(video?.duration)}</span>
                            </div>
                            <IoMdSettings size={30} onClick={displaySettings} />
                            {!isFullscreen && (
                                <span onClick={toggleTheaterMode}>
                                    <LuRectangleHorizontal size={30} />
                                </span>
                            )}
                            <span onClick={toggleFullScreen}>
                                {isFullscreen ? (
                                    <MdOutlineFullscreenExit size={30} />
                                ) : (
                                    <MdFullscreen size={30} />
                                )}
                            </span>
                            <span onClick={togglePictureInPicture}>
                                <MdPictureInPicture size={30} />
                            </span>
                            <div ref={settingsRef} className="cursor-pointer hidden rounded-md w-[200px] bg-[rgba(255,255,255,0.3)] absolute bottom-14 right-0 py-2">
                                <div onClick={() => changePlayBackRate(0.25)}
                                    className="p-2 hover:bg-[rgba(255,255,255,0.2)] flex justify-between items-center px-2"
                                >
                                    <span>Tốc độ x0.25</span>
                                    <span><BsPlayFill size={20} /></span>
                                </div>
                                <div onClick={() => changePlayBackRate(0.5)}
                                    className="p-2 hover:bg-[rgba(255,255,255,0.2)] flex justify-between items-center px-2"
                                >
                                    <span>Tốc độ x0.5</span>
                                    <span><BsPlayFill size={20} /></span>
                                </div>
                                <div onClick={() => changePlayBackRate(1)}
                                    className="p-2 hover:bg-[rgba(255,255,255,0.2)] flex justify-between items-center px-2"
                                >
                                    <span>Tốc độ chuẩn</span>
                                    <span><BsPlayFill size={20} /></span>
                                </div>
                                <div onClick={() => changePlayBackRate(1.5)}
                                    className="p-2 hover:bg-[rgba(255,255,255,0.2)] flex justify-between items-center px-2"
                                >
                                    <span>Tốc độ x1.5</span>
                                    <span><BsPlayFill size={20} /></span>
                                </div>
                                <div onClick={() => changePlayBackRate(2)}
                                    className="p-2 hover:bg-[rgba(255,255,255,0.2)] flex justify-between items-center px-2"
                                >
                                    <span>Tốc độ x2</span>
                                    <span><BsPlayFill size={20} /></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`content-center text-center align-middle h-full ${isTheater ? 'w-full' : 'w-3/4'}`}>
                    <h1 className="text-2xl text-white">Bạn không có quyền VIP để xem video</h1>
                </div>
            )
            }
            <div className={`overflow-x-scroll text-white rounded-md h-[90%] max-h-[90%] ${isTheater ? 'w-full mt-4' : 'bg-[rgba(255,255,255,0.1)] w-1/4'}`}>
                <div className="p-4">
                    <span className="font-bold text-lg">Danh sách phát</span>
                </div>
                <div className={`${isTheater && 'overflow-x-auto whitespace-nowrap thin-scrollbar'} mx-4`}>
                    {video?.recommends?.map(item => (
                        <div key={item?.encodeId} className={`${isTheater && 'last:mr-0 mr-4 w-[330px] inline-block'} py-2`}>
                            <NavLink to={item?.link.split('.')[0]} className={`${isTheater && 'flex-col'} flex gap-2 items-center hover:bg-[#ffffff0d]`}>
                                <img src={item?.thumbnail} className={`${isTheater ? 'aspect-video w-full' : 'w-32 h-16'} object-cover rounded-md`} />
                                <div className="w-full">
                                    <span className="line-clamp-1 font-bold text-sm">{item?.title}</span>
                                    <span className="line-clamp-1 font-semibold text-xs text-[rgba(255,255,255,0.4)]">
                                        {item?.artists?.map((artist, i) => (
                                            <Link to={`/artist/${artist.alias}`} key={i}>
                                                {`${artist.name}${i < item.artists.length - 1 && ', '}`}
                                            </Link>
                                        ))}
                                    </span>
                                </div>
                            </NavLink>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default VideoClipPage 