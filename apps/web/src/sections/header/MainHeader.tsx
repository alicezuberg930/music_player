import { useNavigate } from "react-router-dom"
import SearchBar from "./SearchBar"
import { ArrowLeft, ArrowRight } from '@yukikaze/ui/icons'
import { useAuthContext } from "@/lib/auth/useAuthContext"
import UserDropdown from "./UserDropdown"
import LanguageDropdown from "./LanguageDropdown"
import AuthPopover from "./AuthPopover"

const Header = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthContext()

    return (
        <div className="w-full flex items-center justify-between gap-2 bg-transparent">
            <div className="flex my-2 gap-2 flex-auto">
                <div className="flex items-center gap-2 text-white cursor-pointer">
                    <ArrowLeft onClick={() => navigate(-1)} />
                    <ArrowRight onClick={() => navigate(1)} />
                </div>
                <SearchBar />
            </div>
            <LanguageDropdown />
            {isAuthenticated ? (
                <UserDropdown />
            ) : (
                <AuthPopover />
            )}
        </div>
    )
}

export default Header