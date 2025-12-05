import { Text } from '@react-email/components'

import { EmailLayout } from './_layout'

interface ChangePasswordProps {
    username: string
}

export default function ChangePassword({ username }: Readonly<ChangePasswordProps>) {
    const formattedDate = new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'medium',
    }).format(new Date())

    return (
        <EmailLayout>
            <Text>Hi <strong>{username}</strong>,</Text>
            <Text>
                You updated the password for your account on {formattedDate}. If
                this was you, then no further action is required.
            </Text>
            <Text>
                However, if you did NOT perform this password change, we recommend that
                you reset your password immediately and review your account security
                settings.
            </Text>
        </EmailLayout>
    )
}