import { useEffect, useRef, useState } from "react"
import { fetchSong } from "@/lib/http.client"
import { formatDuration } from "@/lib/utils"
import { toast } from "react-toastify"
import { RotatingLines } from "react-loader-spinner"
import { useDispatch, useSelector } from "@/redux/store"
import { setCurrentSong, setIsPlaying, setIsPlaylist } from "@/redux/slices/music"
import { Ellipsis, Heart, MusicIcon, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "lucide-react"
import { setShowSidebarRight } from "@/redux/slices/app"
import { Typography } from "@/components/ui/typography"

const Player = () => {
    const dispatch = useDispatch()
    // redux states
    const { showSideBarRight } = useSelector(state => state.app)
    const { currentSong, isPlaying, isPlaylist, currentSongs } = useSelector(state => state.music)
    //  local states
    const [currentSecond, setCurrentSecond] = useState<number>(0)
    const [shuffle, setShuffle] = useState<boolean>(false)
    const [repeatMode, setRepeatMode] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [volume, setVolume] = useState<number>(50)
    // refs
    const thumb = useRef<HTMLDivElement | null>(null)
    const trackRef = useRef<HTMLDivElement | null>(null)
    const thumbInterval = useRef<number | undefined>(undefined)
    const audio = useRef<HTMLAudioElement | null>(null)

    const handleClickProgressBar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!trackRef.current || !audio.current || !thumb.current) return
        const trackRect = trackRef.current.getBoundingClientRect()
        const percent = Math.round(((e.clientX - trackRect.left) / trackRect.width) * 100)
        thumb.current.style.cssText = `right: ${100 - percent}%`
        audio.current.currentTime = currentSong!.duration * percent / 100
    }

    const handleClickNext = () => {
        if (currentSongs.length > 0) {
            currentSongs.forEach((item, index) => {
                if (item.id === currentSong?.id) {
                    if (currentSongs[index + 1]) {
                        dispatch(setCurrentSong(currentSongs[index + 1]))
                        dispatch(setIsPlaying(true))
                    }
                    if (index + 1 < currentSongs.length - 1) {
                        dispatch(setIsPlaylist(false))
                    }
                    return
                }
            })
        }
    }

    const handleClickPrevious = () => {
        if (currentSongs.length > 0) {
            currentSongs.forEach((item, index) => {
                if (item.id === currentSong?.id) {
                    if (currentSongs[index - 1]) {
                        dispatch(setCurrentSong(currentSongs[index - 1]))
                        dispatch(setIsPlaying(true))
                    }
                    if (index - 1 === 0) {
                        dispatch(setIsPlaylist(false))
                    }
                }
            })
        }
    }

    const handleToggleButton = () => {
        if (isPlaying) {
            dispatch(setIsPlaying(false))
            audio.current?.pause()
        } else {
            dispatch(setIsPlaying(true))
            audio.current?.play()
        }
    }

    const handleClickShuffle = () => {
        const randomIndex = Math.round(Math.random() * (currentSongs.length - 1))
        dispatch(setCurrentSong(currentSongs[randomIndex]))
        dispatch(setIsPlaying(true))
    }

    const handleClickOne = () => {
        if (!audio.current) return
        audio.current.currentTime = 0
        audio.current.play()
    }

    // const playAudio = async () => {
    //     if (audio.paused && !isPlaying) audio.play()
    // }

    // const pauseAudio = async () => {
    //     if (!audio.paused && isPlaying) audio.pause()
    // }

    const getSong = async (id: string) => {
        try {
            const [song] = await Promise.all([fetchSong(id)])
            setIsLoading(false)
            audio.current?.pause()
            if (song.statusCode === 200) {
                dispatch(setCurrentSong(song.data))
                audio.current = new Audio(song.data.stream)
            } else {
                audio.current = null
                dispatch(setIsPlaying(false))
                toast.warn(song.message)
                setCurrentSecond(0)
                thumb.current && (thumb.current.style.cssText = `right: 100%`)
            }
        } catch (error) {
            toast.error(error as string)
        }
    }

    useEffect(() => {
        if (!audio.current) return
        audio.current.volume = (volume / 100)
    }, [volume])

    useEffect(() => {
        getSong(currentSong?.id ?? '')
    }, [currentSong])

    useEffect(() => {
        thumbInterval.current && clearInterval(thumbInterval.current)
        if (!audio.current || !thumb.current || !thumbInterval.current) return
        audio.current.load()
        audio.current.currentTime = 0
        // On audio playing toggle values
        audio.current.onplaying = () => dispatch(setIsPlaying(true))
        // On audio pause toggle values
        audio.current.onpause = () => dispatch(setIsPlaying(false))
        if (isPlaying) {
            audio.current.play()
            thumbInterval.current = setInterval(() => {
                let percent = Math.round((audio.current!.currentTime / currentSong!.duration) * 10000) / 100
                thumb.current && (thumb.current.style.cssText = `right: ${100 - percent}%`)
                setCurrentSecond(Math.round(audio.current!.currentTime))
            }, 500)
        }
        const handleEnd = () => {
            if (shuffle) {
                handleClickShuffle()
            } else if (repeatMode > 0) {
                repeatMode === 1 ? handleClickOne() : handleClickNext()
            } else {
                dispatch(setIsPlaying(false))
                audio.current?.pause()
            }
        }
        audio.current.addEventListener('ended', handleEnd)
        return () => { audio.current?.removeEventListener('ended', handleEnd) }
    }, [audio])

    return (
        <div className={`fixed left-0 right-0 bottom-0 z-20 h-24 content-center bg-main-400`}>
            <div className="flex justify-between px-5">
                <div className="w-[30%] hidden sm:flex justify-start items-center gap-4">
                    <img src={currentSong?.thumbnail} alt="thumbnail" className="w-16 h-16 object-cover" />
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-700 text-sm line-clamp-2 text-ellipsis">{currentSong?.title}</span>
                        <span className="text-gray-500 text-xs line-clamp-2 text-ellipsis">{currentSong?.artistNames}</span>
                    </div>
                    <Heart size={20} />
                    <Ellipsis size={20} />
                </div>
                <div className="w-full sm:w-[40%] flex flex-col justify-center items-center gap-4">
                    <div className="flex gap-8 items-center">
                        <span title="Bật phát ngẫu nhiên" className={`cursor-pointer ${shuffle && 'text-purple-600'}`}>
                            <Shuffle size={20} onClick={() => setShuffle(!shuffle)} />
                        </span>
                        <span className={`${isPlaylist ? 'cursor-pointer' : 'text-gray-500'}`}>
                            <SkipBack size={20} onClick={handleClickPrevious} />
                        </span>
                        <span onClick={handleToggleButton} className="hover:text-main-500 border rounded-full border-gray-500 p-1" >
                            {isLoading ? <RotatingLines strokeColor="grey" height={26} width={26} /> : isPlaying ? <Pause size={26} /> : <Play size={26} />}
                        </span>
                        <span className={`${isPlaylist ? 'cursor-pointer' : 'text-gray-500'}`}>
                            <SkipForward size={20} onClick={handleClickNext} />
                        </span>
                        <span
                            title="Phát lại tất cả bài hát"
                            className={`cursor-pointer ${repeatMode && 'text-purple-600'}`}
                            onClick={() => setRepeatMode(repeatMode === 2 ? 0 : repeatMode + 1)}
                        >
                            {repeatMode === 1 ? <Repeat1 size={20} /> : <Repeat size={20} />}
                        </span>
                    </div>
                    <div className="w-full flex items-center justify-center gap-3 text-sm">
                        <Typography className="font-semibold text-gray-500 m-0">{formatDuration(currentSecond)}</Typography>
                        <div className="relative h-1 hover:h-2 bg-[rgba(0,0,0,0.1)] w-3/5 rounded-full cursor-pointer" onClick={handleClickProgressBar} ref={trackRef}>
                            <div ref={thumb} className="absolute top-0 left-0 bottom-0 h-full bg-[#0e8080] rounded-full"></div>
                        </div>
                        <Typography className="font-semibold text-gray-500 m-0">{formatDuration(currentSong?.duration ?? 0)}</Typography>
                    </div>
                </div>
                <div className="w-[30%] hidden md:flex items-center justify-end gap-4">
                    <span onClick={() => setVolume(volume === 0 ? 50 : 0)}>
                        {volume >= 50 ? <Volume2 /> : volume === 0 ? <VolumeX /> : <Volume1 />}
                    </span>
                    <input type="range" step={1} min={0} max={100} onChange={(e) => setVolume(Number(e.target.value))} value={volume} className="h-1 hover:h-2" />
                    <div className="p-2 rounded-md cursor-pointer bg-main-500 text-white">
                        <MusicIcon onClick={() => { dispatch(setShowSidebarRight(!showSideBarRight)) }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Player