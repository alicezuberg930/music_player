import { Suspense, lazy, type ElementType } from 'react'

const Loadable = (Component: ElementType) => (props: any) => (
    <Suspense fallback={<>Suspended</>}>
        <Component {...props} />
    </Suspense>
)

export const PublicPage = Loadable(lazy(() => import('@/pages/PublicPage')));
export const HomePage = Loadable(lazy(() => import('@/pages/HomePage')));
export const PlaylistPage = Loadable(lazy(() => import('@/pages/PlaylistPage')));