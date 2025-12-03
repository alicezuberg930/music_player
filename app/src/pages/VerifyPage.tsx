import { verifyEmail } from "@/lib/httpClient"
import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

const VerifyPage: React.FC = () => {
    const [result, setResult] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    useEffect(() => {
        const verify = async () => {
            setLoading(true)
            const response = await verifyEmail(id!, token!)
            if (response.statusCode === 200) {
                setResult(response.message)
            } else {
                setResult(response.message || 'Verification failed')
            }
            setLoading(false)
        }
        if (id && token) verify()
    }, [id, token])

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Email Verification</CardTitle>
                    <CardDescription className="text-center">
                        {loading ? 'Verifying your email...' : 'Verification Status'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Typography className="text-center wrap-break-word">
                        {loading ? 'Please wait...' : result}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default VerifyPage