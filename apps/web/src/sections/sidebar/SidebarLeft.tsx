import { NavLink } from "react-router-dom"
import { sidebarMenu } from "@/lib/menu"
import { Typography } from "@yukikaze/ui/typography"
import { Plus } from '@yukikaze/ui/icons'
import { cn } from "@yukikaze/ui"
import CreateNewPlaylistDialog from "../me/CreateNewPlaylist"
import { useAuthContext } from "@/lib/auth/useAuthContext"
import { useLocales } from "@/lib/locales"
import { memo, useState } from "react"
import { paths } from "@/lib/route/paths"
import { Dialog, DialogTrigger } from "@yukikaze/ui/dialog"

const SidebarLeft: React.FC = () => {
    const { isAuthenticated } = useAuthContext()
    const { translate } = useLocales()
    const [open, setOpen] = useState(false)

    return (
        <aside className="sm:block hidden lg:w-48 w-20 flex-none border bg-main-200 transition-all duration-500 ease-in-out">
            <div className="h-full flex flex-col relative">
                <div className="w-full my-5 flex justify-center items-center">
                    <img src='/favicon.ico' alt="logo" className="h-12 w-12 object-cover" />
                    <div className="hidden lg:block ml-1">
                        <Typography className="m-0 font-semibold">YukikazeMP3</Typography>
                    </div>
                </div>
                <div className="flex flex-col">
                    {sidebarMenu.map(value => (
                        !isAuthenticated && value.path === paths.MY_MUSIC ? null : (
                            <NavLink
                                to={value.path} key={value.path}
                                className={({ isActive }) => cn(
                                    'text-gray-500 text-sm px-6 py-2 font-bold flex gap-3 justify-start items-center',
                                    isActive && 'text-[#0F7070] bg-main-400',
                                )}
                            >
                                {value.icon}
                                <Typography className="hidden lg:inline m-0">{translate(value.text)}</Typography>
                            </NavLink>
                        )))}
                </div>
                {isAuthenticated && (
                    <div className="absolute bottom-0 border-t border-gray-400 w-full">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <div className="text-gray-500 text-sm py-2 px-6 font-bold flex gap-3 items-center justify-start">
                                    <Plus />
                                    <Typography className="hidden lg:inline m-0">{translate('create_playlist')}</Typography>
                                </div>
                            </DialogTrigger>
                            <CreateNewPlaylistDialog onOpenChange={setOpen} />
                        </Dialog>
                    </div>
                )}
            </div>
        </aside>
    )
}

export default memo(SidebarLeft)