import { Request, Response } from "express"
import { and, db, eq, inArray } from "@yukikaze/db"
import { artistFollowers, artists, playlists, songs, userFavoritePlaylists, userFavoriteSongs, users } from "@yukikaze/db/schemas"
import { Playlist, Song, User } from "./user.model"
import { BadRequestException, HttpException, NotFoundException } from "@yukikaze/lib/exception"
import { AuthValidators } from "@yukikaze/validator"

export class UserService {
    public async getUsers(request: Request, response: Response) {
        try {
            // const { } = request.query
            const data = await db.query.users.findMany({

            })
            return response.json({ message: 'User details fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async findUser(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const data: Omit<User, "password"> | undefined = await db.query.users.findFirst({
                columns: { password: false },
                where: eq(users.id, id),
                with: { songs: true, playlists: true }
            })
            if (!data) throw new NotFoundException('User not found')
            return response.json({ message: 'User details fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async myProfile(request: Request, response: Response) {
        try {
            if (!request.userId) throw new BadRequestException('User ID is missing in request')
            const data: Omit<User, "password"> | undefined = await db.query.users.findFirst({
                where: eq(users.id, request.userId),
                columns: { password: false }
            })
            if (!data) throw new NotFoundException('User not found')
            // Cache privately (per-user), must revalidate on each request
            response.set('Cache-Control', 'private, must-revalidate, max-age=3600')
            return response.json({ message: 'User details fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async updateUser(request: Request<{ id: string }, {}, AuthValidators.UpdateUserInput>, response: Response) {
        try {
            const { id } = request.params
            const { fullname, password } = request.body
            return response.json({ message: 'User updated successfully', data: { id, fullname, password } })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async verifyEmail(request: Request<{ id: string }, {}, {}, { token: string }>, response: Response) {
        try {
            const { id } = request.params
            const { token } = request.query
            const user: User | undefined = await db.query.users.findFirst({ where: and(eq(users.id, id)) })
            if (!user) throw new NotFoundException('User not found')
            if (user.isVerified) return response.json({ message: 'Email is already verified' })
            if (user.verifyToken && user.verifyToken !== token) throw new BadRequestException('Invalid verification token')
            if (user.verifyTokenExpires && user.verifyTokenExpires < new Date()) throw new BadRequestException('Verification token has expired')
            await db.update(users).set({ isVerified: true, verifyToken: null, verifyTokenExpires: null }).where(eq(users.id, user.id))
            return response.json({ message: 'Email verified successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async userSongs(request: Request<{}, {}, {}, { type: 'uploaded' | 'favorite' }>, response: Response) {
        try {
            let { type } = request.query
            if (!type) type = 'uploaded'
            let data: Song[] = []
            if (type === 'uploaded') {
                data = await db.query.songs.findMany({
                    where: eq(songs.userId, request.userId!),
                    orderBy: (songs, { desc }) => [desc(songs.createdAt)],
                })
            }
            if (type === 'favorite') {
                data = await db.query.userFavoriteSongs.findMany({
                    where: eq(userFavoriteSongs.userId, request.userId!),
                    with: { song: true }
                }).then(favorites => favorites.map(f => f.song))
            }
            // If user is logged in, check which songs they've liked
            let likedSongIds: Set<string> = new Set()
            if (request.userId) {
                const songIds = data.map(song => song.id)
                const likedSongs = await db.query.userFavoriteSongs.findMany({
                    where: and(
                        eq(userFavoriteSongs.userId, request.userId),
                        inArray(userFavoriteSongs.songId, songIds)
                    ),
                    columns: { songId: true }
                })
                likedSongIds = new Set(likedSongs.map(ls => ls.songId))
            }
            const songsWithLikedStatus = data.map(song => ({
                ...song,
                liked: request.userId ? likedSongIds.has(song.id) : false
            }))
            return response.json({ message: 'User songs fetched successfully', data: songsWithLikedStatus })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async userPlaylists(request: Request<{}, {}, {}, { type: 'created' | 'favorite' }>, response: Response) {
        try {
            let { type } = request.query
            if (!type) type = 'created'
            let data: Playlist[] = []
            if (type === 'created') {
                data = await db.query.playlists.findMany({
                    where: eq(playlists.userId, request.userId!),
                    orderBy: (playlists, { desc }) => [desc(playlists.createdAt)],
                })
            }
            if (type === 'favorite') {
                data = await db.query.userFavoritePlaylists.findMany({
                    where: eq(userFavoritePlaylists.userId, request.userId!),
                    with: { playlist: true }
                }).then(favorites => favorites.map(f => f.playlist))
            }
            // If user is logged in, check which playlists they've liked
            let likedPlaylistIds: Set<string> = new Set()
            if (request.userId) {
                const playlistIds = data.map(playlist => playlist.id)
                const likedPlaylists = await db.query.userFavoritePlaylists.findMany({
                    where: and(
                        eq(userFavoritePlaylists.userId, request.userId),
                        inArray(userFavoritePlaylists.playlistId, playlistIds)
                    ),
                    columns: { playlistId: true }
                })
                likedPlaylistIds = new Set(likedPlaylists.map(lp => lp.playlistId))
            }
            const playlistsWithLikedStatus = data.map(playlist => ({
                ...playlist,
                liked: request.userId ? likedPlaylistIds.has(playlist.id) : false
            }))
            return response.json({ message: 'User playlists fetched successfully', data: playlistsWithLikedStatus })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async userArtists(request: Request, response: Response) {
        try {
            const data = await db.query.artistFollowers.findMany({
                where: eq(artistFollowers.userId, request.userId!),
                with: { artist: true }
            }).then(followers => followers.map(f => f.artist))
            return response.json({ message: 'User followed artists fetched successfully', data })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async toggleFollowArtist(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const userId = request.userId
            const findArtist = await db.query.artists.findFirst({ where: eq(artists.id, id), columns: { id: true, totalFollow: true } })
            if (!findArtist) throw new NotFoundException('Artist not found')
            // Toggle follow/unfollow
            const isFollowing = await db.query.artistFollowers.findFirst({
                where: (eb) => and(
                    eq(eb.artistId, id),
                    eq(eb.userId, userId!)
                )
            })
            if (isFollowing) {
                await db.update(artists).set({ totalFollow: findArtist.totalFollow! - 1 }).where(eq(artists.id, id))
                await db.delete(artistFollowers).where(and(
                    eq(artistFollowers.artistId, id),
                    eq(artistFollowers.userId, userId!)
                ))
                return response.json({ message: 'Artist unfollowed successfully' })
            } else {
                await db.update(artists).set({ totalFollow: findArtist.totalFollow! + 1 }).where(eq(artists.id, id))
                await db.insert(artistFollowers).values({
                    artistId: id,
                    userId: userId!
                })
                return response.json({ message: 'Artist followed successfully' })
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async toggleFavoriteSong(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const song = await db.query.songs.findFirst({ where: eq(songs.id, id) })
            if (!song) throw new NotFoundException('Song not found')
            const isFavorite = await db.query.userFavoriteSongs.findFirst({
                where: and(
                    eq(userFavoriteSongs.userId, request.userId!),
                    eq(userFavoriteSongs.songId, id)
                )
            })
            if (isFavorite) {
                await db.delete(userFavoriteSongs).where(
                    and(
                        eq(userFavoriteSongs.userId, request.userId!),
                        eq(userFavoriteSongs.songId, id)
                    )
                )
                await db.update(songs).set({ likes: song.likes! - 1 }).where(eq(songs.id, id))
                return response.json({ message: 'Song removed from favorites successfully' })
            } else {
                await db.insert(userFavoriteSongs).values({ userId: request.userId!, songId: id })
                await db.update(songs).set({ likes: song.likes! + 1 }).where(eq(songs.id, id))
                return response.json({ message: 'Song added to favorites successfully' })
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async toggleFavoritePlaylist(request: Request<{ id: string }>, response: Response) {
        try {
            const { id } = request.params
            const playlist = await db.query.playlists.findFirst({ where: eq(playlists.id, id) })
            if (!playlist) throw new NotFoundException('Playlist not found')
            const isFavorite = await db.query.userFavoritePlaylists.findFirst({
                where: and(
                    eq(userFavoritePlaylists.userId, request.userId!),
                    eq(userFavoritePlaylists.playlistId, id)
                )
            })
            // toggle favorite
            if (isFavorite) {
                await db.delete(userFavoritePlaylists).where(
                    and(
                        eq(userFavoritePlaylists.userId, request.userId!),
                        eq(userFavoritePlaylists.playlistId, id)
                    )
                )
                await db.update(playlists).set({ likes: playlist.likes! - 1 }).where(eq(playlists.id, id))
                return response.json({ message: 'Playlist removed from favorites successfully' })
            } else {
                await db.insert(userFavoritePlaylists).values({ userId: request.userId!, playlistId: id })
                await db.update(playlists).set({ likes: playlist.likes! + 1 }).where(eq(playlists.id, id))
                return response.json({ message: 'Playlist added to favorites successfully' })
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}