import { createSlice } from '@reduxjs/toolkit'
import type { IMusicState, Song } from '@/@types/song'

const initialState: IMusicState = {
  isPlaying: false,
  recentSongs: [],
  currentPlaylistSongs: [],
  currentSong: null,
  isPlaylist: false,
  currentPlaylistName: null,
}

const slice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    setCurrentPlaylistName(state, action) {
      state.currentPlaylistName = action.payload as string
    },
    setCurrentSong(state, action) {
      state.currentSong = action.payload as Song
    },
    setIsPlaying(state, action) {
      state.isPlaying = action.payload as boolean
    },
    setCurrentPlaylistSongs(state, action) {
      state.currentPlaylistSongs = action.payload as Song[]
    },
    addRecentSong(state, action) {
      let songs = state.recentSongs
      const newSong = action.payload as Song
      if (songs.find(song => song.id === newSong.id)) songs = songs.filter(song => song.id !== newSong.id)
      if (songs.length > 29) songs.pop()
      state.recentSongs = [newSong, ...songs]
    },
    setIsPlaylist(state, action) {
      state.isPlaylist = action.payload as boolean
    },
    deleteCurrentSongs(state) {
      state.currentPlaylistSongs = []
      state.recentSongs = []
    }
  },
})

// Reducer
export default slice.reducer

// Actions
export const {
  setCurrentPlaylistName,
  setCurrentSong,
  setIsPlaying,
  addRecentSong,
  setIsPlaylist,
  setCurrentPlaylistSongs,
  deleteCurrentSongs
} = slice.actions