import { useEffect, useRef, useState } from "react"
// components
import { RotatingLines } from "react-loader-spinner"
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
// icons
import { Ellipsis, Heart, MicVocal, MusicIcon, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "lucide-react"
// utils
import { formatDuration } from "@/lib/utils"
import { getAudioFromCache, isAudioCached, saveAudioToCache } from "@/lib/indexDB"
// redux
import { setCurrentSong, setIsPlaying, setIsPlaylist } from "@/redux/slices/music"
import { setShowSidebarRight } from "@/redux/slices/app"
import { useDispatch, useSelector } from "@/redux/store"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const Player: React.FC = () => {
    const dispatch = useDispatch()
    // redux states
    const { showSideBarRight } = useSelector(state => state.app)
    const { currentSong, isPlaying, isPlaylist, currentPlaylistSongs } = useSelector(state => state.music)
    // local states
    const [shuffle, setShuffle] = useState<boolean>(false)
    const [repeatMode, setRepeatMode] = useState<number>(0)
    const [volume, setVolume] = useState<number>(50)
    const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(true)
    // refs for mutable values
    const shuffleRef = useRef<boolean>(false)
    const repeatModeRef = useRef<number>(0)
    const thumbRef = useRef<HTMLDivElement | null>(null)
    const trackRef = useRef<HTMLDivElement | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const currentTimeRef = useRef<HTMLElement | null>(null)

    const handleClickProgressBar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!trackRef.current || !audioRef.current || !thumbRef.current) return
        const trackRect = trackRef.current.getBoundingClientRect()
        const percent = Math.round(((e.clientX - trackRect.left) / trackRect.width) * 100)
        thumbRef.current.style.cssText = `right: ${100 - percent}%`
        audioRef.current.currentTime = currentSong!.duration * percent / 100
    }

    const handleClickNext = () => {
        if (currentPlaylistSongs.length > 0) {
            currentPlaylistSongs.forEach((item, index) => {
                if (item.id === currentSong?.id) {
                    if (currentPlaylistSongs[index + 1]) {
                        dispatch(setCurrentSong(currentPlaylistSongs[index + 1]))
                        dispatch(setIsPlaying(true))
                        audioRef.current?.play()
                    }
                    if (index + 1 < currentPlaylistSongs.length - 1) {
                        dispatch(setIsPlaylist(false))
                    }
                    return
                }
            })
        }
    }

    const handleClickPrevious = () => {
        if (currentPlaylistSongs.length > 0) {
            currentPlaylistSongs.forEach((item, index) => {
                if (item.id === currentSong?.id) {
                    if (currentPlaylistSongs[index - 1]) {
                        dispatch(setCurrentSong(currentPlaylistSongs[index - 1]))
                        dispatch(setIsPlaying(true))
                        audioRef.current?.play()
                    }
                    if (index - 1 === 0) {
                        dispatch(setIsPlaylist(false))
                    }
                }
            })
        }
    }

    const handleToggleButton = async () => {
        if (!audioRef.current) return
        if (isPlaying && !audioRef.current.paused) {
            dispatch(setIsPlaying(false))
            audioRef.current.pause()
        } else if (!isPlaying && audioRef.current.paused) {
            dispatch(setIsPlaying(true))
            await audioRef.current.play()
        }
    }

    const handleShuffle = () => {
        if (!audioRef.current) return
        const randomIndex = Math.round(Math.random() * (currentPlaylistSongs.length - 1))
        dispatch(setCurrentSong(currentPlaylistSongs[randomIndex]))
        dispatch(setIsPlaying(true))
        audioRef.current.play()
    }

    const handleRepeat = () => {
        if (!audioRef.current) return
        audioRef.current.currentTime = 0
        audioRef.current.play()
    }

    const updatePlayerUI = () => {
        let animationFrame: number
        const audio = audioRef.current
        if (!audio || !audio.src) return

        const updateTime = () => {
            currentTimeRef.current!.innerText = formatDuration(Math.floor(audio.currentTime))
            let percent = Math.round((audio.currentTime / currentSong!.duration) * 10000) / 100
            thumbRef.current && (thumbRef.current.style.cssText = `right: ${100 - percent}%`)
            animationFrame = requestAnimationFrame(updateTime)
        }

        const handlePlay = () => animationFrame = requestAnimationFrame(updateTime)

        const handlePause = () => cancelAnimationFrame(animationFrame)

        const handleEnd = () => {
            handlePause()
            if (shuffleRef.current) {
                handleShuffle()
            } else if (repeatModeRef.current > 0) {
                repeatModeRef.current === 1 ? handleRepeat() : handleClickNext()
            } else {
                dispatch(setIsPlaying(false))
                audio.pause()
            }
        }
        audio.addEventListener("play", handlePlay)
        audio.addEventListener("pause", handlePause)
        audio.addEventListener("ended", handleEnd)
        // cleanup event listeners and cancel updating progress bar on unmount
        return () => {
            audio.removeEventListener("play", handlePlay)
            audio.removeEventListener("pause", handlePause)
            audio.removeEventListener("ended", handleEnd)
            cancelAnimationFrame(animationFrame)
        }
    }

    const initializePlayer = async () => {
        dispatch(setIsPlaying(false))
        if (currentSong?.stream) {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
            const isCached = await isAudioCached(currentSong.id)
            if (!isCached) await saveAudioToCache(currentSong.id, currentSong.stream)
            let audioUrl = await getAudioFromCache(currentSong.id)
            if (audioUrl) {
                audioRef.current = new Audio(audioUrl)
                audioRef.current.load()
                audioRef.current.volume = (volume / 100)
                audioRef.current.oncanplaythrough = () => {
                    setIsLoadingAudio(false)
                    audioRef.current?.play()
                        .then(_ => dispatch(setIsPlaying(true)))
                        .catch(_ => console.log("Auto play was prevented because user didn't interact with the document"))
                }
            }
        } else {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
        currentTimeRef.current && (currentTimeRef.current.innerText = '00:00')
        thumbRef.current && (thumbRef.current.style.cssText = `right: 100%`)
        updatePlayerUI()
    }

    // initialize player when current song changes and update player state UI
    useEffect(() => {
        initializePlayer()
    }, [currentSong, audioRef, thumbRef, currentTimeRef])

    // change audio during song playing
    useEffect(() => {
        if (!audioRef.current) return
        audioRef.current.volume = (volume / 100)
    }, [volume])

    // change shuffle mode during song playing
    useEffect(() => {
        shuffleRef.current = shuffle
    }, [shuffle])

    // change repeat mode during song playing
    useEffect(() => {
        repeatModeRef.current = repeatMode
    }, [repeatMode])

    return (
        <div className={`fixed left-0 right-0 bottom-0 z-20 h-24 content-center bg-main-400 select-none`}>
            <div className="flex justify-between px-5">
                <div className="flex-1 items-center gap-4 hidden md:flex">
                    <img src={currentSong?.thumbnail} alt="thumbnail" className="w-16 h-16 object-cover" />
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-700 text-sm line-clamp-2 text-ellipsis">{currentSong?.title}</span>
                        <span className="text-gray-500 text-xs line-clamp-2 text-ellipsis">{currentSong?.artistNames}</span>
                    </div>
                    <Heart size={20} />
                    <Ellipsis size={20} />
                </div>
                <div className="flex flex-1 items-center gap-4 flex-col">
                    <div className="flex gap-8 items-center">
                        <Tooltip>
                            <TooltipTrigger asChild
                                className={`cursor-pointer ${shuffle && 'text-purple-600'}`}
                                onClick={() => setShuffle(prev => !prev)}
                            >
                                <Shuffle size={20} />
                            </TooltipTrigger>
                            <TooltipContent>
                                Bật phát ngẫu nhiên
                            </TooltipContent>
                        </Tooltip>
                        <span className={`${isPlaylist ? 'cursor-pointer' : 'text-gray-500'}`}>
                            <SkipBack size={20} onClick={handleClickPrevious} />
                        </span>
                        <span onClick={handleToggleButton} className="hover:text-main-500 border rounded-full border-gray-500 p-1" >
                            {isLoadingAudio ? <RotatingLines strokeColor="#0E8080" width={30} height={30} /> : isPlaying ? <Pause size={30} /> : <Play size={30} />}
                        </span>
                        <span className={`${isPlaylist ? 'cursor-pointer' : 'text-gray-500'}`}>
                            <SkipForward size={20} onClick={handleClickNext} />
                        </span>
                        <Tooltip>
                            <TooltipTrigger asChild
                                className={`cursor-pointer ${repeatMode && 'text-purple-600'}`}
                                onClick={() => setRepeatMode(repeatMode === 2 ? 0 : repeatMode + 1)}
                            >
                                {repeatMode === 1 ? <Repeat1 size={20} /> : <Repeat size={20} />}
                            </TooltipTrigger>
                            <TooltipContent>
                                Phát lại tất cả bài hát
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="w-full flex items-center justify-center gap-3 text-sm">
                        <Typography ref={currentTimeRef} className="font-semibold text-gray-500 m-0">00:00</Typography>
                        <div className="relative h-1 hover:h-2 bg-[#0000001a] w-3/5 rounded-full cursor-pointer" onClick={handleClickProgressBar} ref={trackRef}>
                            <div ref={thumbRef} className="absolute top-0 left-0 bottom-0 h-full bg-[#0e8080] rounded-full"></div>
                        </div>
                        <Typography className="font-semibold text-gray-500 m-0">{formatDuration(currentSong?.duration ?? 0)}</Typography>
                    </div>
                </div>
                <div className="flex-1 items-center gap-4 justify-end hidden md:flex">
                    <MicVocal size={20} />
                    <Button size={'icon-lg'} variant={'ghost'} onClick={() => setVolume(volume === 0 ? 50 : 0)}>
                        {volume >= 50 ? <Volume2 /> : volume === 0 ? <VolumeX /> : <Volume1 />}
                    </Button>
                    <input type="range" step={1} min={0} max={100} onChange={(e) => setVolume(Number(e.target.value))} value={volume} className="h-1 hover:h-2" />
                    <Button className="text-white" size={'icon-lg'} onClick={() => dispatch(setShowSidebarRight(!showSideBarRight))}>
                        <MusicIcon />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Player