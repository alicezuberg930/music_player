import express from "express";
import artistController from "./artist.controller";
import multer from "multer";
import { multerOptions } from "../../lib/helpers/multer.options";
import { validateDtoHanlder, fileMimeAndSizeOptions } from "../../middleware";
import { CreateArtistDto } from "./dto/create-artist.dto";
import { UpdateArtistDto } from "./dto/update-artist.dto";
const artistRouter = express.Router();
const uploadOptions = {
    allowedFields: ["thumbnail"],
    allowed: {
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"] }
    }
};
const upload = multer(multerOptions(uploadOptions));
const fileValidator = fileMimeAndSizeOptions(uploadOptions);
artistRouter.get("/artists", (request, response) => artistController.getArtists(request, response));
artistRouter.post("/artists", upload.fields([{ name: "thumbnail", maxCount: 1 }]), fileValidator, validateDtoHanlder(CreateArtistDto), (request, response) => artistController.createArtist(request, response));
artistRouter.get("/artists/:id", (request, response) => artistController.findArtist(request, response));
artistRouter.put("/artists/:id", upload.fields([{ name: "thumbnail", maxCount: 1 }]), fileValidator, validateDtoHanlder(UpdateArtistDto), (request, response) => artistController.updateArtist(request, response));
export { artistRouter };
