import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateBannerDto {
    // @IsString()
    @IsNotEmpty()
    // @IsOptional()
    name!: string
}
