import { useNavigate } from "react-router-dom"
import { icons } from "@/lib/icons"

type Props = {
    item: any
    sectionId?: string
    isSearch?: boolean
    visibleSlides?: number
}

const PlaylistCard = ({ item, sectionId, isSearch, visibleSlides = 5 }: Props) => {
    let link = item?.link?.split('.')[0]
    const { BsPlayFill, AiOutlineHeart, BsThreeDots } = icons
    const navigate = useNavigate()

    return (
        <div className={`text-sm flex flex-col gap-3 cursor-pointer px-3 ${isSearch ? 'mb-5' : ''}`}
            onClick={() => navigate(link, { state: { playAlbum: false } })}
            style={{ width: `${100 / visibleSlides}%`, flex: '0 0 auto' }}
        >
            <div className="relative w-full group overflow-hidden rounded-lg">
                <div className="text-white absolute top-0 bottom-0 left-0 right-0 gap-3 bg-overlay z-20 invisible group-hover:visible flex items-center justify-center">
                    <span><AiOutlineHeart size={25} /></span>
                    <span onClick={(e) => { e.stopPropagation(); navigate(link, { state: { playAlbum: true } }) }}
                        className="p-1 border border-white rounded-full"
                    >
                        <BsPlayFill size={35} />
                    </span>
                    <span><BsThreeDots size={25} /></span>
                </div>
                <img src={item?.thumbnailM} alt={item?.encodeId} className="w-full z-10 group-hover:animate-scale-up-center object-contain" />
            </div>
            <div>
                <span className="font-semibold line-clamp-1">{item?.title}</span>
                <span className="line-clamp-2">{sectionId && sectionId === "h100" ? item?.artistsNames : item?.sortDescription}</span>
            </div>
        </div>
    )
}

export default PlaylistCard