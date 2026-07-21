import SearchBar from "./search-bar"
import { ArrowLeft, ArrowRight } from '@yukikaze/ui'
import UserDropdown from "./user-dropdown"
import LanguageDropdown from "./language-dropdown"
import AuthPopover from "./auth-popover"
import { memo } from "react"
import { useAuthContext } from "@/providers/auth-provider"

const Header = () => {
    const { isAuthenticated } = useAuthContext()
    const goBack = () => window.history.back()
    const goForward = () => window.history.forward()

    return (
        <div className="w-full flex items-center justify-between gap-2 bg-transparent">
            <div className="flex my-2 gap-2 flex-auto">
                <div className="flex items-center gap-2 text-white cursor-pointer">
                    <ArrowLeft onClick={goBack} />
                    <ArrowRight onClick={goForward} />
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

export default memo(Header)
