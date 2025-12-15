"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannerRouter = void 0;
const express_1 = __importDefault(require("express"));
const banner_controller_1 = __importDefault(require("./banner.controller"));
const multer_1 = __importDefault(require("multer"));
const multer_options_1 = require("../../lib/helpers/multer.options");
const middleware_1 = require("../../middleware");
const create_banner_dto_1 = require("./dto/create-banner.dto");
const update_banner_dto_1 = require("./dto/update-banner.dto");
const bannerRouter = express_1.default.Router();
exports.bannerRouter = bannerRouter;
const uploadOptions = {
    allowedFields: ["thumbnail"],
    allowed: {
        thumbnail: { mimes: ["image/jpeg", "image/png"], exts: ["jpg", "jpeg", "png"], maxSize: 2 * 1024 * 1024 }
    }
};
const upload = (0, multer_1.default)((0, multer_options_1.multerOptions)(uploadOptions));
const fileValidator = (0, middleware_1.fileMimeAndSizeOptions)(uploadOptions);
bannerRouter.get("/banners", (request, response) => banner_controller_1.default.getBanners(request, response));
bannerRouter.post("/banners", 
// JWTMiddleware,
// upload.fields([{ name: "thumbnail", maxCount: 1 }]),
// fileValidator,
(0, middleware_1.validateDtoHanlder)(create_banner_dto_1.CreateBannerDto), (request, response) => banner_controller_1.default.createBanner(request, response));
bannerRouter.get("/banners/:id", (request, response) => banner_controller_1.default.findBanner(request, response));
bannerRouter.put("/banners/:id", middleware_1.JWTMiddleware, upload.fields([{ name: "thumbnail", maxCount: 1 }]), fileValidator, (0, middleware_1.validateDtoHanlder)(update_banner_dto_1.UpdateBannerDto), (request, response) => banner_controller_1.default.updateBanner(request, response));
bannerRouter.delete("/banners/:id", middleware_1.JWTMiddleware, (request, response) => banner_controller_1.default.deleteBanner(request, response));
