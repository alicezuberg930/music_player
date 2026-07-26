import { PushNotification, WebPushSubscription } from "@/modules/notifications/notification.model"
import { BadRequestException } from "@yukikaze/lib/exception"
import webpush from "web-push"

const vapidSubject = process.env.WEB_PUSH_SUBJECT!
const vapidPublicKey = process.env.WEB_PUSH_PUBLIC_KEY
const vapidPrivateKey = process.env.WEB_PUSH_PRIVATE_KEY

let isWebPushConfigured = false

const configureWebPush = () => {
    if (isWebPushConfigured) return
    if (!vapidPublicKey || !vapidPrivateKey) {
        throw new BadRequestException("Web push VAPID keys are not configured")
    }
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)
    isWebPushConfigured = true
}

const normalizeSubscription = (input: unknown): WebPushSubscription => {
    const subscription = typeof input === "string" ? JSON.parse(input) : input
    if (!subscription || typeof subscription !== "object") {
        throw new BadRequestException("Invalid push subscription")
    }
    const { endpoint, keys } = subscription as WebPushSubscription
    if (!endpoint || !keys?.p256dh || !keys.auth) {
        throw new BadRequestException("Invalid push subscription keys")
    }
    return { endpoint, keys }
}

const toWebPushSubscription = (subscription: PushNotification) => ({
    endpoint: subscription.endPoint,
    keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth,
    },
})

export { configureWebPush, normalizeSubscription, toWebPushSubscription }