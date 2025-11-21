import { Link, useNavigate } from "react-router-dom"
import SearchBar from "./SearchBar"
import { paths } from "@/lib/paths"
import { Typography } from "@/components/ui/typography"
import { ArrowLeft, ArrowRight } from "lucide-react"

const Header = () => {
    const navigate = useNavigate()

    return (
        <div className="w-full flex items-center justify-between bg-transparent gap-2">
            <div className="flex my-2 gap-2 flex-auto">
                <div className="flex items-center gap-6">
                    <ArrowLeft onClick={() => navigate(-1)} className="cursor-pointer hover:text-white transition-colors" />
                    <ArrowRight onClick={() => navigate(1)} className="cursor-pointer hover:text-white transition-colors" />
                </div>
                <SearchBar />
            </div>
            <Link to={paths.SIGNIN} className="flex-none">
                <Typography variant={'span'} className="text-white">Đăng nhập</Typography>
            </Link>
        </div>
    )
}

export default Header