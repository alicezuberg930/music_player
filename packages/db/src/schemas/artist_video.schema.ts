import { varchar, index, mysqlTable, int } from "drizzle-orm/mysql-core"
import { videos, artists } from "."
import { relations } from "drizzle-orm"

export const artistsVideos = mysqlTable("artists_videos", {
    id: int().primaryKey().notNull().autoincrement(),
    artistId: varchar({ length: 36 }).notNull().references(() => artists.id, { onDelete: "restrict" }),
    videoId: varchar({ length: 36 }).notNull().references(() => videos.id, { onDelete: "cascade" }),
}, (t) => [
    index('artist_id_idx').on(t.artistId),
    index('video_id_idx').on(t.videoId),
])

export const artistsVideosRelations = relations(artistsVideos, ({ one }) => ({
    video: one(videos, {
        fields: [artistsVideos.videoId],
        references: [videos.id],
    }),
    artist: one(artists, {
        fields: [artistsVideos.artistId],
        references: [artists.id],
    })
}))