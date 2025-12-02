import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// components
import { RotatingLines } from 'react-loader-spinner'
import { Typography } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
// icons
import { Ellipsis, Heart, MicVocal, MusicIcon, PauseCircle, PlayCircle, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from 'lucide-react'
// utils
import { formatDuration } from '@/lib/utils'
import { getAudioFromCache, isAudioCached, saveAudioToCache } from '@/lib/indexDB'
// redux
import { setCurrentSong, setIsPlaying, shufflePlaylist } from '@/redux/slices/music'
import { setShowSidebarRight } from '@/redux/slices/app'
import { useDispatch, useSelector } from '@/redux/store'
// sections
import LyricsDrawer from './LyricsDrawer'

const Player: React.FC = () => {
    const dispatch = useDispatch()
    // redux states
    const { showSideBarRight } = useSelector(state => state.app)
    const { currentSong, isPlaying, currentPlaylistSongs } = useSelector(state => state.music)
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
    const isDraggingRef = useRef<boolean>(false)
    // memoized next song
    const nextSong = useMemo(() => {
        if (!currentSong) return undefined
        const index = currentPlaylistSongs.findIndex((item) => item.id === currentSong.id)
        return index === -1 ? undefined : currentPlaylistSongs[index + 1]
    }, [currentSong, currentPlaylistSongs])

    const seekBar = (clientX: number) => {
        if (!trackRef.current || !audioRef.current || !thumbRef.current) return
        const trackRect = trackRef.current.getBoundingClientRect()
        const rawPercent = ((clientX - trackRect.left) / trackRect.width) * 100
        const percent = Math.max(0, Math.min(100, Math.round(rawPercent)))
        thumbRef.current.style.cssText = `right: ${100 - percent}%`
        if (currentSong?.duration) audioRef.current.currentTime = (currentSong.duration * percent) / 100
    }

    // handle click on progress bar
    const handleClickProgressBar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        seekBar(e.clientX)
    }

    // handle mouse down on progress bar
    const handleMouseDownProgressBar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        isDraggingRef.current = true
        seekBar(e.clientX)
    }

    // handle drag on progress bar
    const handleMouseMoveProgressBar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!isDraggingRef.current) return
        seekBar(e.clientX)
    }

    // handle mouse up on progress bar
    const handleMouseUpProgressBar = () => {
        isDraggingRef.current = false
    }

    const handleNext = useCallback(() => {
        if (currentPlaylistSongs.length > 0) {
            currentPlaylistSongs.forEach((item, index) => {
                if (item.id === currentSong?.id) {
                    if (currentPlaylistSongs[index + 1]) {
                        dispatch(setCurrentSong(currentPlaylistSongs[index + 1]))
                        audioRef.current?.play()
                    }
                    return
                }
            })
        }
    }, [currentPlaylistSongs, currentSong, dispatch])

    const handlePrevious = useCallback(() => {
        if (currentPlaylistSongs.length > 0) {
            currentPlaylistSongs.forEach((item, index) => {
                if (item.id === currentSong?.id) {
                    if (currentPlaylistSongs[index - 1]) {
                        dispatch(setCurrentSong(currentPlaylistSongs[index - 1]))
                        audioRef.current?.play()
                    }
                }
            })
        }
    }, [currentPlaylistSongs, currentSong, dispatch])

    const handleToggleButton = useCallback(async () => {
        if (!audioRef.current) return
        if (isPlaying && !audioRef.current.paused) {
            dispatch(setIsPlaying(false))
            audioRef.current.pause()
        } else if (!isPlaying && audioRef.current.paused) {
            dispatch(setIsPlaying(true))
            await audioRef.current.play()
        }
    }, [isPlaying, dispatch])

    const handleShuffle = () => {
        if (!audioRef.current) return
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
                repeatModeRef.current === 1 ? handleRepeat() : handleNext()
            } else {
                dispatch(setIsPlaying(false))
                audio.pause()
            }
        }
        audio.addEventListener('play', handlePlay)
        audio.addEventListener('pause', handlePause)
        audio.addEventListener('ended', handleEnd)
        // cleanup event listeners and cancel updating progress bar on unmount
        return () => {
            audio.removeEventListener('play', handlePlay)
            audio.removeEventListener('pause', handlePause)
            audio.removeEventListener('ended', handleEnd)
            cancelAnimationFrame(animationFrame)
        }
    }

    const onCanPlayThrough = () => {
        setIsLoadingAudio(false)
        audioRef.current?.play()
            .then(_ => dispatch(setIsPlaying(true)))
            .catch(_ => console.log('Auto play was prevented because user didnt interact with the document'))
    }

    const initializePlayer = async () => {
        dispatch(setIsPlaying(false))
        if (currentSong?.stream) {
            setIsLoadingAudio(true)
            const isCached = await isAudioCached(currentSong.id)
            if (!isCached) await saveAudioToCache(currentSong.id, currentSong.stream)
            let audioUrl = await getAudioFromCache(currentSong.id)
            if (audioUrl) {
                audioRef.current = new Audio(audioUrl)
                audioRef.current.load()
                audioRef.current.volume = (volume / 100)
                audioRef.current.oncanplaythrough = onCanPlayThrough
                updatePlayerUI()
            }
        }
        currentTimeRef.current && (currentTimeRef.current.innerText = '00:00')
        thumbRef.current && (thumbRef.current.style.cssText = `right: 100%`)
    }

    // initialize player when current song changes and update player UI
    useEffect(() => {
        initializePlayer()
        // Cleanup function runs when song changes or component unmounts
        return () => {
            if (audioRef.current) {
                audioRef.current.oncanplaythrough = null
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [currentSong])

    useEffect(() => {
        const handleSpaceKeyPress = (e: KeyboardEvent) => {
            // Prevent space bar from triggering if user is typing in an input/textarea
            if (e.code === 'Space' && e.target instanceof HTMLElement) {
                const tagName = e.target.tagName.toLowerCase()
                if (tagName === 'input' || tagName === 'textarea' || e.target.isContentEditable) return
                e.preventDefault()
                handleToggleButton()
            }
        }
        const handleArrowKeyPress = (e: KeyboardEvent) => {
            // Prevent arrow keys from triggering if user is typing in an input/textarea
            if ((e.code === 'ArrowLeft' || e.code === 'ArrowRight') && e.target instanceof HTMLElement) {
                const tagName = e.target.tagName.toLowerCase()
                if (tagName === 'input' || tagName === 'textarea' || e.target.isContentEditable) return
                e.preventDefault()
                if (e.code === 'ArrowLeft') handlePrevious()
                if (e.code === 'ArrowRight') handleNext()
            }
        }
        // keyboard event for space bar to play/pause
        window.addEventListener('keydown', handleSpaceKeyPress)
        // keyboard event for left/right arrow to previous/next song
        window.addEventListener('keydown', handleArrowKeyPress)
        return () => {
            window.removeEventListener('keydown', handleSpaceKeyPress)
            window.removeEventListener('keydown', handleArrowKeyPress)
        }
    }, [isPlaying, handleToggleButton, handlePrevious, handleNext])

    // change audio during song playing
    useEffect(() => {
        if (!audioRef.current) return
        audioRef.current.volume = (volume / 100)
    }, [volume])

    // change shuffle mode during song playing
    useEffect(() => {
        if (shuffle) dispatch(shufflePlaylist())
        else dispatch(shufflePlaylist())
        shuffleRef.current = shuffle
    }, [shuffle])

    // change repeat mode during song playing
    useEffect(() => {
        repeatModeRef.current = repeatMode
    }, [repeatMode])

    // for cases when you want to play/pause the song outside the player component
    useEffect(() => {
        if (audioRef.current && audioRef.current.paused && isPlaying) audioRef.current.play()
        if (audioRef.current && !audioRef.current.paused && !isPlaying) audioRef.current.pause()
    }, [isPlaying])

    return (
        <div className={`fixed left-0 right-0 bottom-0 z-20 h-24 content-center bg-main-400 select-none border-t border-main-500/20 shadow-[0_-4px_2px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)]`}>
            <div className='flex justify-between px-5'>
                <div className='flex-1 items-center gap-4 hidden md:flex'>
                    <LazyLoadImage src={currentSong?.thumbnail} effect='blur' alt='thumbnail' className='w-16 h-16 object-cover' />
                    <div>
                        <Typography className='font-semibold text-gray-600 line-clamp-2 text-ellipsis max-w-40'>
                            {currentSong?.title}
                        </Typography>
                        <Typography className='text-gray-500 line-clamp-2 text-ellipsis max-w-40 m-0 lg:text-xs'>
                            {currentSong?.artistNames}
                        </Typography>
                    </div>
                    <Heart size={20} />
                    <Ellipsis size={20} />
                </div>
                <div className='flex flex-1 items-center gap-4 flex-col'>
                    <div className='flex gap-8 items-center'>
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
                        <span className={`${currentPlaylistSongs.length ? 'cursor-pointer' : 'text-gray-500'}`}>
                            <SkipBack size={20} onClick={handlePrevious} />
                        </span>
                        <span onClick={handleToggleButton} className='hover:text-main-500' >
                            {isLoadingAudio ? (
                                <RotatingLines strokeColor='#0E8080' width={42} height={42} />
                            ) : isPlaying ? (
                                <PauseCircle size={42} />
                            ) : (
                                <PlayCircle size={42} />
                            )}
                        </span>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className={`${currentPlaylistSongs.length ? 'cursor-pointer' : 'text-gray-500'}`}>
                                    <SkipForward size={20} onClick={handleNext} />
                                </span>
                            </TooltipTrigger>
                            {nextSong && (
                                <TooltipContent>
                                    <Typography className='font-semibold'>Phát tiếp theo</Typography>
                                    <div className='flex gap-2 items-center'>
                                        <LazyLoadImage
                                            src={nextSong.thumbnail}
                                            effect='blur'
                                            alt='thumbnail'
                                            className='w-10 h-10 object-cover rounded-md'
                                        />
                                        <div>
                                            <Typography className='m-0 text-gray-400'>
                                                {nextSong.title}
                                            </Typography>
                                            <Typography className='m-0 text-gray-400'>
                                                {nextSong.artistNames}
                                            </Typography>
                                        </div>
                                    </div>
                                </TooltipContent>
                            )}
                        </Tooltip>
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
                    <div className='w-full flex items-center justify-center gap-3 text-sm'>
                        <Typography ref={currentTimeRef} className='font-semibold text-gray-500 m-0'>00:00</Typography>
                        <div
                            className='relative h-1 hover:h-2 bg-[#0000001a] w-3/5 rounded-full cursor-pointer'
                            onClick={handleClickProgressBar}
                            onMouseDown={handleMouseDownProgressBar}
                            onMouseMove={handleMouseMoveProgressBar}
                            onMouseUp={handleMouseUpProgressBar}
                            onMouseLeave={handleMouseUpProgressBar}
                            ref={trackRef}
                        >
                            <div ref={thumbRef} className='absolute top-0 left-0 bottom-0 h-full bg-main-500 rounded-full'></div>
                        </div>
                        <Typography className='font-semibold text-gray-500 m-0'>{formatDuration(currentSong?.duration ?? 0)}</Typography>
                    </div>
                </div>
                <div className='flex-1 items-center gap-4 justify-end hidden md:flex'>
                    <LyricsDrawer drawerTrigger={<MicVocal size={20} />} audioRef={audioRef} />
                    <Button size={'icon-lg'} variant={'ghost'} onClick={() => setVolume(volume === 0 ? 50 : 0)}>
                        {volume >= 50 ? <Volume2 /> : volume === 0 ? <VolumeX /> : <Volume1 />}
                    </Button>
                    <input type='range' step={1} min={0} max={100} onChange={(e) => setVolume(Number(e.target.value))} value={volume} className='h-1 hover:h-2' />
                    <Button className='text-white' size={'lg'} onClick={() => dispatch(setShowSidebarRight(!showSideBarRight))}>
                        <MusicIcon />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Player