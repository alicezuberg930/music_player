import { IsOptional, IsString } from "class-validator"

export class UpdateBannerDto {
    @IsString()
    @IsOptional()
    name?: string
}
