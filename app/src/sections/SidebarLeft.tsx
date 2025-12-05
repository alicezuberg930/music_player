import { NavLink } from "react-router-dom"
import { sidebarMenu } from "@/lib/menu"
import { Typography } from "@/components/ui/typography"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import CreateNewPlaylistDialog from "./me/CreateNewPlaylist"
import { useAuthContext } from "@/lib/auth/useAuthContext"
import { useLocales } from "@/lib/locales"

const SidebarLeft: React.FC = () => {
    const { isAuthenticated } = useAuthContext()
    const { translate } = useLocales()

    return (
        <div className="sm:block hidden lg:w-48 w-20 flex-none border bg-main-200 transition-all duration-1500 ease-in-out">
            <div className="h-full flex flex-col relative">
                <div className="w-full h-16 py-4 px-6 flex justify-start items-center gap-1">
                    <img src='/vite.svg' alt="logo" />
                    <div className="hidden lg:block">
                        <Typography className="m-0 font-semibold">Tiến's MP3</Typography>
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
                    <CreateNewPlaylistDialog
                        triggerElement={
                            <div className="text-gray-500 text-sm py-2 px-6 font-bold flex gap-3 items-center justify-start absolute bottom-0 border-t border-gray-400 w-full">
                                <Plus />
                                <Typography className="hidden lg:inline m-0">{translate('create_playlist')}</Typography>
                            </div>
                        }
                    />
                )}
            </div>
        </div>
    )
}

export default SidebarLeft