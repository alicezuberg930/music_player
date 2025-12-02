export type Response<T = any> = {
    message: string
    data: T
    statusCode?: number
    path?: string
    method?: string
    timestamp?: string
}