// lib
import { Request, Response } from 'express'
// database
import { db, eq, inArray, and, sql } from '@yukikaze/db'
import { HomeData, RankingRow, RankingSong } from './home.model'
import { artistFollowers, userFavoriteSongs, userFavoritePlaylists } from '@yukikaze/db/schemas'
// utils
import { HttpException, BadRequestException } from '@yukikaze/lib/exception'

export class HomeService {
    public async getHome(request: Request, response: Response) {
        try {
            const [banners, newReleaseSongs, newPlaylists, weeklyTopArtists] = await Promise.all([
                db.query.banners.findMany({
                    orderBy: (banners, { desc }) => [desc(banners.createdAt)],
                    limit: 5
                }),
                db.query.songs.findMany({
                    orderBy: (songs, { desc }) => [desc(songs.createdAt)],
                    limit: 9
                }),
                db.query.playlists.findMany({
                    orderBy: (playlists, { desc }) => [desc(playlists.createdAt)],
                    limit: 5
                }),
                db.query.artists.findMany({
                    orderBy: (artists, { desc }) => [desc(artists.totalFollow)],
                    limit: 5
                })
            ])

            // If user is logged in, check which songs they've liked
            let likedSongIds: Set<string> = new Set()
            if (request.userId) {
                const songIds = newReleaseSongs.map(song => song.id)
                const likedSongs = await db.query.userFavoriteSongs.findMany({
                    where: and(
                        eq(userFavoriteSongs.userId, request.userId),
                        inArray(userFavoriteSongs.songId, songIds)
                    ),
                    columns: { songId: true }
                })
                likedSongIds = new Set(likedSongs.map(ls => ls.songId))
            }
            const songsWithLikedStatus = newReleaseSongs.map(song => ({
                ...song,
                liked: request.userId ? likedSongIds.has(song.id) : false
            }))

            // If user is logged in, check which playlists they've liked
            let likedPlaylistIds: Set<string> = new Set()
            if (request.userId) {
                const playlistIds = newPlaylists.map(playlist => playlist.id)
                const likedPlaylists = await db.query.userFavoritePlaylists.findMany({
                    where: and(
                        eq(userFavoritePlaylists.userId, request.userId),
                        inArray(userFavoritePlaylists.playlistId, playlistIds)
                    ),
                    columns: { playlistId: true }
                })
                likedPlaylistIds = new Set(likedPlaylists.map(lp => lp.playlistId))
            }
            const playlistsWithLikedStatus = newPlaylists.map(playlist => ({
                ...playlist,
                liked: request.userId ? likedPlaylistIds.has(playlist.id) : false
            }))

            // If user is logged in, check which artists they've followed
            let followedArtistIds: Set<string> = new Set()
            if (request.userId) {
                const artistIds = weeklyTopArtists.map(artist => artist.id)
                const followedArtists = await db.query.artistFollowers.findMany({
                    where: and(
                        eq(artistFollowers.userId, request.userId),
                        inArray(artistFollowers.artistId, artistIds)
                    ),
                    columns: { artistId: true }
                })
                followedArtistIds = new Set(followedArtists.map(fa => fa.artistId))
            }
            const artistsWithFollowStatus = weeklyTopArtists.map(artist => ({
                ...artist,
                followed: request.userId ? followedArtistIds.has(artist.id) : false
            }))

            const data = {
                banners,
                newReleaseSongs: songsWithLikedStatus,
                weeklyTopArtists: artistsWithFollowStatus,
                newPlaylists: playlistsWithLikedStatus
            } as HomeData

            return response.json({ message: 'Home data fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async rankings(_: Request, response: Response) {
        try {
            const result = (await db.execute(sql`
                WITH ranked AS (
                    SELECT
                        sl.song_id,
                        SUM(sl.listens) AS week_listens
                    FROM song_listens sl
                    WHERE sl.played_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                    GROUP BY sl.song_id
                    ORDER BY week_listens DESC
                    LIMIT 3
                ),
                days AS (
                    SELECT DATE_SUB(CURDATE(), INTERVAL 6 DAY) AS day
                    UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 5 DAY)
                    UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 4 DAY)
                    UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 3 DAY)
                    UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 2 DAY)
                    UNION ALL SELECT DATE_SUB(CURDATE(), INTERVAL 1 DAY)
                    UNION ALL SELECT CURDATE()
                )
                SELECT
                    s.id AS song_id,
                    s.title,
                    s.artist_names,
                    s.thumbnail,
                    d.day,
                    COALESCE(sl.listens, 0) AS listens
                FROM ranked r
                JOIN songs s ON s.id = r.song_id
                CROSS JOIN days d
                LEFT JOIN song_listens sl
                    ON sl.song_id = r.song_id
                    AND sl.played_at = d.day
                ORDER BY r.week_listens DESC, r.song_id, d.day;
            `)) as unknown

            const rows = (Array.isArray(result) ? (result as RankingRow[]) : (result as { 0?: RankingRow[] })[0] ?? [])

            const groupedRows = new Map<string, RankingSong>()

            for (const row of rows) {
                const existing = groupedRows.get(row.song_id)
                if (existing) {
                    existing.views.push({
                        date: String(row.day),
                        listens: Number(row.listens),
                    })
                } else {
                    groupedRows.set(row.song_id, {
                        song: {
                            id: row.song_id,
                            title: row.title,
                            artistNames: row.artist_names,
                            cover: row.thumbnail,
                        },
                        views: [
                            {
                                date: String(row.day),
                                listens: Number(row.listens),
                            },
                        ],
                    })
                }
            }

            const rankings: RankingSong[] = [...groupedRows.values()]

            return response.json({
                message: 'Top ranks fetched successfully',
                data: rankings
            })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}