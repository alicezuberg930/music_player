export class HttpException extends Error {
    public status: number
    public message: string

    constructor(message: string, status: number) {
        super(message)
        this.status = status
        this.message = message
        Object.setPrototypeOf(this, new.target.prototype)
        Error.captureStackTrace(this)
    }
}
