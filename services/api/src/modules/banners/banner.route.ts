import express, { Request, Response } from "express"
import bannerController from "./banner.controller"
import multer from "multer"
import { validateDtoHanlder, JWTMiddleware, fileMimeAndSizeOptions, multerOptions, Options } from "@yukikaze/middleware"
import { CreateBannerDto } from "./dto/create-banner.dto"
import { UpdateBannerDto } from "./dto/update-banner.dto"

const bannerRouter = express.Router()

const uploadOptions: Options = {
    allowedFields: ["thumbnail"],
    allowed: {
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"], maxSize: 2 * 1024 * 1024 }
    }
}
const upload = multer(multerOptions(uploadOptions))
const fileValidator = fileMimeAndSizeOptions(uploadOptions)

bannerRouter.get("/banners",
    (request: Request, response: Response) => bannerController.getBanners(request, response)
)

bannerRouter.post("/banners",
    // JWTMiddleware,
    // upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    // fileValidator,
    validateDtoHanlder(CreateBannerDto),
    (request: Request<{}, {}, CreateBannerDto>, response: Response) => bannerController.createBanner(request, response)
)

bannerRouter.get("/banners/:id",
    (request: Request<{ id: string }>, response: Response) => bannerController.findBanner(request, response)
)

bannerRouter.put("/banners/:id",
    JWTMiddleware,
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    fileValidator,
    validateDtoHanlder(UpdateBannerDto),
    (request: Request<{ id: string }, {}, UpdateBannerDto>, response: Response) => bannerController.updateBanner(request, response)
)

bannerRouter.delete("/banners/:id",
    JWTMiddleware,
    (request: Request<{ id: string }>, response: Response) => bannerController.deleteBanner(request, response)
)

export { bannerRouter }
