import SearchBar from "./search-bar"
import { ArrowLeft, ArrowRight, cn } from '@yukikaze/ui'
import UserDropdown from "./user-dropdown"
import LanguageDropdown from "./language-dropdown"
import AuthPopover from "./auth-popover"
import { memo } from "react"
import { useAuthContext } from "@/providers/auth-provider"
import { useSelector } from "@/redux/store"

const Header = () => {
    const { showSideBarRight, scrollTop } = useSelector(state => state.app)
    const { isAuthenticated } = useAuthContext()
    const goBack = () => window.history.back()
    const goForward = () => window.history.forward()

    return (
        <header className={cn(
            `fixed top-0 right-0 left-0 z-4 transition-all duration-500 ease-in-out sm:left-20 lg:left-48 flex-none px-4 md:px-8 border-b shadow-xl bg-primary`,
            showSideBarRight && 'xl:right-82.5',
            scrollTop ? '' : 'make bg transparent so that i can see the body'
        )}>
            <div className="w-full flex items-center justify-between gap-2">
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
        </header>
    )
}

export default memo(Header)
