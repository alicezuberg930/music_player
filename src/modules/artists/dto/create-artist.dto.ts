import { IsNotEmpty } from "class-validator"

export class CreateArtistDto {
    @IsNotEmpty({ message: 'Name cannot be empty' })
    name!: string
}