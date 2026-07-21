import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { paths } from './paths'
import {
    ArtistPage,
    SearchAllPage,
    SearchArtistPage,
    SearchMVPage,
    SearchPage,
    SearchPlaylistPage,
    SearchSongPage,
    VideoPage,
    WeeklyZingChartPage,
    ZingChartPage,
    UploadMusicPage,
    UploadVideoPage,
    MyMusicPage,
    HomePage,
    PublicPage,
    PlaylistPage,
    VerifyPage,
    CreateArtistPage,
    NotFoundPage,
    ComingSoonPage,
    MaintenancePage,
    InternalServerErrorPage,
    ForbiddenPage
} from './element'
import AuthGuard from '../lib/auth/AuthGuard'

export default function Router() {
    return useRoutes([
        {
            path: '/',
            element: <PublicPage />,
            children: [
                { element: <Navigate to={'/home'} replace />, index: true },
                { path: 'home', element: <HomePage /> },
                { path: 'playlist/:id', element: <PlaylistPage /> },
                { path: 'album/:id', element: <PlaylistPage /> },
                { path: 'week-chart/:title/:id', element: <WeeklyZingChartPage /> },
                { path: 'chart', element: <ZingChartPage /> },
                { path: 'artist/:name', element: <ArtistPage /> },
                {
                    path: 'search',
                    element: <SearchPage />,
                    children: [
                        { element: <Navigate to={'/search/all'} replace />, index: true },
                        { path: 'all', element: <SearchAllPage /> },
                        { path: 'song', element: <SearchSongPage /> },
                        { path: 'playlist', element: <SearchPlaylistPage /> },
                        { path: 'artist', element: <SearchArtistPage /> },
                        { path: 'video', element: <SearchMVPage /> },
                    ],
                },
                {
                    path: 'me',
                    element: <AuthGuard><Outlet /></AuthGuard>,
                    children: [
                        {
                            element: <Navigate to={'/me/upload-music'} replace />,
                            index: true
                        },
                        { path: 'upload-music', element: <UploadMusicPage /> },
                        { path: 'upload-video', element: <UploadVideoPage /> },
                        { path: 'profile', element: <></> },
                        { path: 'settings', element: <></> },
                        { path: 'create-artist', element: <CreateArtistPage /> },
                        { path: 'music', element: <MyMusicPage /> }
                    ],
                },
            ],
        },
        { path: '/video-clip/:title/:id', element: <VideoPage /> },
        { path: paths.VERIFY, element: <VerifyPage /> },
        {
            children: [
                { path: 'coming-soon', element: <ComingSoonPage /> },
                { path: 'maintenance', element: <MaintenancePage /> },
                { path: 'internal-server-error', element: <InternalServerErrorPage /> },
                { path: 'not-found', element: <NotFoundPage /> },
                { path: 'forbidden', element: <ForbiddenPage /> },
            ],
        },
        { path: '*', element: <Navigate to="/404" replace /> },
    ])
}