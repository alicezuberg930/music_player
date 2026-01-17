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
    VideoClipPage,
    WeeklyZingChartPage,
    ZingChartPage,
    UploadMusicPage,
    MyMusicPage,
    HomePage,
    PublicPage,
    PlaylistPage,
    VerifyPage,
    AddArtistPage,
    Page404
} from './element'
import AuthGuard from '../auth/AuthGuard'

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
                        { path: 'profile', element: <></> },
                        { path: 'settings', element: <></> },
                        { path: 'add-artist', element: <AddArtistPage /> },
                        { path: 'music', element: <MyMusicPage /> }
                    ],
                },
            ],
        },
        { path: '/video-clip/:title/:id', element: <VideoClipPage /> },
        { path: paths.VERIFY, element: <VerifyPage /> },
        {
            children: [
                // { path: 'coming-soon', element: <ComingSoonPage /> },
                // { path: 'maintenance', element: <MaintenancePage /> },
                // { path: '500', element: <Page500 /> },
                { path: '404', element: <Page404 /> },
                // { path: '403', element: <Page403 /> },
            ],
        },
        { path: '*', element: <Navigate to="/404" replace /> },
    ])
}