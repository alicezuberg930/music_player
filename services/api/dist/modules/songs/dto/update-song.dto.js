import { CreateSongDto } from "./create-song.dto";
import { PartialType } from "../../../lib/helpers/mapped.types";
export class UpdateSongDto extends PartialType(CreateSongDto) {
}
