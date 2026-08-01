import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "@tanstack/react-router"
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    closestCenter,
    type DragEndEvent,
    type DragStartEvent,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import SongCard from "@/layout/song-card"
import { setCurrentPlaylistSongs, setCurrentSong, setIsPlaying } from "@/redux/slices/music"
import { getBaseUrl, formatDuration, formatPeopleNumber } from "@/lib/utils"
import { useDispatch, useSelector } from "@/redux/store"
import type { Song } from "@/@types/song"
import { fDate } from "@/lib/format-time"
import { PlayCircle } from '@yukikaze/ui'
import ArtistCard from "@/layout/artist-card"
import { Typography } from "@yukikaze/ui/typography"
import { useMobile } from "@/hooks/use-mobile"
import { useMetaTags } from "@/hooks/use-seo"
import { LazyLoadImage } from "@/components/lazy-load-image"
import { PlaylistDetailsShimmer } from "@/components/loading-placeholder"
import { Spinner } from "@yukikaze/ui/spinner"
import { useQuery } from "@tanstack/react-query"
import { playlistQueries } from "@/lib/queries/playlist"
import SortableSongCard from "./components/sortable-song-card"

const PlaylistPage: React.FC = () => {
    const { id } = useParams({ strict: false })
    const dispatch = useDispatch()
    const isMobile = useMobile()
    const { currentSong, isPlaying, currentPlaylistSongs } = useSelector(state => state.music)
    const [inPlaylist, setInPlaylist] = useState<boolean>(false)
    const [playlistSongs, setPlaylistSongs] = useState<Song[]>([])
    const [activeSong, setActiveSong] = useState<Song | null>(null)
    const location = useLocation()
    const { data, isLoading } = useQuery(playlistQueries().one.queryOptions(id!))
    const navigate = useNavigate()
    const playAlbum = new URLSearchParams(location.search).get("playAlbum") === "true"
    const activeSongIndex = useMemo(() => {
        return activeSong ? playlistSongs.findIndex(song => String(song.id) === String(activeSong.id)) : -1
    }, [activeSong, playlistSongs])
    const activeOrder = useMemo(() => {
        return activeSongIndex >= 0 ? activeSongIndex + 1 : undefined
    }, [activeSongIndex])
    const songIds = useMemo(() => {
        return playlistSongs.map((song) => String(song.id))
    }, [playlistSongs])
    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 6 }
    }))

    useMetaTags({
        title: `Playlist - ${data?.title ?? 'Yukikaze Music Player'}`,
        description: data?.description ?? 'Nghe danh sách phát Yukikaze Music Player.',
        image: data?.thumbnail ?? `${getBaseUrl()}/web-app-manifest-512x512.png`,
        url: `${getBaseUrl()}/playlist/${id}`
    })

    useEffect(() => {
        if (playAlbum && data?.songs) {
            dispatch(setCurrentPlaylistSongs(data?.songs))
            dispatch(setCurrentSong(data?.songs[0]))
            dispatch(setIsPlaying(true))
            navigate({ to: `/playlist/${id}`, replace: true })
        }
    }, [data, id, playAlbum, navigate])

    useEffect(() => {
        if (currentSong) setInPlaylist(currentPlaylistSongs.some((song: Song) => song.id === currentSong.id))
    }, [currentSong])

    useEffect(() => {
        if (data?.songs) setPlaylistSongs(data.songs)
    }, [data?.songs])

    const handleDragStart = (event: DragStartEvent) => {
        const draggingSong = playlistSongs.find((song) => String(song.id) === String(event.active.id))
        setActiveSong(draggingSong ?? null)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (!over || active.id === over.id) {
            setActiveSong(null)
            return
        }

        setPlaylistSongs((prevSongs) => {
            const oldIndex = prevSongs.findIndex(song => String(song.id) === String(active.id))
            const newIndex = prevSongs.findIndex(song => String(song.id) === String(over.id))
            if (oldIndex === -1 || newIndex === -1) return prevSongs

            const nextSongs = arrayMove(prevSongs, oldIndex, newIndex)
            console.log(nextSongs)
            return nextSongs
        })

        setActiveSong(null)
    }

    const handleDragCancel = () => setActiveSong(null)

    return (
        <>
            {isLoading ? (
                <PlaylistDetailsShimmer />
            ) : data && (
                <>
                    <div className="flex flex-col md:flex-row gap-6 mt-10">
                        <div className="w-full md:w-1/4 h-fit space-y-3 relative md:sticky top-10 self-start shrink-0">
                            <div className="relative">
                                <LazyLoadImage
                                    src={data?.thumbnail} alt="thumbnail" effect="blur"
                                    className="w-full aspect-square rounded-lg"
                                    wrapperClassName="w-full"
                                />
                                <div className={`${(inPlaylist && isPlaying) ? 'rounded-full' : 'rounded-md'} text-white absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center`}>
                                    <button onClick={() => dispatch(setIsPlaying(!isPlaying))} aria-label={(inPlaylist && isPlaying) ? 'Pause playlist' : 'Play playlist'}>
                                        {(inPlaylist && isPlaying) ? (
                                            <Spinner className="size-12" />
                                        ) : (
                                            <PlayCircle size={48} />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <Typography className="text-center" variant={'h5'}>{data?.title}</Typography>
                            <div className="flex flex-col items-center gap-2 text-gray-700 text-xs">
                                <span>Cập nhật: {fDate(data?.updatedAt!, 'DD-MM-YYYY')}</span>
                                {data?.artists?.[0]?.alias ? (
                                    <Link
                                        to={`/artist/${data.artists[0].alias}`}
                                        className="text-center"
                                    >
                                        {data?.artistNames}
                                    </Link>
                                ) : (
                                    <span className="text-center">{data?.artistNames}</span>
                                )}
                                <span>{formatPeopleNumber(data?.likes ?? 0)} người yêu thích</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm">
                                <span className="text-gray-700">Lá»i tá»±a: </span>
                                <span>{data?.description}</span>
                            </div>
                            <div className="w-full flex flex-col text-xs text-gray-600">
                                <div className="font-bold flex items-center justify-between p-2">
                                    <div className="w-[45%]">
                                        <span>BÀI HÁT</span>
                                    </div>
                                    <div className="w-[45%]">
                                        <span>ALBUM</span>
                                    </div>
                                    <div className="w-[10%] text-end">
                                        <span>THỜI GIAN</span>
                                    </div>
                                </div>
                                <DndContext
                                    collisionDetection={closestCenter}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                    onDragCancel={handleDragCancel}
                                    sensors={sensors}
                                >
                                    <SortableContext
                                        items={songIds}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="flex flex-col">
                                            {playlistSongs.map((song, index) => (
                                                <SortableSongCard
                                                    key={song.id}
                                                    song={song}
                                                    playlistTitle={data?.title}
                                                    order={index + 1}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                    <DragOverlay dropAnimation={null}>
                                        {activeSong ? (
                                            <div className="w-full bg-white">
                                                <SongCard
                                                    song={activeSong}
                                                    playlistTitle={data?.title}
                                                    order={activeOrder}
                                                />
                                            </div>
                                        ) : null}
                                    </DragOverlay>
                                </DndContext>
                                {data?.totalDuration && (
                                    <div className="flex items-center gap-2 border-t border-[#0000000d] py-2">
                                        <span>{playlistSongs.length} bài hát</span>
                                        <span>{formatDuration(data.totalDuration)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='mt-12'>
                        <Typography variant={'h5'} className="mb-4">Các họa sĩ trong danh sách</Typography>
                        <div className='flex -mx-2'>
                            {data?.artists?.slice(0, isMobile ? 2 : 5).map(artist => (
                                <ArtistCard visibleSlides={isMobile ? 2 : 5} artist={artist} key={artist?.id} />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default PlaylistPage