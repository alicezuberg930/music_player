"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateArtistDto = void 0;
const create_artist_dto_1 = require("./create-artist.dto");
const mapped_types_1 = require("../../../lib/helpers/mapped.types");
class UpdateArtistDto extends (0, mapped_types_1.PartialType)(create_artist_dto_1.CreateArtistDto) {
}
exports.UpdateArtistDto = UpdateArtistDto;
