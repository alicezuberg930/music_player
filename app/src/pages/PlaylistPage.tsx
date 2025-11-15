import { useEffect, useState } from "react"
import { NavLink, useLocation, useParams } from "react-router-dom"
import SongList from "../sections/SongList"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentSongId, setPlay } from "../store/actions/music_actions"
import { convertMillisecondsToDate, roundPeopleAmount } from "../utils/utils"
import { getDetailsPlaylist } from "../services/api.service"
import { Audio, Triangle } from "react-loader-spinner"
import { icons } from "../utils/icons"
import { toast } from "react-toastify"

const PlaylistPage = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const [playlist, setPlaylist] = useState<any>([])
    const { currentSongId, isPlaying, songs } = useSelector(state => state.music)
    const { BsPlayFill } = icons
    const [inPlaylist, setInPlaylist] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const location = useLocation()

    const fetchPlaylist = async () => {
        try {
            const response = await getDetailsPlaylist(id)
            if (response.err === 0) {
                setPlaylist(response.data)
            }
            setLoading(false)
            return response.data
        } catch (error) {
            toast.error(error as string)
            return error
        }
    }

    useEffect(() => {
        setInPlaylist(songs.some(value => value.encodeId === currentSongId))
        fetchPlaylist(id).then(pl => {
            if (location.state?.playAlbum) {
                const random = Math.round(Math.random() * (pl?.song?.items?.length - 1))
                dispatch(setCurrentSongId(pl?.song?.items[random]?.encodeId))
                dispatch(setPlay(true))
            }
        })
    }, [id])

    useEffect(() => {
        setInPlaylist(songs.some(value => value.encodeId === currentSongId))
    }, [currentSongId])

    // useEffect(() => {
    //     const autoPlaySong = (items) => {
    //         if (location.state?.playAlbum) {
    //             const random = Math.round(Math.random() * (items.length - 1))
    //             dispatch(setCurrentSongId(items[random]?.encodeId))
    //             dispatch(setPlay(true))
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
            <div className="w-1/4 items-center flex flex-col gap-3">
                <div className="w-full relative">
                    <img src={playlist?.thumbnailM} alt="thumbnail"
                        className={`w-full object-contain shadow-md ${(inPlaylist && isPlaying) ? 'rounded-full animate-rotate-center' : 'rounded-md animate-rotate-center-pause'}`}
                    />
                    <div className={`${(inPlaylist && isPlaying) ? 'rounded-full' : 'rounded-md'} text-white absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center`}>
                        <span className="border border-white rounded-full p-2" onClick={() => dispatch(setPlay(!isPlaying))}>
                            {(inPlaylist && isPlaying) ? <Audio color="white" width={30} height={30} /> : <BsPlayFill size={30} />}
                        </span>
                    </div>
                </div>
                <h3 className="text-[20px] font-bold text-gray-800">{playlist?.title}</h3>
                <div className="flex flex-col items-center gap-2 text-gray-500 text-xs">
                    <span>Cập nhật: {convertMillisecondsToDate(playlist?.contentLastUpdate * 1000)}</span>
                    <NavLink to="artist" className="text-center">
                        <span className="text-center">{playlist?.artistsNames}</span>
                    </NavLink>
                    <span>{roundPeopleAmount(playlist?.like)} người yêu thích</span>
                </div>
            </div>
            <div className="w-3/4 h-full overflow-y-scroll">
                <div className="text-sm">
                    <span className="text-gray-500">Lời tựa </span>
                    <span>{playlist?.sortDescription}</span>
                </div>
                <SongList songs={playlist?.song?.items} playlistTitle={playlist?.title} totalDuration={playlist?.song?.totalDuration} />
            </div>
        </div>
    )
}

export default PlaylistPage