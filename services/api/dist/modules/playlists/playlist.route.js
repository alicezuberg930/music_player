import express from "express";
import playlistController from "./playlist.controller";
import multer from "multer";
import { multerOptions } from "../../lib/helpers/multer.options";
import { validateDtoHanlder, JWTMiddleware, fileMimeAndSizeOptions, OptionalJWTMiddleware } from "../../middleware";
import { CreatePlaylistDto } from "./dto/create-playlist.dto";
import { UpdatePlaylistDto } from "./dto/update-playlist.dto";
import { PlaylistSongDto } from "./dto/playlist-songs.dto";
const playlistRouter = express.Router();
const uploadOptions = {
    allowedFields: ["thumbnail"],
    allowed: {
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"] }
    }
};
const upload = multer(multerOptions(uploadOptions));
const fileValidator = fileMimeAndSizeOptions(uploadOptions);
playlistRouter.get("/playlists", OptionalJWTMiddleware, (request, response) => playlistController.getPlaylists(request, response));
playlistRouter.post("/playlists", JWTMiddleware, upload.fields([{ name: "thumbnail", maxCount: 1 }]), fileValidator, validateDtoHanlder(CreatePlaylistDto), (request, response) => playlistController.createPlaylist(request, response));
playlistRouter.get("/playlists/:id", (request, response) => playlistController.findPlaylist(request, response));
playlistRouter.put("/playlists/:id", JWTMiddleware, upload.fields([{ name: "thumbnail", maxCount: 1 }]), fileValidator, validateDtoHanlder(UpdatePlaylistDto), (request, response) => playlistController.updatePlaylist(request, response));
playlistRouter.put("/playlists/add-songs/:id", JWTMiddleware, validateDtoHanlder(PlaylistSongDto), (request, response) => playlistController.addSongs(request, response));
playlistRouter.put("/playlists/remove-songs/:id", JWTMiddleware, validateDtoHanlder(PlaylistSongDto), (request, response) => playlistController.removeSongs(request, response));
playlistRouter.delete("/playlists/:id", JWTMiddleware, (request, response) => playlistController.deletePlaylist(request, response));
export { playlistRouter };
