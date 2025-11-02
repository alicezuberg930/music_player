import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateSongDto {
    @IsNotEmpty({ message: 'Title cannot be empty' })
    @Length(3, 50)
    title!: string;

    @IsNotEmpty({ message: 'Description cannot be empty' })
    description!: string;
}
