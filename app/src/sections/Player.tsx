import { useEffect, useRef, useState } from "react"
import { fetchSong } from "@/lib/http.client"
import { icons } from "@/lib/icons"
import { formatDuration } from "@/lib/utils"
import { toast } from "react-toastify"
import { RotatingLines } from "react-loader-spinner"
import { useDispatch, useSelector } from "@/redux/store"
import { setCurrentSong, setIsPlaying, setIsPlaylist } from "@/redux/slices/music"

let thumbInterval: number | undefined

const Player = () => {
    const [volume, setVolume] = useState(50)
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
    const dispatch = useDispatch()
    const { currentSong, isPlaying, isPlaylist, currentSongs } = useSelector(state => state.music)
    const { AiOutlineHeart, BsThreeDots, MdSkipNext, MdSkipPrevious, CiRepeat, CiShuffle, BsPlayFill, BsPauseFill, TbRepeatOnce, BsMusicNoteList, SlVolumeOff, SlVolume1, SlVolume2 } = icons
    const [currentSecond, setCurrentSecond] = useState(0)
    const [shuffle, setShuffle] = useState(false)
    const [repeatMode, setRepeatMode] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const thumb = useRef<any>(null)
    const trackRef = useRef<any>(null)

    const handleClickProgressBar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const trackRect = trackRef.current.getBoundingClientRect()
        const percent = Math.round(((e.clientX - trackRect.left) / trackRect.width) * 100)
        thumb.current.style.cssText = `right: ${100 - percent}%`
        audio && (audio.currentTime = currentSong!.duration * percent / 100)
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
            audio?.pause()
        } else {
            dispatch(setIsPlaying(true))
            audio?.play()
        }
    }

    const handleClickShuffle = () => {
        const randomIndex = Math.round(Math.random() * (currentSongs.length - 1))
        dispatch(setCurrentSong(currentSongs[randomIndex]))
        dispatch(setIsPlaying(true))
    }

    const handleClickOne = () => {
        audio && (audio.currentTime = 0)
        audio?.play()
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
            audio?.pause()
            if (song.statusCode === 200) {
                dispatch(setCurrentSong(song.data))
                setAudio(new Audio(song.data.stream))
            } else {
                setAudio(null)
                dispatch(setIsPlaying(false))
                toast.warn(song.message)
                setCurrentSecond(0)
                thumb.current.style.cssText = `right: 100%`
            }
        } catch (error) {
            toast.error(error as string)
        }
    }

    useEffect(() => {
        audio && (audio.volume = (volume / 100))
    }, [volume])

    useEffect(() => {
        getSong(currentSong!.id)
    }, [currentSong])

    useEffect(() => {
        thumbInterval && clearInterval(thumbInterval)
        if (!audio) return
        audio.load()
        audio.currentTime = 0
        // On audio playing toggle values
        audio.onplaying = () => dispatch(setIsPlaying(true))
        // On audio pause toggle values
        audio.onpause = () => dispatch(setIsPlaying(false))
        if (isPlaying && thumb.current) {
            audio.play()
            thumbInterval = setInterval(() => {
                let percent = Math.round((audio.currentTime / currentSong!.duration) * 10000) / 100
                thumb.current.style.cssText = `right: ${100 - percent}%`
                setCurrentSecond(Math.round(audio.currentTime))
            }, 500)
        }
        const handleEnd = () => {
            if (shuffle) {
                handleClickShuffle()
            } else if (repeatMode > 0) {
                repeatMode === 1 ? handleClickOne() : handleClickNext()
            } else {
                dispatch(setIsPlaying(false))
                audio.pause()
            }
        }
        audio.addEventListener('ended', handleEnd)
        return () => { audio.removeEventListener('ended', handleEnd) }
    }, [audio])

    return (
        <div className="sticky bottom-0 left-0 right-0 z-20">
            <div className="flex justify-between bg-main-400 px-5 py-2">
                <div className="w-[30%] hidden sm:flex justify-start items-center gap-4">
                    <img src={currentSong?.thumbnail} alt="thumbnail" className="w-16 h-16 object-cover" />
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-700 text-sm line-clamp-2 text-ellipsis">{currentSong?.title}</span>
                        <span className="text-gray-500 text-xs line-clamp-2 text-ellipsis">{currentSong?.artistNames}</span>
                    </div>
                    <span className="p-2">
                        <AiOutlineHeart size={20} />
                    </span>
                    <span className="p-1">
                        <BsThreeDots size={20} />
                    </span>
                </div>
                <div className="w-full sm:w-[40%] flex flex-col justify-center items-center gap-4">
                    <div className="flex gap-8 items-center">
                        <span title="Bật phát ngẫu nhiên" className={`cursor-pointer ${shuffle && 'text-purple-600'}`}>
                            <CiShuffle size={20} onClick={() => setShuffle(!shuffle)} />
                        </span>
                        <span className={`${isPlaylist ? 'cursor-pointer' : 'text-gray-500'}`}>
                            <MdSkipPrevious size={20} onClick={handleClickPrevious} />
                        </span>
                        <span onClick={handleToggleButton} className="hover:text-main-500 border rounded-full border-gray-700 p-1" >
                            {isLoading ? <RotatingLines strokeColor="grey" width="26" /> : isPlaying ? <BsPauseFill size={26} /> : <BsPlayFill size={26} />}
                        </span>
                        <span className={`${isPlaylist ? 'cursor-pointer' : 'text-gray-500'}`}>
                            <MdSkipNext size={20} onClick={handleClickNext} />
                        </span>
                        <span
                            title="Phát lại tất cả bài hát"
                            className={`cursor-pointer ${repeatMode && 'text-purple-600'}`}
                            onClick={() => setRepeatMode(repeatMode === 2 ? 0 : repeatMode + 1)}
                        >
                            {repeatMode === 1 ? <TbRepeatOnce size={20} /> : <CiRepeat size={20} />}
                        </span>
                    </div>
                    <div className="w-full flex items-center justify-center gap-3 text-sm">
                        <span>{formatDuration(currentSecond)}</span>
                        <div className="relative h-1 hover:h-2 bg-[rgba(0,0,0,0.1)] w-3/5 rounded-full cursor-pointer"
                            onClick={handleClickProgressBar} ref={trackRef}
                        >
                            <div ref={thumb} className="absolute top-0 left-0 bottom-0 h-full bg-[#0e8080] rounded-full"></div>
                        </div>
                        <span>{formatDuration(currentSong?.duration ?? 0)}</span>
                    </div>
                </div>
                <div className="w-[30%] hidden md:flex items-center justify-end gap-4">
                    <span onClick={() => setVolume(volume === 0 ? 50 : 0)}>
                        {
                            volume >= 50 ? <SlVolume2 /> : volume === 0 ? <SlVolumeOff /> : <SlVolume1 />
                        }
                    </span>
                    <input type="range" step={1} min={0} max={100} onChange={(e) => setVolume(Number(e.target.value))} value={volume} className="bg-main-500 h-1 hover:h-2" />
                    <span className="p-1.5 rounded-md cursor-pointer bg-main-500 text-white opacity-90 hover:opacity-100">
                        <BsMusicNoteList size={18} onClick={() => { }} />
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Player