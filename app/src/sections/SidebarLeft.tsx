import { NavLink } from "react-router-dom"
import { sidebarMenu } from "@/lib/menu"
import { Typography } from "@/components/ui/typography"
import { Music, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import CreateNewPlaylistDialog from "./me/CreateNewPlaylist"
import { useAuthContext } from "@/lib/auth/useAuthContext"
import { useLocales } from "@/lib/locales"
import { memo } from "react"
import { paths } from "@/lib/route/paths"

const SidebarLeft: React.FC = () => {
    const { isAuthenticated } = useAuthContext()
    const { translate } = useLocales()

    return (
        <div className="sm:block hidden lg:w-48 w-20 flex-none border bg-main-200 transition-all duration-1500 ease-in-out">
            <div className="h-full flex flex-col relative">
                <div className="w-full h-16 py-4 px-6 flex justify-start items-center gap-1">
                    <img src='/favicon.ico' alt="logo" className="h-12 w-12 object-cover" />
                    <div className="hidden lg:block">
                        <Typography className="m-0 font-semibold">YukikazeMP3</Typography>
                    </div>
                </div>
                <div className="flex flex-col">
                    {sidebarMenu.map(value => (
                        <NavLink
                            to={value.path} key={value.path}
                            className={({ isActive }) => cn(
                                'text-gray-500 text-sm py-2 px-6 font-bold flex gap-3 items-center justify-start',
                                isActive && 'text-[#0F7070] bg-main-100'
                            )}
                        >
                            {value.icon}
                            <Typography className="hidden lg:inline m-0">{translate(value.text)}</Typography>
                        </NavLink>
                    ))}
                </div>
                {isAuthenticated && (
                    <div className="absolute bottom-0 border-t border-gray-400 w-full">
                        <div className="text-gray-500 text-sm py-2 px-6 font-bold flex gap-3 items-center justify-start">
                            <Music />
                            <NavLink
                                to={paths.MY_MUSIC}
                                className={({ isActive }) => cn(
                                    'text-gray-500 text-sm py-2 px-6 font-bold flex gap-3 items-center justify-start',
                                    isActive && 'text-[#0F7070] bg-main-100'
                                )}
                            >
                                {translate('my_music')}
                            </NavLink>
                        </div>
                        <CreateNewPlaylistDialog
                            triggerElement={
                                <div className="text-gray-500 text-sm py-2 px-6 font-bold flex gap-3 items-center justify-start">
                                    <Plus />
                                    <Typography className="hidden lg:inline m-0">{translate('create_playlist')}</Typography>
                                </div>
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default memo(SidebarLeft)