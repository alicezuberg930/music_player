const vapidKey = import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY
// BPIOcoYd-_gZkDmTDHyJ9XHPCR0UtGxC9136JSHr5A7HyRkvRXQBGJCbQjCMd0argkzolL_cZJ_bl_uTxoNVGgw
const pushNotificationKey = 'web_push_notification_key'

const notificationOptions = {
    url: "/notification-sw.js",
    options: { scope: "/", updateViaCache: "none" } as RegistrationOptions
}

export { vapidKey, pushNotificationKey, notificationOptions }