import { Request, Response } from "express"
import { db, eq, like } from "@yukikaze/db"
import { genres } from "@yukikaze/db/schemas"
import { BadRequestException, HttpException, NotFoundException } from "@yukikaze/lib/exception"
import { GenreValidators } from "@yukikaze/validator"
import { Genre } from "./genre.model"

export class GenreService {
    public async getGenres(request: Request<{}, {}, {}, { search: string, type: 'tree' | 'list' }>, response: Response) {
        try {
            let { search, type } = request.query
            if (!type) type = 'list'

            if (type === 'tree') {
                const allGenres = await db.query.genres.findMany({
                    orderBy: (genres, { desc }) => [desc(genres.createdAt)],
                    where: search ? like(genres.name, `%${search}%`) : undefined,
                })
                // Build tree structure
                const genreMap = new Map<String, Genre & { subGenres: Genre[] }>()
                const rootGenres: Genre[] = []
                // create map of all genres
                allGenres.forEach(genre => {
                    genreMap.set(genre.id, { ...genre, subGenres: [] })
                })
                // build tree
                allGenres.forEach(genre => {
                    const genreWithChildren = genreMap.get(genre.id)
                    if (genre.subGenreId) {
                        const parent = genreMap.get(genre.subGenreId)
                        if (parent && genreWithChildren) {
                            parent.subGenres.push(genreWithChildren)
                        }
                    } else {
                        if (genreWithChildren) rootGenres.push(genreWithChildren)
                    }
                })
                return response.json({ message: 'Genre tree fetched successfully', data: rootGenres })
            } else {
                const data = await db.query.genres.findMany({
                    orderBy: (genres, { desc }) => [desc(genres.createdAt)],
                    where: search ? like(genres.name, `%${search}%`) : undefined,
                })
                return response.json({ message: 'Genre list fetched successfully', data })
            }
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async updateGenres(request: Request<{ id: string }, {}, GenreValidators.UpdateGenreInput>, response: Response) {
        try {
            const { id } = request.params
            const genre = await db.query.genres.findFirst({ where: eq(genres.id, id) })
            if (!genre) throw new NotFoundException('Genre not found')
            await db.update(genres).set({ ...request.body }).where(eq(genres.id, id))
            return response.json({ message: 'Genre updated successfully' })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }

    public async createGenres(request: Request<{}, {}, GenreValidators.CreateGenreInput>, response: Response) {
        try {
            const newGenre = await db.insert(genres).values({ ...request.body })
            return response.json({ message: 'Genre created successfully', data: newGenre })
        } catch (error) {
            if (error instanceof HttpException) throw error
            throw new BadRequestException(error instanceof Error ? error.message : undefined)
        }
    }
}