import NewReleaseListSection from "@/sections/home/NewReleaseListSection"
import PlaylistSection from "@/sections/home/PlaylistSection"
import { useApi } from "@/hooks/useApi"
import ArtistSection from "@/sections/home/ArtistSection"
import BannerSliderSection from "@/sections/home/BannerSliderSection"
import HomeLoadingShimmer from "@/components/loading-placeholder/HomeLoadingShimmer"

const HomePage: React.FC = () => {
    const { useHomeData } = useApi()
    const { data: home, isLoading } = useHomeData()

    const songs = home?.data?.newReleaseSongs ?? []
    const playlists = home?.data?.newPlaylists ?? []
    const artists = home?.data?.weeklyTopArtists ?? []
    const banners = home?.data?.banners ?? []

    return (
        <>
            {isLoading ? (
                <HomeLoadingShimmer />
            ) : home && (
                <>
                    <BannerSliderSection banners={banners} />

                    <NewReleaseListSection songs={songs} />

                    <PlaylistSection playlists={playlists} />

                    <ArtistSection artists={artists} />
                </>
            )}

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