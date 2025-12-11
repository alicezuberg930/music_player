import { IsNotEmpty, Length } from "class-validator"

export class CreateUserDto {
    @IsNotEmpty({ message: 'Full name cannot be empty' })
    fullname!: string

    @IsNotEmpty({ message: 'Email cannot be empty' })
    email!: string

    @IsNotEmpty({ message: 'Password cannot be empty' })
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
    password!: string
}