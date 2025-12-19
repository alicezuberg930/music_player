import { Suspense, lazy, type ElementType } from 'react'

const Loadable = (Component: ElementType) => (props: any) => (
    <Suspense>
        <Component {...props} />
    </Suspense>
)

export const PublicPage = Loadable(lazy(() => import('@/pages/PublicPage')));
export const HomePage = Loadable(lazy(() => import('@/pages/HomePage')));
export const PlaylistPage = Loadable(lazy(() => import('@/pages/PlaylistPage')));
export const ArtistPage = Loadable(lazy(() => import('@/pages/ArtistPage')));
export const SearchAllPage = Loadable(lazy(() => import('@/pages/SearchAllPage')));
export const SearchArtistPage = Loadable(lazy(() => import('@/pages/SearchArtistPage')));
export const SearchMVPage = Loadable(lazy(() => import('@/pages/SearchMVPage')));
export const SearchPage = Loadable(lazy(() => import('@/pages/SearchPage')));
export const SearchPlaylistPage = Loadable(lazy(() => import('@/pages/SearchPlaylistPage')));
export const SearchSongPage = Loadable(lazy(() => import('@/pages/SearchSongPage')));
export const VideoClipPage = Loadable(lazy(() => import('@/pages/VideoClipPage')));
export const WeeklyZingChartPage = Loadable(lazy(() => import('@/pages/WeeklyZingChartPage')));
export const ZingChartPage = Loadable(lazy(() => import('@/pages/ZingChartPage')));
export const UploadMusicPage = Loadable(lazy(() => import('@/pages/UploadMusicPage')));
export const MyMusicPage = Loadable(lazy(() => import('@/pages/MyMusicPage')));
export const VerifyPage = Loadable(lazy(() => import('@/pages/VerifyPage')));
export const AddArtistPage = Loadable(lazy(() => import('@/pages/AddArtistPage')));