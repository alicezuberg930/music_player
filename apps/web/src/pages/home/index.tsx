import { HomeShimmer } from "@/components/loading-placeholder"
import { homeQueries } from "@/lib/queries/home"
import { ArtistSection, BannerSlider, WeekChart, NewReleaseList, PlaylistSection } from "@/pages/home/components"
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
                    <BannerSlider banners={banners} />

                    <NewReleaseList songs={songs} />

                    <PlaylistSection playlists={playlists} />

                    <ArtistSection artists={artists} />

                    <WeekChart />
                </>
            )}
        </>
    )
}

export default HomePage