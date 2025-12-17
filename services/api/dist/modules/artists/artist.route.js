"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistRouter = void 0;
const express_1 = __importDefault(require("express"));
const artist_controller_1 = __importDefault(require("./artist.controller"));
const multer_1 = __importDefault(require("multer"));
const middleware_1 = require("@yukikaze/middleware");
const create_artist_dto_1 = require("./dto/create-artist.dto");
const update_artist_dto_1 = require("./dto/update-artist.dto");
const artistRouter = express_1.default.Router();
exports.artistRouter = artistRouter;
const uploadOptions = {
    allowedFields: ["thumbnail"],
    allowed: {
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"] }
    }
};
const upload = (0, multer_1.default)((0, middleware_1.multerOptions)(uploadOptions));
const fileValidator = (0, middleware_1.fileMimeAndSizeOptions)(uploadOptions);
artistRouter.get("/artists", (request, response) => artist_controller_1.default.getArtists(request, response));
artistRouter.post("/artists", upload.fields([{ name: "thumbnail", maxCount: 1 }]), fileValidator, (0, middleware_1.validateDtoHanlder)(create_artist_dto_1.CreateArtistDto), (request, response) => artist_controller_1.default.createArtist(request, response));
artistRouter.get("/artists/:id", (request, response) => artist_controller_1.default.findArtist(request, response));
artistRouter.put("/artists/:id", upload.fields([{ name: "thumbnail", maxCount: 1 }]), fileValidator, (0, middleware_1.validateDtoHanlder)(update_artist_dto_1.UpdateArtistDto), (request, response) => artist_controller_1.default.updateArtist(request, response));
