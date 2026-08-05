const vapidKey = import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY
const pushNotificationKey = 'web-push-notification-key'

const notificationOptions = {
    url: "/notification-sw.js",
    options: { scope: "/", updateViaCache: "none" } as RegistrationOptions
}

const audioStreamUrl = (id: string) => `${import.meta.env.VITE_API_URL}/songs/stream/${id}`

const videoStreamUrl = (id: string) => `${import.meta.env.VITE_API_URL}/videos/stream/${id}`

export { vapidKey, pushNotificationKey, notificationOptions, audioStreamUrl, videoStreamUrl }