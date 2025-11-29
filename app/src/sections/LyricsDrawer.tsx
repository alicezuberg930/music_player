import React from "react"
import { Lrc } from 'react-lrc';
import {
    Drawer,
    // DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { useSelector } from "@/redux/store"
import { Typography } from "@/components/ui/typography";

type Props = {
    drawerTrigger: React.ReactNode,
    audioRef: React.RefObject<HTMLAudioElement | null>
}

const LyricsDrawer: React.FC<Props> = ({ drawerTrigger, audioRef }) => {
    const { currentSong } = useSelector(state => state.music)
    const [lyrics, setLyrics] = React.useState<string>("")
    const [currentTime, setCurrentTime] = React.useState(0)
    const activeLyricRef = React.useRef<HTMLDivElement | null>(null)
    const scrollContainerRef = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {
        const downloadLyrics = async () => {
            if (currentSong?.lyricsFile) {
                const res = await fetch(currentSong.lyricsFile)
                const lyrics = await res.text()
                setLyrics(lyrics.replace(/\r\n/g, '\n'))
            }
        }
        downloadLyrics()
        if (audioRef.current) {
            const interval = setInterval(() => {
                if (audioRef.current) setCurrentTime(audioRef.current.currentTime * 1000)
            }, 1500)
            return () => clearInterval(interval)
        }
    }, [audioRef.current])

    React.useEffect(() => {
        if (activeLyricRef.current && scrollContainerRef.current) {
            const containerHeight = activeLyricRef.current.clientHeight
            const lineTop = activeLyricRef.current.offsetTop
            const lineHeight = activeLyricRef.current.clientHeight
            // automatically scroll with enough height so that the active line is centered in the parent container
            const scrollTo = lineTop - (containerHeight / 2) - (lineHeight / 2)
            scrollContainerRef.current.scrollTo({ top: scrollTo, behavior: 'smooth' })
        }
    }, [currentTime])

    return (
        <Drawer>
            <DrawerTrigger asChild>
                {drawerTrigger}
            </DrawerTrigger>
            <DrawerContent className="bg-white/70 min-h-[calc(100vh-96px)] backdrop-blur-md">
                <div className="mx-auto w-full h-screen max-w-6xl relative">
                    <DrawerHeader>
                        <DrawerTitle>Lời bài hát</DrawerTitle>
                        <DrawerDescription>{currentSong?.title} - {currentSong?.artistNames}</DrawerDescription>
                    </DrawerHeader>
                    <div ref={scrollContainerRef} className="h-[65vh] overflow-auto px-4">
                        {lyrics.length > 0 ? (
                            <Lrc
                                lrc={lyrics}
                                currentMillisecond={currentTime}
                                lineRenderer={({ index, active, line }) => (
                                    <Typography
                                        ref={active ? activeLyricRef : null}
                                        key={index} variant={'h4'}
                                        className={`my-8 text-center transition-colors duration-300 ${active ? "text-main-500" : "text-gray-400"}`}
                                    >
                                        {line.content}
                                    </Typography>
                                )}
                            />
                        ) : (
                            <Typography className="text-center text-gray-400">Không có lời bài hát</Typography>
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default LyricsDrawer