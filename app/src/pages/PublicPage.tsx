import { Outlet, useLocation } from "react-router-dom"
import SidebarLeft from "../sections/SidebarLeft"
import SidebarRight from "../sections/SidebarRight"
import Player from "../sections/Player"
import Header from "../sections/Header"
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux"
import { isScrollTop } from "../store/actions/home_actions"

const PublicPage = () => {
    const { showSideBarRight, scrollTop } = useSelector(state => state.app)
    const { currentSongId } = useSelector(state => state.music)
    const location = useLocation();
    const dispatch = useDispatch()

    const handleScrollTop = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (location.pathname.includes("/artist") || location.pathname.includes("/zing-chart")) {
            if (e.currentTarget.scrollTop === 0) {
                dispatch(isScrollTop(true))
            } else {
                dispatch(isScrollTop(false))
            }
        } else {
            dispatch(isScrollTop(false))
        }
    }

    return (
        <>
            <div className="w-full h-screen bg-main-300 overflow-hidden">
                <div className="w-full h-full flex">
                    <SidebarLeft />
                    <div className="flex-1 flex flex-col relative">
                        <div className={`fixed top-0 right-0 xl:right-[330px] left-0 sm:left-[70px] lg:left-[180px] flex-none px-10 py-1 backdrop-blur-md z-50 ${scrollTop ? 'bg-transparent' : 'bg-[rgba(23,15,35,0.8)]'}`}>
                            <Header />
                        </div>
                        <div className="flex-auto overflow-y-scroll overflow-x-hidden py-20 px-2 md:px-6" onScroll={handleScrollTop}>
                            <Outlet />
                        </div>
                        {currentSongId && <Player />}
                    </div>
                    {showSideBarRight && <SidebarRight />}
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default PublicPage