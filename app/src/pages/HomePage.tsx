import NewReleaseList from "@/sections/NewReleaseList"
import PlaylistSection from "@/sections/PlaylistSection"
import type { Song } from "@/@types/song"
import { useEffect, useState } from "react"
import { fetchPlaylistList, fetchSongList } from "@/lib/httpClient"
import type { Playlist } from "@/@types/playlist"

const HomePage: React.FC = () => {
    const [songs, setSongs] = useState<Song[]>([])
    const [playlists, setPlaylists] = useState<Playlist[]>([])

    const setNewReleaseSongs = async () => {
        try {
            const response = await fetchSongList()
            setSongs(response.data || [])
        } catch (error) {
            console.log(error)
        }
    }

    const setNewPlaylists = async () => {
        try {
            const response = await fetchPlaylistList()
            setPlaylists(response.data || [])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setNewReleaseSongs()
        setNewPlaylists()
    }, [])

    return (
        <>
            <NewReleaseList songs={songs} />

            <PlaylistSection playlists={playlists} />

            {/* <div>
                <HomeBannerSlider />
                {
                    playlistsList?.map((playlists, i) => {
                        return (<PlaylistSection key={i} playlists={playlists} />)
                    })
                }
                <ChartSection />
                <div className="flex items-center w-full mt-12 gap-7">
                    {
                        weekCharts?.map(chart => {
                            return (
                                <Link to={chart?.link?.split('.')[0]} key={chart?.link} className="flex-1">
                                    <img src={chart?.cover} alt="cover" className="w-full object-cover rounded-md" />
                                </Link>
                            )
                        })
                    }
                </div>
                <div className="mt-12 flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">{(favoriteArtistsHC || favoriteArtists)?.title}</h3>
                        <span className="text-xs uppercase">Tất cả</span>
                    </div>
                    <div className="flex gap-3">
                        {
                            (favoriteArtistsHC || favoriteArtists)?.items?.slice(0, 5)?.map(singer => {
                                return (
                                    <Link key={singer?.encodeId} className="flex-1 relative h-80">
                                        <img src={singer?.thumbnail} alt={singer?.encodeId} className="w-full h-full object-cover rounded-md" />
                                        <div className="absolute w-full flex justify-evenly bottom-[5%]">
                                            <img src={singer?.song?.items[0]?.thumbnail} alt="song" className="w-1/4 rounded-md object-cover" />
                                            <img src={singer?.song?.items[1]?.thumbnail} alt="song" className="w-1/4 rounded-md object-cover" />
                                            <img src={singer?.song?.items[2]?.thumbnail} alt="song" className="w-1/4 rounded-md object-cover" />
                                        </div>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flex items-center mt-12 gap-4">
                    {
                        (spotLightArtistsHC || spotLightArtists)?.slice(0, 6)?.map(artist => {
                            return (
                                <ArtistCard artist={artist} key={artist?.id} />
                            )
                        })
                    }
                </div>
            </div> :
            <div className="w-full h-full flex items-center justify-center">
                <Triangle height={80} width={80} />
            </div> */}
        </>
    )
}

export default HomePage