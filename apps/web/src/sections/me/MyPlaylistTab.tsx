import { useApi } from "@/hooks/useApi"
import PlaylistCard from "@/sections/PlaylistCard"
import { useIsMobile } from "@/hooks/useMobile"
import { PlaylistListShimmer } from "@/components/loading-placeholder"

export const MyPlaylistTab: React.FC = () => {
    const { data: playlistData, isLoading: isPlaylistLoading } = useApi().useUserPlaylistList()
    const isMobile = useIsMobile()

    return (
        <>
            {isPlaylistLoading ? (
                <PlaylistListShimmer />
            ) : playlistData?.data && (
                <div className="flex flex-wrap -mx-3">
                    {playlistData?.data.map(playlist => (
                        <PlaylistCard playlist={playlist} visibleSlides={isMobile ? 2 : 5} key={playlist?.id} />
                    ))}
                </div>
            )}

        </>
    )
}

export default MyPlaylistTab