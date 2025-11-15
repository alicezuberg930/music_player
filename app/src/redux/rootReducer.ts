import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
// slices
import musicReducer from './slices/music'

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
  whitelist: ['songId', 'isPlaying', 'recentSongs', 'currentSongs', 'currentSong', 'isPlaylistPlaying', 'currentPlaylistName']
}

const rootReducer = combineReducers({
  // kanban: kanbanReducer,
  music: persistReducer(musicPersistConfig, musicReducer),
})

export default rootReducer
