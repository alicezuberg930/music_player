"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSongDto = void 0;
const create_song_dto_1 = require("./create-song.dto");
const mapped_types_1 = require("../../../lib/helpers/mapped.types");
class UpdateSongDto extends (0, mapped_types_1.PartialType)(create_song_dto_1.CreateSongDto) {
}
exports.UpdateSongDto = UpdateSongDto;
