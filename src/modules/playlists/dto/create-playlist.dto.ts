import { IsArray, ArrayNotEmpty, IsInt, IsNotEmpty, IsOptional, Length } from "class-validator"
import { Transform } from "class-transformer"

export class CreatePlaylistDto {
    @IsNotEmpty({ message: 'Release date cannot be empty' })
    releaseDate!: string

    @IsOptional()
    description?: string

    @IsNotEmpty({ message: 'Title cannot be empty' })
    @Length(3, 50, { message: 'Title must be between 3 and 50 characters' })
    title!: string

    @IsArray({ message: 'Songs must be an array' })
    @ArrayNotEmpty({ message: 'Songs cannot be empty' })
    @IsInt({ each: true, message: 'Each song id must be an integer' })
    @Transform(({ value }) => {
        // Accept already-parsed arrays, JSON strings like "[1,2]", or comma-separated "1,2,3"
        if (Array.isArray(value)) return value.map((v) => Number(v)).filter((n) => !Number.isNaN(n))
        if (typeof value === 'string') {
            const trimmed = value.trim()
            if (!trimmed) return []
            try {
                const parsed = JSON.parse(trimmed)
                if (Array.isArray(parsed)) return parsed.map((v) => Number(v)).filter((n) => !Number.isNaN(n))
            } catch { }
            return trimmed.split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n))
        }
        return []
    })
    songIds!: number[]
}