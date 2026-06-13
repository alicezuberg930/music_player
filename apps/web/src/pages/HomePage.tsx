import { HomeShimmer } from "@/components/loading-placeholder"
import { homeQueries } from "@/lib/queries/home"
import { ArtistSection, BannerSliderSection, ChartSection, NewReleaseListSection, PlaylistSection } from "@/sections/home"
import { useQuery } from "@tanstack/react-query"

const HomePage: React.FC = () => {
    const { data, isLoading } = useQuery(homeQueries().all.queryOptions())

    const songs = data?.newReleaseSongs ?? []
    const playlists = data?.newPlaylists ?? []
    const artists = data?.weeklyTopArtists ?? []
    const banners = data?.banners ?? []

    return (
        <>
            {isLoading ? (
                <HomeShimmer />
            ) : data && (
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