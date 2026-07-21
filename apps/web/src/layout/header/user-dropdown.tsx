import { Avatar, AvatarFallback, AvatarImage } from "@yukikaze/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@yukikaze/ui/dropdown-menu"
import { useLocales } from "@/lib/locales"
import { paths } from "@/lib/paths"
import { LogOut, Settings, Spotlight, Upload, User } from "@yukikaze/ui"
import { Link } from "@tanstack/react-router"
import { useTheme } from "@yukikaze/ui"
import { memo } from "react"
import { useAuthContext } from "@/providers/auth-provider"

const UserDropdown: React.FC = () => {
  const { user, signOut } = useAuthContext()
  const { translate } = useLocales()
  const { setTheme, themes } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger nativeButton={false} render={<Avatar />}>
        {user?.avatar ? (
          <AvatarImage src={user?.avatar} alt={user?.id} />
        ) : (
          <AvatarFallback>{user?.fullname.charAt(0)}</AvatarFallback>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-100" align="end">
        <DropdownMenuLabel>{translate("my_account")}</DropdownMenuLabel>
        <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link to={paths.UPLOAD_MUSIC}>{translate("profile")}</Link>
            <DropdownMenuShortcut>
              <User />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={paths.UPLOAD_MUSIC}>{translate("settings")}</Link>
            <DropdownMenuShortcut>
              <Settings />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={paths.UPLOAD_MUSIC}>{translate("upload_music")}</Link>
            <DropdownMenuShortcut>
              <Upload />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to={paths.ADD_ARTIST}>{translate("add_artist")}</Link>
            <DropdownMenuShortcut>
              <Spotlight />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {translate("switch_theme")}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {themes.map((t) => (
                  <DropdownMenuItem key={t} onClick={() => setTheme(t)}>
                    {t}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          {translate("logout")}
          <DropdownMenuShortcut>
            <LogOut />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default memo(UserDropdown)
