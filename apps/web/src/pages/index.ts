// public pages
export { default as HomePage } from './home'
export { default as ZingChartPage } from './ZingChartPage'
export { default as WeeklyZingChartPage } from './WeeklyZingChartPage'
// search pages
export { default as SearchAllPage } from './search/all'
export { default as SearchArtistPage } from './search/artist'
export { default as SearchMVPage } from './search/mv'
export { default as SearchPlaylistPage } from './search/playlist'
export { default as SearchSongPage } from './search/song'
// authenticated pages
export { default as UploadSongPage } from './me/upload/song'
export { default as UploadVideoPage } from './me/upload/video'
export { default as MyMusicPage } from './me/music'
export { default as VerifyPage } from './verify'
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
export { default as InternalServerErrorPage } from './error/internal-server-error'
export { default as MaintenancePage } from './error/maintenance'
export { default as NotFoundPage } from './error/not-found'
