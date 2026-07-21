// public pages
export { default as PublicPage } from '../layout/public-layout'
export { default as HomePage } from './home'
export { default as SearchAllPage } from './SearchAllPage'
export { default as SearchArtistPage } from './SearchArtistPage'
export { default as SearchMVPage } from './SearchMVPage'
export { default as SearchPage } from './SearchPage'
export { default as SearchPlaylistPage } from './SearchPlaylistPage'
export { default as SearchSongPage } from './SearchSongPage'
export { default as WeeklyZingChartPage } from './WeeklyZingChartPage'
export { default as ZingChartPage } from './ZingChartPage'
export { default as UploadMusicPage } from './UploadMusicPage'
export { default as UploadVideoPage } from './UploadVideoPage'
export { default as MyMusicPage } from './me/music'

// artist pages
export { default as ArtistPage } from './artist/[id]'
export { default as CreateArtistPage } from './artist/create'
// playlist pages
export { default as PlaylistPage } from './playlist'
// video pages
export { default as VideoPage } from './video'
// error pages
export { default as ComingSoonPage } from './error/coming-soon'
export { default as ForbiddenPage } from './error/forbidden'
export { default as InternalServerError } from './error/internal-server-error'
export { default as MaintenancePage } from './error/maintenance'
export { default as NotFoundPage } from './error/not-found'