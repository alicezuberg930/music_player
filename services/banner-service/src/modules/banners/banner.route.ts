import express, { Request, Response } from "express"
import bannerController from "./banner.controller"
import multer from "multer"
import { JWTMiddleware, fileMimeAndSizeOptions, multerOptions, Options, validateRequest } from "@yukikaze/middleware"
import { BannerValidators } from "@yukikaze/validator"

const bannerRouter = express.Router()

const uploadOptions: Options = {
    allowedFields: ["thumbnail"],
    allowed: {
        thumbnail: { mimes: ["image/jpeg", "image/png", "image/webp"], exts: ["jpg", "jpeg", "png", "webp"], maxSize: 2 * 1024 * 1024 }
    }
}
const upload = multer(multerOptions(uploadOptions))
const fileValidator = fileMimeAndSizeOptions(uploadOptions)

bannerRouter.get("/",
    (request: Request, response: Response) => bannerController.getBanners(request, response)
)

bannerRouter.post("/",
    JWTMiddleware,
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    fileValidator,
    validateRequest(BannerValidators.createBannerInput),
    (request: Request<{}, {}, BannerValidators.CreateBannerInput>, response: Response) => bannerController.createBanner(request, response)
)

bannerRouter.get("/:id",
    (request: Request<{ id: string }>, response: Response) => bannerController.findBanner(request, response)
)

bannerRouter.put("/:id",
    JWTMiddleware,
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    fileValidator,
    validateRequest(BannerValidators.updateBannerInput),
    (request: Request<{ id: string }, {}, BannerValidators.UpdateBannerInput>, response: Response) => bannerController.updateBanner(request, response)
)

bannerRouter.delete("/:id",
    JWTMiddleware,
    (request: Request<{ id: string }>, response: Response) => bannerController.deleteBanner(request, response)
)

export { bannerRouter }