import { Router } from "./routes"
import SongOptionsDropdown from "./layout/song-options-dropdown"

export default function App() {
  return (
    <>
      <Router />
      <SongOptionsDropdown />
    </>
  )
}
