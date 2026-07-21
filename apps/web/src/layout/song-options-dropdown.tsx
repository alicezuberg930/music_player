import type { Playlist, Song } from "@/@types"
import { playlistQueries } from "@/lib/queries/playlist"
import { useLocales } from "@/lib/locales"
import { useMutation } from "@tanstack/react-query"
import { Heart, ListFilterPlusIcon, ListMusic, Plus, toast, } from "@yukikaze/ui"
import { Dialog } from "@yukikaze/ui/dialog"
import {
    createDropdownMenuHandle,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@yukikaze/ui/dropdown-menu"
import { memo, useState } from "react"
import CreateNewPlaylistDialog from "../pages/me/music/components/create-playlist-dialog"

export type SongOptionMenuPayload = {
    song: Song
    playlists?: Playlist[]
}

export const songOptionMenuHandle = createDropdownMenuHandle<SongOptionMenuPayload>()

const SongOptionsDropdown = () => {
    const { translate } = useLocales()
    const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false)
    const { mutate: addToPlaylist } = useMutation(playlistQueries().addToPlaylist.mutationOptions())

    const handleAddToPlaylist = (songId: string, playlistId: string) => {
        addToPlaylist(
            { id: playlistId, songIds: [songId] },
            { onSuccess: (response) => toast.success(response.message) }
        )
    }

    return (
        <Dialog open={createPlaylistOpen} onOpenChange={setCreatePlaylistOpen}>
            <DropdownMenu handle={songOptionMenuHandle}>
                {({ payload }) => payload ? (
                    <DropdownMenuContent align="start" className="w-52">
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Heart />
                                Yêu Thích
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <ListFilterPlusIcon />
                                    {translate("add_to_playlist")}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem onClick={() => setCreatePlaylistOpen(true)}>
                                            <Plus />
                                            {translate("create_playlist")}
                                        </DropdownMenuItem>
                                        {payload.playlists?.map((playlist) => (
                                            <DropdownMenuItem
                                                key={playlist.id}
                                                onClick={() => handleAddToPlaylist(payload.song.id, playlist.id)}
                                            >
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
                ) : null}
            </DropdownMenu>
            <CreateNewPlaylistDialog onOpenChange={setCreatePlaylistOpen} />
        </Dialog>
    )
}

export default memo(SongOptionsDropdown)