import NewReleaseListSection from "@/sections/home/NewReleaseListSection"
import PlaylistSection from "@/sections/home/PlaylistSection"
import { useSongList, usePlaylistList, useArtistList } from "@/hooks/useApi"
import ArtistSection from "@/sections/home/ArtistSection"


const HomePage: React.FC = () => {
    const { data: songsData } = useSongList()
    const { data: playlistsData } = usePlaylistList()
    const { data: artistsData } = useArtistList()

    const songs = songsData?.data || []
    const playlists = playlistsData?.data || []
    const artists = artistsData?.data || []

    return (
        <>
            <NewReleaseListSection songs={songs} />

            <PlaylistSection playlists={playlists} />

            <ArtistSection artists={artists} />

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
                                <Link to={chart?.link?.split('.')[0]} key={chart?.link} className="flex-1" aria-label={`View ${chart?.country || 'chart'}`}>
                                    <img src={chart?.cover} alt="cover" className="w-full object-cover rounded-md" />
                                </Link>
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