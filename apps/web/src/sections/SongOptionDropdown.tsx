import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@yukikaze/ui/dropdown-menu"
import { useLocales } from "@/lib/locales"
import { Heart, ListFilterPlusIcon, ListMusic, Plus } from '@yukikaze/ui/icons'
import CreateNewPlaylistDialog from "./me/CreateNewPlaylist"
import { useState } from "react"
import { type Playlist } from "@/@types/playlist"
import { Dialog, DialogTrigger } from "@yukikaze/ui/dialog"

type Props = {
    addToPlaylist: (playlistId: string) => void
    triggerElement: React.ReactNode
    playlists?: Playlist[]
}

const SongOptionDropdown: React.FC<Props> = ({ addToPlaylist, triggerElement, playlists }) => {
    const { translate } = useLocales()
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {triggerElement}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52">
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Heart />
                            Yêu Thích
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {/* <DropdownMenuItem onClick={addToPlaylist}>
                        <ListFilterPlusIcon />
                        Thêm vào danh sách
                    </DropdownMenuItem> */}
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <ListFilterPlusIcon />
                                {translate('add_to_playlist')}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem >
                                            <Plus />
                                            {translate('create_playlist')}
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                    {playlists && playlists.map(playlist => (
                                        <DropdownMenuItem key={playlist.id} onClick={() => addToPlaylist(playlist.id)} >
                                            <ListMusic />
                                            {playlist.title}
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>More...</DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            {/* create playlist dialog */}
            <CreateNewPlaylistDialog onOpenChange={setOpen} />
        </Dialog>
    )
}

export default SongOptionDropdown