import { IsArray, ArrayNotEmpty, IsInt, IsNotEmpty, IsOptional, Length, IsString } from "class-validator"
import { Transform } from "class-transformer"

export class CreateSongDto {
    @IsNotEmpty({ message: 'Release date cannot be empty' })
    releaseDate!: string

    @IsNotEmpty({ message: 'Title cannot be empty' })
    @Length(3, 50, { message: 'Title must be between 3 and 50 characters' })
    title!: string

    @IsArray({ message: 'Artists must be an array' })
    @ArrayNotEmpty({ message: 'Artists cannot be empty' })
    @IsString({ each: true, message: 'Each artist id must be a string' })
    @Transform(({ value }) => {
        // Accept already-parsed arrays, JSON strings like "['a','b']", or comma-separated "a,b,c"
        if (Array.isArray(value)) return value.map((v) => String(v)).filter((n) => n.length > 0)
        if (typeof value === 'string') {
            const trimmed = value.trim()
            if (!trimmed) return []
            try {
                const parsed = JSON.parse(trimmed)
                if (Array.isArray(parsed)) return parsed.map((v) => String(v)).filter((n) => n.length > 0)
            } catch { }
            return trimmed.split(',').map((s) => String(s.trim())).filter((n) => n.length > 0)
        }
        return []
    })
    artistIds!: string[]
}