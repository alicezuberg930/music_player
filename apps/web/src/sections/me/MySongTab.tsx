import { SongListShimmer } from "@/components/loading-placeholder"
import { useApi } from "@/hooks/useApi"
import SongList from "../SongList"

export const MySongTab: React.FC = () => {
    const { data: songData, isLoading: isSongLoading } = useApi().useUserSongList()

    return (
        <>
            {isSongLoading ? (
                <SongListShimmer showHeader={true} count={10} />
            ) : songData?.data && (
                <SongList songs={songData?.data} showHeader={true} />
            )}
        </>
    )
}

export default MySongTab