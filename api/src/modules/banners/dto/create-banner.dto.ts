import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateBannerDto {
    @IsString()
    @IsOptional()
    name?: string
}
