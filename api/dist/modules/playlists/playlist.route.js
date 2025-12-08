"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playlistRouter = void 0;
const express_1 = __importDefault(require("express"));
const playlist_controller_1 = __importDefault(require("./playlist.controller"));
const multer_1 = __importDefault(require("multer"));
const multer_options_1 = require("../../lib/helpers/multer.options");
const middleware_1 = require("../../middleware");
const create_playlist_dto_1 = require("./dto/create-playlist.dto");
const update_playlist_dto_1 = require("./dto/update-playlist.dto");
const playlist_songs_dto_1 = require("./dto/playlist-songs.dto");
const playlistRouter = express_1.default.Router();
exports.playlistRouter = playlistRouter;
const uploadOptions = {
    allowedFields: ["thumbnail"],
    allowed: {
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"] }
    }
};
const upload = (0, multer_1.default)((0, multer_options_1.multerOptions)(uploadOptions));
const fileValidator = (0, middleware_1.fileMimeAndSizeOptions)(uploadOptions);
playlistRouter.get("/playlists", middleware_1.OptionalJWTMiddleware, (request, response) => playlist_controller_1.default.getPlaylists(request, response));
playlistRouter.post("/playlists", middleware_1.JWTMiddleware, upload.fields([{ name: "thumbnail", maxCount: 1 }]), fileValidator, (0, middleware_1.validateDtoHanlder)(create_playlist_dto_1.CreatePlaylistDto), (request, response) => playlist_controller_1.default.createPlaylist(request, response));
playlistRouter.get("/playlists/:id", (request, response) => playlist_controller_1.default.findPlaylist(request, response));
playlistRouter.put("/playlists/:id", middleware_1.JWTMiddleware, upload.fields([{ name: "thumbnail", maxCount: 1 }]), fileValidator, (0, middleware_1.validateDtoHanlder)(update_playlist_dto_1.UpdatePlaylistDto), (request, response) => playlist_controller_1.default.updatePlaylist(request, response));
playlistRouter.put("/playlists/add-songs/:id", middleware_1.JWTMiddleware, (0, middleware_1.validateDtoHanlder)(playlist_songs_dto_1.PlaylistSongDto), (request, response) => playlist_controller_1.default.addSongs(request, response));
playlistRouter.put("/playlists/remove-songs/:id", middleware_1.JWTMiddleware, (0, middleware_1.validateDtoHanlder)(playlist_songs_dto_1.PlaylistSongDto), (request, response) => playlist_controller_1.default.removeSongs(request, response));
playlistRouter.delete("/playlists/:id", middleware_1.JWTMiddleware, (request, response) => playlist_controller_1.default.deletePlaylist(request, response));
