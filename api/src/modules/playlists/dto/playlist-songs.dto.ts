import { Transform } from "class-transformer"
import { ArrayNotEmpty, IsArray, IsString } from "class-validator"

export class PlaylistSongDto {
    @IsArray({ message: 'Songs must be an array' })
    @ArrayNotEmpty({ message: 'Songs cannot be empty' })
    @IsString({ each: true, message: 'Each song id must be a string' })
    @Transform(({ value }) => {
        // Accept already-parsed arrays, JSON strings like "['a','b']", or comma-separated "a,b,b"
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
    songIds!: string[]
}