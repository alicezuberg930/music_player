// lib
import { Request, Response } from 'express'
// database
import { db, eq, inArray, and } from '@yukikaze/db'
import { HomeData } from './home.model'
import { artistFollowers, userFavoriteSongs } from '@yukikaze/db/schemas'
// utils
import { HttpException, BadRequestException } from '@yukikaze/lib/exception'

export class HomeService {
    public async getHome(request: Request, response: Response) {
        try {
            const userId = request.userId // Get user ID from JWT middleware (undefined if not logged in)
            const banners = await db.query.banners.findMany({
                orderBy: (banners, { desc }) => [desc(banners.createdAt)],
                limit: 5
            })

            const newReleaseSongs = await db.query.songs.findMany({
                orderBy: (songs, { desc }) => [desc(songs.createdAt)],
                limit: 9
            })

            // If user is logged in, check which songs they've liked
            let likedSongIds: Set<string> = new Set()
            if (userId) {
                const songIds = newReleaseSongs.map(song => song.id)
                const likedSongs = await db.query.userFavoriteSongs.findMany({
                    where: and(
                        eq(userFavoriteSongs.userId, userId),
                        inArray(userFavoriteSongs.songId, songIds)
                    ),
                    columns: { songId: true }
                })
                likedSongIds = new Set(likedSongs.map(ls => ls.songId))
            }
            const songsWithLikedStatus = newReleaseSongs.map(song => ({
                ...song,
                liked: userId ? likedSongIds.has(song.id) : false
            }))

            const newPlaylists = await db.query.playlists.findMany({
                orderBy: (playlists, { desc }) => [desc(playlists.createdAt)],
                limit: 5
            })

            const weeklyTopArtists = await db.query.artists.findMany({
                orderBy: (artists, { desc }) => [desc(artists.totalFollow)],
                limit: 5
            })
            // If user is logged in, check which artists they've followed
            let followedArtistIds: Set<string> = new Set()
            if (userId) {
                const artistIds = weeklyTopArtists.map(artist => artist.id)
                const followedArtists = await db.query.artistFollowers.findMany({
                    where: and(
                        eq(artistFollowers.userId, userId),
                        inArray(artistFollowers.artistId, artistIds)
                    ),
                    columns: { artistId: true }
                })
                followedArtistIds = new Set(followedArtists.map(fa => fa.artistId))
            }
            const artistsWithFollowStatus = weeklyTopArtists.map(artist => ({
                ...artist,
                followed: userId ? followedArtistIds.has(artist.id) : false
            }))

            const data = {
                banners,
                newReleaseSongs: songsWithLikedStatus,
                weeklyTopArtists: artistsWithFollowStatus,
                newPlaylists
            } as HomeData

            return response.json({ message: 'Home data fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}