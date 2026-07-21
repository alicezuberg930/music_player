import { Suspense, lazy, type ElementType } from 'react'

const Loadable = (Component: ElementType) => (props: any) => (
    <Suspense>
        <Component {...props} />
    </Suspense>
)

export const PublicPage = Loadable(lazy(() => import('@/layout/public-layout')))
export const HomePage = Loadable(lazy(() => import('@/pages/home')))
export const PlaylistPage = Loadable(lazy(() => import('@/pages/playlist')))
export const ArtistPage = Loadable(lazy(() => import('@/pages/artist/[id]')))
export const SearchAllPage = Loadable(lazy(() => import('@/pages/SearchAllPage')))
export const SearchArtistPage = Loadable(lazy(() => import('@/pages/SearchArtistPage')))
export const SearchMVPage = Loadable(lazy(() => import('@/pages/SearchMVPage')))
export const SearchPage = Loadable(lazy(() => import('@/pages/SearchPage')))
export const SearchPlaylistPage = Loadable(lazy(() => import('@/pages/SearchPlaylistPage')))
export const SearchSongPage = Loadable(lazy(() => import('@/pages/SearchSongPage')))
export const VideoPage = Loadable(lazy(() => import('@/pages/video')))
export const WeeklyZingChartPage = Loadable(lazy(() => import('@/pages/WeeklyZingChartPage')))
export const ZingChartPage = Loadable(lazy(() => import('@/pages/ZingChartPage')))
export const UploadMusicPage = Loadable(lazy(() => import('@/pages/UploadMusicPage')))
export const UploadVideoPage = Loadable(lazy(() => import('@/pages/UploadVideoPage')))
export const MyMusicPage = Loadable(lazy(() => import('@/pages/MyMusicPage')))
export const VerifyPage = Loadable(lazy(() => import('@/pages/VerifyPage')))
export const CreateArtistPage = Loadable(lazy(() => import('@/pages/artist/create')))
export const NotFoundPage = Loadable(lazy(() => import('@/pages/error/not-found')))
export const MaintenancePage = Loadable(lazy(() => import('@/pages/error/maintenance')))
export const ForbiddenPage = Loadable(lazy(() => import('@/pages/error/forbidden')))
export const InternalServerErrorPage = Loadable(lazy(() => import('@/pages/error/internal-server-error')))
export const ComingSoonPage = Loadable(lazy(() => import('@/pages/error/coming-soon')))