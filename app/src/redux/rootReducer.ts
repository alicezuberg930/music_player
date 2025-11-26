import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// slices
import musicReducer from './slices/music'
import appReducer from './slices/app'

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
}

export const musicPersistConfig = {
  key: 'music',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['songId', 'isPlaying', 'recentSongs', 'currentSongs', 'currentSong', 'currentPlaylistSongs', 'currentPlaylistName']
}

export const appPersistConfig = {
  key: 'app',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['showSideBarRight', 'scrollTop']
}

const rootReducer = combineReducers({
  // kanban: kanbanReducer,
  music: persistReducer(musicPersistConfig, musicReducer),
  app: persistReducer(appPersistConfig, appReducer),
})

export default rootReducer
