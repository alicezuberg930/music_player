import { Link, useLocation } from "@tanstack/react-router"
import { sidebarMenu } from "@/lib/menu-items"
import { Typography } from "@yukikaze/ui/typography"
import { Plus } from "@yukikaze/ui"
import { cn } from "@yukikaze/ui"
import CreateNewPlaylistDialog from "../../pages/me/music/components/create-playlist-dialog"
import { useLocales } from "@/lib/locales"
import { memo, useState } from "react"
import { paths } from "@/lib/paths"
import { Dialog, DialogTrigger } from "@yukikaze/ui/dialog"
import { useAuthContext } from "@/providers/auth-provider"

const SidebarLeft: React.FC = () => {
  const { isAuthenticated } = useAuthContext()
  const { translate } = useLocales()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const isActivePath = (path: string) => {
    const normalized = path.startsWith("/") ? path : `/${path}`
    return (
      location.pathname === normalized ||
      location.pathname.startsWith(`${normalized}/`)
    )
  }

  return (
    <aside className="sm:block hidden lg:w-48 w-20 flex-none border text-sidebar-foreground transition-all duration-500 ease-in-out bg-sidebar">
      <div className="h-full flex flex-col relative">
        <div className="w-full my-5 flex justify-center items-center">
          <img
            src="/favicon.ico"
            alt="logo"
            className="h-12 w-12 object-cover"
          />
          <div className="hidden lg:block ml-1">
            <Typography className="m-0 font-semibold">YukikazeMP3</Typography>
          </div>
        </div>
        <div className="flex flex-col">
          {sidebarMenu.map((value) =>
            !isAuthenticated && value.path === paths.MY_MUSIC ? null : (
              <Link
                to={value.path.startsWith("/") ? value.path : `/${value.path}`}
                key={value.path}
                className={cn(
                  "text-sm px-6 py-2 font-bold flex gap-3 justify-start items-center ring-sidebar-ring [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActivePath(value.path) && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                )}
              >
                {value.icon}
                <Typography className="hidden lg:inline m-0">
                  {translate(value.text)}
                </Typography>
              </Link>
            ),
          )}
        </div>
        {isAuthenticated && (
          <div className="absolute bottom-0 border-t border-gray-400 w-full">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger
                nativeButton={false}
                render={
                  <div className="text-gray-500 text-sm py-2 px-6 font-bold flex gap-3 items-center justify-start" />
                }
              >
                <Plus />
                <Typography className="hidden lg:inline m-0">
                  {translate("create_playlist")}
                </Typography>
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
