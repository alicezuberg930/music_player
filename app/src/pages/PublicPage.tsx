import { Outlet, useLocation } from "react-router-dom"
import SidebarLeft from "../sections/SidebarLeft"
import SidebarRight from "../sections/SidebarRight"
import Player from "../sections/Player"
import Header from "../sections/header/MainHeader"
import { useDispatch, useSelector } from "@/redux/store"
import { setScrollTop } from "@/redux/slices/app"

const PublicPage = () => {
    const { showSideBarRight, scrollTop } = useSelector(state => state.app)
    const { currentSong } = useSelector(state => state.music)
    const location = useLocation();
    const dispatch = useDispatch()

    const handleScrollTop = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (location.pathname.includes("/artist") || location.pathname.includes("/zing-chart")) {
            if (e.currentTarget.scrollTop === 0) {
                dispatch(setScrollTop(true))
            } else {
                dispatch(setScrollTop(false))
            }
        } else {
            dispatch(setScrollTop(false))
        }
    }

    return (
        <div className={`w-full bg-main-300 ${currentSong ? 'h-[calc(100vh-96px)]' : 'h-screen'}`}>
            <div className="w-full h-full flex">
                <SidebarLeft />
                <div className="flex-1 flex flex-col relative">
                    <div className={`fixed top-0 right-0 left-0 z-100 transition-all duration-1500 ease-in-out sm:left-20 lg:left-48 flex-none backdrop-blur-md px-4 md:px-8 ${showSideBarRight && 'xl:right-[330px]'} ${scrollTop ? 'bg-transparent' : 'bg-[#969696cc]'}`}>
                        <Header />
                    </div>
                    <div className={`flex-auto overflow-y-scroll scroll-smooth transition-all duration-1500 ease-in-out ${showSideBarRight && 'xl:mr-[330px] mr-0'}`} onScroll={handleScrollTop}>
                        <div className="px-4 md:px-8 mt-20 mb-6">
                            <Outlet />
                        </div>
                    </div>
                </div>
                <SidebarRight />
            </div>
            {currentSong && <Player />}
        </div>
    )
}

export default PublicPage