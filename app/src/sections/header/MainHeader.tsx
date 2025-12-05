import { Link, useNavigate } from "react-router-dom"
import SearchBar from "./SearchBar"
import { paths } from "@/lib/route/paths"
import { Typography } from "@/components/ui/typography"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useAuthContext } from "@/lib/auth/useAuthContext"
import UserDropdown from "./UserDropdown"
import LanguageDropdown from "./LanguageDropdown"

const Header = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthContext()

    return (
        <div className="w-full flex items-center justify-between gap-2">
            <div className="flex my-2 gap-2 flex-auto">
                <div className="flex items-center gap-2 text-white">
                    <ArrowLeft onClick={() => navigate(-1)} className="cursor-pointer" />
                    <ArrowRight onClick={() => navigate(1)} className="cursor-pointer" />
                </div>
                <SearchBar />
            </div>
            <LanguageDropdown />
            {isAuthenticated ? (
                <UserDropdown />
            ) : (
                <Link to={paths.SIGNIN} className="flex-none">
                    <Typography variant={'span'} className="text-white">Đăng nhập</Typography>
                </Link>
            )}
        </div>
    )
}

export default Header