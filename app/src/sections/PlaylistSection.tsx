import { useSelector } from "react-redux"
import PlaylistCard from "./PlaylistCard"

type Props = {
    playlists: any[]
}

const PlaylistSection = ({ playlists }: Props) => {
    const { screenWidth } = useSelector(state => state.app)
    let displayAmount = 5
    if (screenWidth < 1024) displayAmount = 4
    if (screenWidth < 768) displayAmount = 3
    if (screenWidth < 640) displayAmount = 2
    if (screenWidth < 475) displayAmount = 1

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold">{playlists?.title}</h3>
                <span className="text-xs uppercase">Tất cả</span>
            </div>
            <div className="-mx-3 flex items-start justify-start">
                {
                    playlists?.items?.slice(0, displayAmount).map(item => {
                        return (
                            <PlaylistCard item={item} visibleSlides={displayAmount} sectionId={playlists?.sectionId} key={item?.encodeId} />
                        )
                    })
                }
            </div>
        </div>
    )
}
export default PlaylistSection