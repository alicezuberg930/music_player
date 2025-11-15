import { Routes, Route } from "react-router-dom";
import { paths } from "./lib/global_paths";
import { ArtistPage, HomePage, LoginPage, PlaylistPage, PublicPage, SearchAllPage, SearchArtistPage, SearchMVPage, SearchPage, SearchPlaylistPage, SearchSongPage, VideoClipPage, WeeklyZingChartPage, ZingChartPage } from "./pages";

export default function App() {
  return (
    <Routes>
      <Route path={paths.PUBLIC} element={<PublicPage />} >
        <Route path={paths.HOME} element={<HomePage />} />
        <Route path={paths.LOGIN} element={<LoginPage />} />
        <Route path={paths.PLAYLIST__TITLE__ID} element={<PlaylistPage />} />
        <Route path={paths.ALBUM__TITLE__ID} element={<PlaylistPage />} />
        <Route path={paths.WEEKRANK__TITLE__ID} element={<WeeklyZingChartPage />} />
        <Route path={paths.ZING_CHART} element={<ZingChartPage />} />
        <Route path={paths.SEARCH} element={<SearchPage />}>
          <Route path={paths.SEARCH_ALL} element={<SearchAllPage />} />
          <Route path={paths.SEARCH_SONG} element={<SearchSongPage />} />
          <Route path={paths.SEARCH_PLAYLIST} element={<SearchPlaylistPage />} />
          <Route path={paths.SEARCH_ARTIST} element={<SearchArtistPage />} />
          <Route path={paths.SEARCH_MV} element={<SearchMVPage />} />
        </Route>
        <Route path={paths.ARTIST__NAME} element={<ArtistPage />} />
      </Route>
      <Route path={paths.VIDEOCLIP__TITLE__ID} element={<VideoClipPage />} />
    </Routes>
  )
}