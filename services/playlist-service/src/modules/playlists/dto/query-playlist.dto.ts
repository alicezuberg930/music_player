import { IsArray, ArrayNotEmpty, IsInt, IsNotEmpty, IsOptional, Length } from "class-validator"
import { Transform } from "class-transformer"

export class QueryPlaylistDto {
    @IsOptional()
    releaseDate?: string

    @IsOptional()
    title?: string

    @IsOptional()
    artistName?: string

    @IsOptional()
    songTitle?: string
}