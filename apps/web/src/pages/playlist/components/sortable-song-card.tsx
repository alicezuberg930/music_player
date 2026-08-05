import type { Song } from "@/@types"
import SongCard from "@/layout/song-card"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type SortableSongProps = {
    song: Song
    playlistTitle?: string
}

const SortableSongCard: React.FC<SortableSongProps> = ({ song, playlistTitle }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: String(song.id) })

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.9 : 1,
                zIndex: isDragging ? 1 : 0,
                willChange: "transform",
            }}
            className={isDragging ? "bg-[#f5f5f5]" : ""}
            {...attributes}
            {...listeners}
        >
            <SongCard
                song={song}
                playlistTitle={playlistTitle}
            />
        </div>
    )
}
export default SortableSongCard