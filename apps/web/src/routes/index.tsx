import { createRootRoute, createRoute, createRouter, Navigate, Outlet, RouterProvider } from "@tanstack/react-router"
import { queryClient } from "@/providers/query-client-provider"
import { AuthGuard } from "@/lib/auth/auth-guard"

import { PublicLayout } from "@/layout/public-layout"
import { SearchLayout } from "@/layout/search-layout"

import NotFoundPage from "@/pages/error/not-found"
import ComingSoonPage from "@/pages/error/coming-soon"
import ForbiddenPage from "@/pages/error/forbidden"
import InternalServerErrorPage from "@/pages/error/internal-server-error"
import MaintenancePage from "@/pages/error/maintenance"

import {
  HomePage,
  ZingChartPage,
  WeeklyZingChartPage,
  SearchAllPage,
  SearchSongPage,
  SearchPlaylistPage,
  SearchArtistPage,
  SearchMVPage,
  PlaylistPage,
  ArtistPage,
  VideoPage,
  UploadSongPage,
  UploadVideoPage,
  MyMusicPage,
  CreateArtistPage,
  VerifyPage,
} from "@/pages"

const rootRoute = createRootRoute({
  component: Outlet,
  notFoundComponent: NotFoundPage,
})

const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  component: PublicLayout,
})

const searchLayoutRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "search",
  component: SearchLayout,
}).addChildren([
  createRoute({
    getParentRoute: () => searchLayoutRoute,
    path: "",
    component: () => <Navigate to="/search/all" replace />,
  }),
  createRoute({ getParentRoute: () => searchLayoutRoute, path: "all", component: SearchAllPage }),
  createRoute({ getParentRoute: () => searchLayoutRoute, path: "song", component: SearchSongPage }),
  createRoute({ getParentRoute: () => searchLayoutRoute, path: "playlist", component: SearchPlaylistPage }),
  createRoute({ getParentRoute: () => searchLayoutRoute, path: "artist", component: SearchArtistPage }),
  createRoute({ getParentRoute: () => searchLayoutRoute, path: "video", component: SearchMVPage }),
])

const meRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: "me",
  component: () => (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  ),
}).addChildren([
  createRoute({
    getParentRoute: () => meRoute,
    path: "",
    component: () => <Navigate to="/me/upload-music" replace />,
  }),
  createRoute({ getParentRoute: () => meRoute, path: "upload-song", component: UploadSongPage }),
  createRoute({ getParentRoute: () => meRoute, path: "upload-music", component: UploadSongPage }),
  createRoute({ getParentRoute: () => meRoute, path: "upload-video", component: UploadVideoPage }),
  createRoute({ getParentRoute: () => meRoute, path: "create-artist", component: CreateArtistPage }),
  createRoute({ getParentRoute: () => meRoute, path: "add-artist", component: CreateArtistPage }),
  createRoute({ getParentRoute: () => meRoute, path: "profile", component: () => <></> }),
  createRoute({ getParentRoute: () => meRoute, path: "settings", component: () => <></> }),
  createRoute({ getParentRoute: () => meRoute, path: "music", component: MyMusicPage }),
])

const publicChildren = [
  createRoute({ getParentRoute: () => publicRoute, path: "", component: () => <Navigate to="/home" replace /> }),
  createRoute({ getParentRoute: () => publicRoute, path: "home", component: HomePage }),
  createRoute({ getParentRoute: () => publicRoute, path: "playlist/$id", component: PlaylistPage }),
  createRoute({ getParentRoute: () => publicRoute, path: "album/$id", component: PlaylistPage }),
  createRoute({ getParentRoute: () => publicRoute, path: "artist/$name", component: ArtistPage }),
  createRoute({ getParentRoute: () => publicRoute, path: "week-chart/$title/$id", component: WeeklyZingChartPage }),
  createRoute({ getParentRoute: () => publicRoute, path: "chart", component: ZingChartPage }),
  createRoute({ getParentRoute: () => publicRoute, path: "video", component: VideoPage }),
]

const verifyRoute = createRoute({ getParentRoute: () => rootRoute, path: "verify/$id", component: VerifyPage })
const videoRoute = createRoute({ getParentRoute: () => rootRoute, path: "video/$id", component: VideoPage })
const videoClipRoute = createRoute({ getParentRoute: () => rootRoute, path: "video-clip/$title/$id", component: VideoPage })

const errorRoutes = [
  createRoute({ getParentRoute: () => rootRoute, path: "coming-soon", component: ComingSoonPage }),
  createRoute({ getParentRoute: () => rootRoute, path: "maintenance", component: MaintenancePage }),
  createRoute({ getParentRoute: () => rootRoute, path: "internal-server-error", component: InternalServerErrorPage }),
  createRoute({ getParentRoute: () => rootRoute, path: "not-found", component: NotFoundPage }),
  createRoute({ getParentRoute: () => rootRoute, path: "forbidden", component: ForbiddenPage }),
  createRoute({ getParentRoute: () => rootRoute, path: "*", component: () => <Navigate to="/not-found" replace /> }),
]

const routeTree = rootRoute.addChildren([
  publicRoute.addChildren(publicChildren),
  searchLayoutRoute,
  meRoute,
  verifyRoute,
  videoRoute,
  videoClipRoute,
  ...errorRoutes,
])

const router = createRouter({
  routeTree,
  context: { queryClient: queryClient() },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
})

export const Router = () => <RouterProvider router={router} />
