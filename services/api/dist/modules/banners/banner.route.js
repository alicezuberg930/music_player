import express from "express";
import bannerController from "./banner.controller";
import multer from "multer";
import { multerOptions } from "../../lib/helpers/multer.options";
import { validateDtoHanlder, JWTMiddleware, fileMimeAndSizeOptions } from "../../middleware";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";
const bannerRouter = express.Router();
const uploadOptions = {
    allowedFields: ["thumbnail"],
    allowed: {
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"], maxSize: 2 * 1024 * 1024 }
    }
};
const upload = multer(multerOptions(uploadOptions));
const fileValidator = fileMimeAndSizeOptions(uploadOptions);
bannerRouter.get("/banners", (request, response) => bannerController.getBanners(request, response));
bannerRouter.post("/banners", JWTMiddleware, upload.fields([{ name: "thumbnail", maxCount: 1 }]), fileValidator, validateDtoHanlder(CreateBannerDto), (request, response) => bannerController.createBanner(request, response));
bannerRouter.get("/banners/:id", (request, response) => bannerController.findBanner(request, response));
bannerRouter.put("/banners/:id", JWTMiddleware, upload.fields([{ name: "thumbnail", maxCount: 1 }]), fileValidator, validateDtoHanlder(UpdateBannerDto), (request, response) => bannerController.updateBanner(request, response));
bannerRouter.delete("/banners/:id", JWTMiddleware, (request, response) => bannerController.deleteBanner(request, response));
export { bannerRouter };
