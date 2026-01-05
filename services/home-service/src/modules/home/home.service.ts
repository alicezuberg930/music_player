// lib
import { Request, Response } from 'express'
// database
import { db, eq, inArray, and } from '@yukikaze/db'
import { HomeData } from './home.model'
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
}