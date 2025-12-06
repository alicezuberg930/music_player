import { useEffect, useState } from "react"
import { NavLink, useLocation, useParams } from "react-router-dom"
import SongList from "../sections/SongList"
import { setCurrentPlaylistSongs, setCurrentSong, setIsPlaying } from "@/redux/slices/music"
import { getBaseUrl, roundPeopleAmount } from "@/lib/utils"
import { fetchPlaylist } from "@/lib/httpClient"
import { Audio } from "react-loader-spinner"
import { useDispatch, useSelector } from "@/redux/store"
import type { Playlist } from "@/@types/playlist"
import { fDate } from "@/lib/formatTime"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { PlayCircle } from "lucide-react"
import ArtistCard from "@/sections/ArtistCard"
import { Typography } from "@/components/ui/typography"
import { useIsMobile } from "@/hooks/useMobile"
import { useMetaTags } from "@/hooks/useMetaTags"

const PlaylistPage: React.FC = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const isMobile = useIsMobile()
    const { currentSong, isPlaying, currentPlaylistSongs } = useSelector(state => state.music)
    const [playlist, setPlaylist] = useState<Playlist | null>(null)
    const [inPlaylist, setInPlaylist] = useState<boolean>(false)
    const location = useLocation()

    useMetaTags({
        title: playlist?.title || 'Playlist - Yukikaze Music Player',
        description: playlist?.description || 'Nghe playlist của bạn trên Yukikaze Music Player.',
        image: playlist?.thumbnail || `${getBaseUrl()}/web-app-manifest-512x512.png`,
        url: `${getBaseUrl()}/playlist/${id}`
    })

    const getPlaylist = async () => {
        try {
            const response = await fetchPlaylist(id!)
            if (response.statusCode && response.statusCode === 200) {
                setPlaylist(response.data)
                // Only auto-play if navigating from PlaylistCard
                if (location.state?.playAlbum) {
                    dispatch(setCurrentPlaylistSongs(response.data.songs))
                    dispatch(setCurrentSong(response.data.songs[0]))
                    dispatch(setIsPlaying(true))
                    // Clear the state so it doesn't auto-play on subsequent visits
                    globalThis.history.replaceState({}, document.title)
                }
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getPlaylist()
    }, [])

    useEffect(() => {
        if (currentSong) setInPlaylist(currentPlaylistSongs.some(song => song.id === currentSong.id))
    }, [currentSong])

    return (
        <>
            <div className="flex flex-col md:flex-row gap-6">
                {playlist && (
                    <>
                        <div className="w-full md:w-1/4 h-fit space-y-3 relative md:sticky md:top-20 self-start shrink-0">
                            <div className="relative">
                                <LazyLoadImage
                                    src={playlist.thumbnail} alt="thumbnail" effect="blur"
                                    className="w-full aspect-square rounded-lg"
                                    wrapperClassName="w-full"
                                />
                                <div className={`${(inPlaylist && isPlaying) ? 'rounded-full' : 'rounded-md'} text-white absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center`}>
                                    <span onClick={() => dispatch(setIsPlaying(!isPlaying))}>
                                        {(inPlaylist && isPlaying) ? (
                                            <Audio color="white" width={48} height={48} />
                                        ) : (
                                            <PlayCircle size={48} />
                                        )}
                                    </span>
                                </div>
                            </div>
                            <Typography className="text-center" variant={'h5'}>{playlist.title}</Typography>
                            <div className="flex flex-col items-center gap-2 text-gray-500 text-xs">
                                <span>Cập nhật: {fDate(playlist.updatedAt, 'dd-MM-yyyy')}</span>
                                <NavLink to="artist" className="text-center">
                                    {playlist.artistNames}
                                </NavLink>
                                <span>{roundPeopleAmount(playlist.likes)} người yêu thích</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm">
                                <span className="text-gray-500">Lời tựa: </span>
                                <span>{playlist.description}</span>
                            </div>
                            <SongList
                                songs={playlist.songs}
                                playlistTitle={playlist.title}
                                totalDuration={playlist.totalDuration}
                            />
                        </div>
                    </>
                )}
            </div>
            <div className='mt-12'>
                <Typography variant={'h5'} className="mb-4">Các họa sĩ trong danh sách</Typography>
                <div className='flex -mx-2'>
                    {playlist?.artists?.slice(0, isMobile ? 2 : 5).map(artist => (
                        <ArtistCard visibleSlides={isMobile ? 2 : 5} artist={artist} key={artist?.id} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default PlaylistPage