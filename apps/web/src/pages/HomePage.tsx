import { useApi } from "@/hooks/useApi"
import { HomeShimmer } from "@/components/loading-placeholder"
import { ArtistSection, BannerSliderSection, ChartSection, NewReleaseListSection, PlaylistSection } from "@/sections/home"

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
                <HomeShimmer />
            ) : home && (
                <>
                    <BannerSliderSection banners={banners} />

                    <NewReleaseListSection songs={songs} />

                    <PlaylistSection playlists={playlists} />

                    <ArtistSection artists={artists} />

                    <ChartSection />
                </>
            )}
        </>
    )
}

export default HomePage