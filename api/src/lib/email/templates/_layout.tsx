import {
    Body,
    Container,
    Font,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components'
import * as React from 'react'

interface EmailLayoutProps {
    preview?: string
    children: React.ReactNode
}

export function EmailLayout({ preview, children }: Readonly<EmailLayoutProps>) {
    return (
        <Html lang='en'>
            <Head>
                <Preview>
                    {preview ?? 'This is an important email from Yukinu.'}
                </Preview>

                <Font
                    fontFamily='Geist'
                    fallbackFontFamily='sans-serif'
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/geist/v4/gyByhwUxId8gMEwcGFU.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle='normal'
                />
            </Head>

            <Body style={{ backgroundColor: '#fafafa' }}>
                <Container
                    style={{
                        borderRadius: '12px',
                        border: '1px solid #e4e4e4',
                        backgroundColor: '#ffffff',
                        padding: '24px',
                    }}
                >
                    <Img
                        src='https://tiesen.id.vn/web-app-manifest-512x512.png'
                        width={80}
                        height={80}
                        alt='Yukikaze Music Player'
                        style={{ margin: '0 auto 20px auto' }}
                    />

                    {children}

                    <Text>
                        Still have questions? Please contact{' '}
                        <Link href='mailto:support@tiesen.id.vn'>Yukikaze Support</Link>
                    </Text>
                </Container>

                <Section style={{ textAlign: 'center', color: '#525252' }}>
                    <Text>@ {new Date().getFullYear()} Yukikaze Music Player. All rights reserved.</Text>
                </Section>
            </Body>
        </Html>
    )
}