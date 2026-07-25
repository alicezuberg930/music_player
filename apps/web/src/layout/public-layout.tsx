import { Outlet } from "@tanstack/react-router"
import SidebarLeft from "./sidebar/sidebar-left"
import SidebarRight from "./sidebar/sidebar-right"
import Player from "./player"
import Header from "./header/header"
import { useDispatch, useSelector } from "@/redux/store"
import { setScrollTop } from "@/redux/slices/app"

export const PublicLayout: React.FC = () => {
    const { showSideBarRight } = useSelector(state => state.app)
    const { currentSong } = useSelector(state => state.music)
    const dispatch = useDispatch()

    const handleScrollTop = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (e.currentTarget.scrollTop === 0) {
            dispatch(setScrollTop(true))
        } else {
            dispatch(setScrollTop(false))
        }
    }

    return (
        <div className={`w-full bg-background  ${currentSong ? 'h-[calc(100vh-96px)]' : 'h-screen'}`}>
            <div className="w-full h-full flex">
                <SidebarLeft />
                <div className="flex-1 flex flex-col relative">
                    <Header />
                    <main className={`px-4 md:px-8 mt-14 pb-12 flex-auto overflow-y-scroll scroll-smooth transition-all duration-600 ease-in-out ${showSideBarRight && 'xl:mr-82.5 mr-0'}`} onScroll={handleScrollTop}>
                        <Outlet />
                    </main>
                </div>
                <SidebarRight />
            </div>
            {currentSong && <Player />}
        </div>
    )
}