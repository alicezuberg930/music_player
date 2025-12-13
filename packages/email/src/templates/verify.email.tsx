import { Button, Link, Section, Text } from '@react-email/components'
import { EmailLayout } from './_layout'

interface VerifyEmailProps {
    username: string
    verifyLink: string
}

export default function VerifyEmail({ username, verifyLink }: Readonly<VerifyEmailProps>) {
    return (
        <EmailLayout preview="Verify your email address - Yukikaze Music Player">
            <Text style={{ fontSize: '16px', color: '#333' }}>
                Hi <strong>{username}</strong>,
            </Text>

            <Text style={{ fontSize: '16px', color: '#333', lineHeight: '1.6' }}>
                Thank you for signing up for Yukikaze Music Player! To complete your registration
                and start uploading music & creating playlists, please verify your email
                address by clicking the button below.
            </Text>

            <Section style={{ textAlign: 'center', margin: '30px 0' }}>
                <Button
                    href={verifyLink}
                    style={{
                        backgroundColor: '#0E8080',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '10px 16px',
                        borderRadius: '6px',
                        fontWeight: '500',
                        fontSize: '14px',
                        lineHeight: '20px',
                        margin: '0 auto',
                    }}
                >
                    Verify Email Address
                </Button>
            </Section>

            <Text style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                Or copy and paste this link into your browser:
            </Text>

            <Text style={{
                fontSize: '13px',
                color: '#0E8080',
                wordBreak: 'break-all',
                background: '#f5f5f5',
                padding: '10px',
                borderRadius: '4px'
            }}>
                <Link href={verifyLink}>{verifyLink}</Link>
            </Text>

            <Section style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
                <Text style={{ color: '#999', fontSize: '12px', lineHeight: '1.5' }}>
                    <strong>Note:</strong> This verification link will expire in 1 hour.
                </Text>
                <Text style={{ color: '#666', fontSize: '12px', lineHeight: '1.5' }}>
                    If you didn't create an account with Tien Music Player, please ignore
                    this email or contact our support team if you have concerns.
                </Text>
            </Section>
        </EmailLayout>
    )
}