import { Resend } from 'resend'
import * as Templates from './templates'
import { env } from '@yukikaze/lib/create-env'
import { BadRequestException } from '../exceptions'

const resend = new Resend(env.RESEND_API_KEY)

type SendEmailOptions<T extends keyof typeof Templates> = {
    to: string
    subject: string
    template: T
    data: React.ComponentProps<(typeof Templates)[T]>
}

const sendEmail = async <T extends keyof typeof Templates>(opts: SendEmailOptions<T>) => {
    const { data, error } = await resend.emails.send({
        from: 'Yukikaze <no-reply@tien-music-player.site>',
        to: opts.to,
        subject: opts.subject,
        react: Templates[opts.template](opts.data as never),
    })

    if (error) throw new BadRequestException(error.message)
    return data
}

export default sendEmail