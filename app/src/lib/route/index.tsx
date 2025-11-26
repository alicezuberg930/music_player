import { Navigate, useRoutes } from 'react-router-dom'
import { paths } from './paths'
import {
    ArtistPage,
    SignupPage,
    PlaylistPage,
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
    HomePage,
    PublicPage,
    SigninPage
} from '@/pages'

export default function Router() {
    return useRoutes([
        { path: '/', element: <Navigate to="/home" replace /> },
        {
            path: '/',
            element: <PublicPage />,
            children: [
                { element: <Navigate to={'/home'} replace />, index: true },
                { path: '/home', element: <HomePage /> },
                { path: '/playlist/:id', element: <PlaylistPage /> },
                { path: '/album/:id', element: <PlaylistPage /> },
                { path: '/week-chart/:title/:id', element: <WeeklyZingChartPage /> },
                { path: '/chart', element: <ZingChartPage /> },
                { path: "/artist/:name", element: <ArtistPage /> },
                {
                    path: '/search',
                    element: <SearchPage />,
                    children: [
                        { element: <Navigate to={'/search/all'} replace />, index: true },
                        { path: "all", element: <SearchAllPage /> },
                        { path: "song", element: <SearchSongPage /> },
                        { path: "playlist", element: <SearchPlaylistPage /> },
                        { path: "artist", element: <SearchArtistPage /> },
                        { path: "video", element: <SearchMVPage /> },
                    ],
                },
                {
                    path: "/me",
                    children: [
                        { element: <Navigate to={'/me/upload-music'} replace />, index: true },
                        { path: "upload-music", element: <UploadMusicPage /> },
                        { path: "profile", element: <></> },
                        { path: "settings", element: <></> },
                    ],
                },
            ],
        },
        { path: "/video-clip/:title/:id", element: <VideoClipPage /> },
        { path: paths.SIGNIN, element: <SigninPage /> },
        { path: paths.SIGNUP, element: <SignupPage /> },
    ])
}