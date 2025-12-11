import { IsArray, ArrayNotEmpty, IsNotEmpty, IsOptional, Length, IsString } from "class-validator"
import { Transform } from "class-transformer"

export class CreatePlaylistDto {
    @IsOptional()
    releaseDate?: string

    @IsOptional()
    description?: string

    @IsNotEmpty({ message: 'Title cannot be empty' })
    @Length(3, 50, { message: 'Title must be between 3 and 50 characters' })
    title!: string
}