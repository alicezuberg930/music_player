import { useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@yukikaze/ui/card"
import { Typography } from "@yukikaze/ui/typography"
import { useMutation } from "@tanstack/react-query"
import { userQueries } from "@/lib/queries/user"

const VerifyPage: React.FC = () => {
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const { mutate, status, data } = useMutation(userQueries().verify.mutationOptions())

    useEffect(() => {
        if (id && token) mutate({ userId: id, token })
    }, [id, token])

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center">Email Verification</CardTitle>
                    <CardDescription className="text-center">
                        {status === 'pending' ? 'Verifying your email...' : 'Verification Status'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Typography className="text-center wrap-break-word">
                        {status === 'pending' ? 'Please wait...' : data?.message}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default VerifyPage