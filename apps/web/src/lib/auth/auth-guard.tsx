import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
// components
import SignInForm from '@/layout/header/sign-in-form'
import { HomeShimmer } from '@/components/loading-placeholder'
import { useAuthContext } from '@/providers/auth-provider'

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isInitialized } = useAuthContext()
    const { pathname } = useLocation()
    const [requestedLocation, setRequestedLocation] = useState<string | null>(null)

    if (!isInitialized) {
        return <HomeShimmer />
    }

    if (!isAuthenticated) {
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname)
        }
        return <SignInForm />
    }

    if (requestedLocation && pathname !== requestedLocation) {
        setRequestedLocation(null)
        return <Navigate to={requestedLocation} />
    }

    return children
}
export default AuthGuard