import { PartialType } from "../../../lib/helpers/mapped-types";
import { CreatePlaylistDto } from "./create-playlist.dto";

export class UpdatePlaylistDto extends PartialType(CreatePlaylistDto) { }