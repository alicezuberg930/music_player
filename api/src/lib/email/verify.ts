import { Resend } from 'resend'
import env from '../helpers/env'

const resend = new Resend(env.RESEND_API_KEY)

export const sendVerifyEmail = async (to: string, fullname: string, verifyToken: string, userId: string) => {
    try {
        const verifyUrl = `${env.WEB_URL}/verify/${userId}?token=${verifyToken}`
        
        const { data, error } = await resend.emails.send({
            from: 'Tien Music Player <onboarding@tien-music-player.site>',
            to: [to],
            subject: 'Verify Your Email - Tien Music Player',
            html: `
                <div style="max-width: 768px; margin: 0 auto; padding: 12px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #0E8080; margin-bottom: 10px;">Verify Your Email</h1>
                    </div>
                    
                    <p style="font-size: 16px; color: #333;">Hi <strong>${fullname}</strong>,</p>
                    
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        Thank you for signing up for Tien Music Player! To complete your registration and start uploading musics & create playlists, 
                        please verify your email address by clicking the button below.
                    </p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${verifyUrl}" 
                           style="background-color: #0E8080; 
                                  color: white; 
                                  padding: 14px 32px; 
                                  text-decoration: none; 
                                  border-radius: 6px; 
                                  font-weight: bold;
                                  font-size: 16px;
                                  display: inline-block;">
                            Verify Email Address
                        </a>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; line-height: 1.6;">
                        Or copy and paste this link into your browser:
                    </p>
                    <p style="font-size: 13px; color: #0E8080; word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 4px;">
                        ${verifyUrl}
                    </p>
                    
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
                        <p style="color: #999; font-size: 12px; line-height: 1.5;">
                            <strong>Note:</strong> This verification link will expire in 1 hour.
                        </p>
                        <p style="color: #666; font-size: 12px; line-height: 1.5;">
                            If you didn't create an account with Tien Music Player, please ignore this email or 
                            contact our support team if you have concerns.
                        </p>
                        <p style="color: #999; font-size: 11px; margin-top: 20px;">
                            © 2025 Tien Music Player. All rights reserved.
                        </p>
                    </div>
                </div>
            `
        })

        if (error) {
            console.error('Failed to send verification email:', error)
            return { success: false, error }
        }

        console.log('Verification email sent successfully:', data)
        return { success: true, data }
    } catch (error) {
        console.error('Error sending verification email:', error)
        return { success: false, error }
    }
}
