import { CreateArtistDto } from "./create-artist.dto"
import { PartialType } from "../../../lib/helpers/mapped-types"

export class UpdateArtistDto extends PartialType(CreateArtistDto) { }