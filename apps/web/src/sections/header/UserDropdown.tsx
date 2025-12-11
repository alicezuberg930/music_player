import { Avatar, AvatarFallback, AvatarImage } from "@yukikaze/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@yukikaze/ui/dropdown-menu"
import { useAuthContext } from "@/lib/auth/useAuthContext"
import { useLocales } from "@/lib/locales"
import { paths } from "@/lib/route/paths"
import { LogOut, Settings, Spotlight, Upload, User } from '@yukikaze/ui/icons'
import { Link } from "react-router-dom"

const UserDropdown: React.FC = () => {
    const { user, signout } = useAuthContext()
    const { translate } = useLocales()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    {user?.avatar ? (
                        <AvatarImage src={user?.avatar} alt={user?.id} />
                    ) : (
                        <AvatarFallback>{user?.fullname.charAt(0)}</AvatarFallback>
                    )}
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 z-100" align='end'>
                <DropdownMenuLabel>{translate('my_account')}</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link to={paths.UPLOAD_MUSIC}>{translate('profile')}</Link>
                        <DropdownMenuShortcut>
                            <User />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link to={paths.UPLOAD_MUSIC}>{translate('settings')}</Link>
                        <DropdownMenuShortcut>
                            <Settings />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link to={paths.UPLOAD_MUSIC}>{translate('upload_music')}</Link>
                        <DropdownMenuShortcut>
                            <Upload />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link to={paths.ADD_ARTIST}>{translate('add_artist')}</Link>
                        <DropdownMenuShortcut>
                            <Spotlight />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {/* <DropdownMenuGroup>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>Email</DropdownMenuItem>
                                <DropdownMenuItem>Message</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>More...</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem>
                        New Team
                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup> */}
                {/* <DropdownMenuSeparator /> */}
                {/* <DropdownMenuItem>GitHub</DropdownMenuItem> */}
                {/* <DropdownMenuItem>Support</DropdownMenuItem> */}
                {/* <DropdownMenuItem disabled>API</DropdownMenuItem> */}
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuItem onClick={signout}>
                    {translate('logout')}
                    <DropdownMenuShortcut>
                        <LogOut />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown