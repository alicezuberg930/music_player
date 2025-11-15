import { useNavigate } from "react-router-dom"
import { icons } from "@/lib/icons"
import SearchBar from "./SearchBar"

const Header = () => {
    const { HiArrowNarrowLeft, HiArrowNarrowRight } = icons
    const navigate = useNavigate()

    return (
        <div className="w-full flex items-center justify-between bg-transparent">
            <div className="flex my-2 gap-4 w-full">
                <div className="flex items-center text-gray-400 gap-6">
                    <HiArrowNarrowLeft onClick={() => navigate(-1)} size={24} />
                    <HiArrowNarrowRight onClick={() => navigate(1)} size={24} />
                </div>
                <SearchBar />
            </div>
            <div>login</div>
        </div>
    )
}

export default Header