import express, { Request, Response } from "express"
import { JWTMiddleware } from "@yukikaze/middleware"
import notificationController from "./notification.controller"
import { CreateNotificationInput } from "./notification.model"
import { QueryNotificationParams, ReadNotificationParams } from "@yukikaze/validator"

const notificationRouter = express.Router()

notificationRouter.get(
    "/unread",
    JWTMiddleware,
    (request: Request, response: Response) => notificationController.countUnreadNotifications(request, response),
)

notificationRouter.put(
    "/read",
    JWTMiddleware,
    (request: Request<{}, {}, ReadNotificationParams>, response: Response) => notificationController.readNotifications(request, response),
)

notificationRouter.get(
    "/",
    JWTMiddleware,
    (request: Request<{}, {}, {}, QueryNotificationParams>, response: Response) => notificationController.getNotifications(request, response),
)

notificationRouter.post(
    "/send",
    JWTMiddleware,
    (request: Request<{}, {}, CreateNotificationInput>, response: Response) => notificationController.sendNotification(request, response),
)

notificationRouter.post(
    "/push-notification/subscribe",
    JWTMiddleware,
    (request: Request, response: Response) => notificationController.subscribe(request, response),
)

notificationRouter.delete(
    "/push-notification/unsubscribe/:id",
    JWTMiddleware,
    (request: Request<{ id: string }>, response: Response) => notificationController.unsubscribe(request, response),
)

// notificationRouter.post(
//     "/api/push-notification/subscribe",
//     JWTMiddleware,
//     (request: Request, response: Response) => notificationController.subscribe(request, response),
// )

// notificationRouter.delete(
//     "/api/push-notification/unsubscribe/:id",
//     JWTMiddleware,
//     (request: Request<{ id: string }>, response: Response) => notificationController.unsubscribe(request, response),
// )

export { notificationRouter }
