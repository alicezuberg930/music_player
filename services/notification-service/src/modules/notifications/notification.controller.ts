import { Request, Response } from "express"
import { NotificationService } from "./notification.service"
import { CreateNotificationInput } from "./notification.model"
import { QueryNotificationParams, ReadNotificationParams } from "@yukikaze/validator"

class NotificationController {
    private readonly notificationService: NotificationService

    constructor() {
        this.notificationService = new NotificationService()
    }

    public async getNotifications(request: Request<{}, {}, {}, QueryNotificationParams>, response: Response) {
        return await this.notificationService.getNotifications(request, response)
    }

    public async sendNotification(request: Request<{}, {}, CreateNotificationInput>, response: Response) {
        return await this.notificationService.sendNotification(request, response)
    }

    public async subscribe(request: Request, response: Response) {
        return await this.notificationService.subscribe(request, response)
    }

    public async unsubscribe(request: Request<{ id: string }>, response: Response) {
        return await this.notificationService.unsubscribe(request, response)
    }

    public async countUnreadNotifications(request: Request, response: Response) {
        return await this.notificationService.countUnreadNotifications(request, response)
    }

    public async readNotifications(request: Request<{}, {}, ReadNotificationParams>, response: Response) {
        return await this.notificationService.readNotifications(request, response)
    }
}

export default new NotificationController()
