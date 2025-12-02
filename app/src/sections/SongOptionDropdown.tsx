import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArchiveIcon, CalendarPlusIcon, ClockIcon, ListFilterPlusIcon, MailCheckIcon, MoreHorizontalIcon, TagIcon, Trash2Icon } from "lucide-react"

type Props = {
    addToPlaylist: (e: React.MouseEvent) => void
}

const SongOptionDropdown: React.FC<Props> = ({ addToPlaylist }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <MoreHorizontalIcon className="text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <MailCheckIcon />
                        Mark as Read
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <ArchiveIcon />
                        Archive
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <ClockIcon />
                        Snooze
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CalendarPlusIcon />
                        Add to Calendar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={addToPlaylist}>
                        <ListFilterPlusIcon />
                        Thêm vào danh sách
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <TagIcon />
                            Label As...
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup
                                value={"label"}
                                onValueChange={() => { }}
                            >
                                <DropdownMenuRadioItem value="personal">
                                    Personal
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="work">
                                    Work
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="other">
                                    Other
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive">
                        <Trash2Icon />
                        Trash
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SongOptionDropdown