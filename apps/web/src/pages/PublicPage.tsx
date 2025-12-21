import { Outlet } from "react-router-dom"
import SidebarLeft from "../sections/sidebar/SidebarLeft"
import SidebarRight from "../sections/sidebar/SidebarRight"
import Player from "../sections/Player"
import Header from "../sections/header/MainHeader"
import { useDispatch, useSelector } from "@/redux/store"
import { setScrollTop } from "@/redux/slices/app"

const PublicPage: React.FC = () => {
    const { showSideBarRight, scrollTop } = useSelector(state => state.app)
    const { currentSong } = useSelector(state => state.music)
    const dispatch = useDispatch()

    const handleScrollTop = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (e.currentTarget.scrollTop === 0) {
            dispatch(setScrollTop(true))
        } else {
            dispatch(setScrollTop(false))
        }
    }

    console.log(scrollTop)

    return (
        <div className={`w-full bg-main-300 ${currentSong ? 'h-[calc(100vh-96px)]' : 'h-screen'}`}>
            <div className="w-full h-full flex">
                <SidebarLeft />
                <div className="flex-1 flex flex-col relative">
                    <header className={`fixed top-0 right-0 left-0 z-4 transition-all duration-500 ease-in-out sm:left-20 lg:left-48 flex-none px-4 md:px-8 ${showSideBarRight && 'xl:right-[330px]'} ${scrollTop ? 'bg-main-500 backdrop-blur-xl' : 'bg-main-400 backdrop-blur-xl'}`}>
                        <Header />
                    </header>
                    <main className={`px-4 md:px-8 mt-14 pb-12 flex-auto overflow-y-scroll scroll-smooth transition-all duration-600 ease-in-out ${showSideBarRight && 'xl:mr-[330px] mr-0'}`} onScroll={handleScrollTop}>
                        <Outlet />
                    </main>
                </div>
                <SidebarRight />
            </div>
            {currentSong && <Player />}
        </div>
    )
}

export default PublicPage