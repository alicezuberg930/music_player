import { ArrayNotEmpty, IsArray, IsEnum, IsInt, IsOptional } from "class-validator"
import { PartialType } from "../../../lib/helpers/mapped.types"
import { CreatePlaylistDto } from "./create-playlist.dto"
import { Transform } from "class-transformer"

export class UpdatePlaylistDto extends PartialType(CreatePlaylistDto) {
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
    songIds!: string[]
}