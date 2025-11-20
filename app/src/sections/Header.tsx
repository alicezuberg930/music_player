import { Link, useNavigate } from "react-router-dom"
import { icons } from "@/lib/icons"
import SearchBar from "./SearchBar"
import { paths } from "@/lib/paths"
import { Typography } from "@/components/ui/typography"

const Header = () => {
    const { HiArrowNarrowLeft, HiArrowNarrowRight } = icons
    const navigate = useNavigate()

    return (
        <div className="w-full flex items-center justify-between bg-transparent">
            <div className="flex my-2 gap-4 flex-auto">
                <div className="flex items-center text-gray-400 gap-6">
                    <HiArrowNarrowLeft onClick={() => navigate(-1)} size={24} />
                    <HiArrowNarrowRight onClick={() => navigate(1)} size={24} />
                </div>
                <SearchBar />
            </div>
            <Link to={paths.SIGNIN} className="flex-none w-fit">
                <Typography variant={'span'} className="text-white">Đăng nhập</Typography>
            </Link>
        </div>
    )
}

export default Header