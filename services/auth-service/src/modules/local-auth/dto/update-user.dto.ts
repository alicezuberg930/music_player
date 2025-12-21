import { IsOptional } from "class-validator"
import { PartialType } from "../../../lib/helpers/mapped.types"
import { CreateUserDto } from "./create-user.dto"

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    birthday!: string
}