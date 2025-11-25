import { useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import SongList from "../sections/SongList"
import { setIsPlaying } from "@/redux/slices/music"
import { roundPeopleAmount } from "@/lib/utils"
import { fetchPlaylist } from "@/lib/httpClient"
import { Audio, Triangle } from "react-loader-spinner"
import { icons } from "@/lib/icons"
import { useDispatch, useSelector } from "@/redux/store"
import type { Playlist } from "@/@types/playlist"

const PlaylistPage = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [playlist, setPlaylist] = useState<Playlist | null>(null)
    const { currentSong, isPlaying, currentPlaylistSongs } = useSelector(state => state.music)
    const { BsPlayFill } = icons
    const [inPlaylist, setInPlaylist] = useState(false)
    const [isLoading, setLoading] = useState(true)
    // const location = useLocation()

    const getPlaylist = async () => {
        try {
            setPlaylist(null)
            setLoading(true)
            const response = await fetchPlaylist(id!)
            console.log(response)
            // if (response.err === 0) {
            //     setPlaylist(response.data)
            // }
            // setLoading(false)
            // return response.data
        } catch (error) {
            // toast.error(error as string)
            // return error
        }
    }

    useEffect(() => {
        // setInPlaylist(songs.some(value => value.encodeId === currentSongId))
        getPlaylist().then(_ => {
            //     if (location.state?.playAlbum) {
            //         const random = Math.round(Math.random() * (pl?.song?.items?.length - 1))
            //         dispatch(setCurrentSong(pl?.song?.items[random]))
            //         dispatch(setPlay(true))
            //     }
        })
    }, [id])

    useEffect(() => {
        setInPlaylist(currentPlaylistSongs.some(song => song.id === currentSong?.id))
    }, [currentSong])

    // useEffect(() => {
    //     const autoPlaySong = (items) => {
    //         if (location.state?.playAlbum) {
    //             const random = Math.round(Math.random() * (items.length - 1))
    //             dispatch(setCurrentSong(items[random]))
    //             dispatch(setIsPlaying(true))
    //         }
    //     }

    //     autoPlaySong(playlist?.song?.items)
    // }, [id])

    return (
        <div className="flex relative justify-between gap-4 h-full">
            {isLoading && (
                <div className="absolute top-0 left-0 bottom-0 right-0 z-10 bg-main-200 flex items-center justify-center">
                    <Triangle height={60} width={60} />
                </div>
            )}
            {playlist && (
                <>
                    <div className="w-1/4 items-center flex flex-col gap-3">
                        <div className="w-full relative">
                            <img src={playlist.thumbnail} alt="thumbnail"
                                className={`w-full object-contain shadow-md ${(inPlaylist && isPlaying) ? 'rounded-full animate-rotate-center' : 'rounded-md animate-rotate-center-pause'}`}
                            />
                            <div className={`${(inPlaylist && isPlaying) ? 'rounded-full' : 'rounded-md'} text-white absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center`}>
                                <span className="border border-white rounded-full p-2" onClick={() => dispatch(setIsPlaying(!isPlaying))}>
                                    {(inPlaylist && isPlaying) ? <Audio color="white" width={30} height={30} /> : <BsPlayFill size={30} />}
                                </span>
                            </div>
                        </div>
                        <h3 className="text-[20px] font-bold text-gray-800">{playlist.title}</h3>
                        <div className="flex flex-col items-center gap-2 text-gray-500 text-xs">
                            <span>Cập nhật: {playlist.updatedAt}</span>
                            <NavLink to="artist" className="text-center">
                                <span className="text-center">{playlist.artistNames}</span>
                            </NavLink>
                            <span>{roundPeopleAmount(playlist.likes)} người yêu thích</span>
                        </div>
                    </div>
                    <div className="w-3/4 h-full overflow-y-scroll">
                        <div className="text-sm">
                            <span className="text-gray-500">Lời tựa </span>
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
    )
}

export default PlaylistPage