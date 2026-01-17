import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
// components
// import LoadingScreen from '../components/loading-screen'
//
import SigninPage from '@/pages/SigninPage'
import { useAuthContext } from './useAuthContext'

// ----------------------------------------------------------------------

type AuthGuardProps = {
    children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated } = useAuthContext()

    const { pathname } = useLocation()

    const [requestedLocation, setRequestedLocation] = useState<string | null>(null)

    // if (!isInitialized) {
    //     return <LoadingScreen />
    // }

    if (!isAuthenticated) {
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname)
        }
        return <SigninPage />
    }

    if (requestedLocation && pathname !== requestedLocation) {
        setRequestedLocation(null)
        return <Navigate to={requestedLocation} />
    }

    return <> {children} </>
}
