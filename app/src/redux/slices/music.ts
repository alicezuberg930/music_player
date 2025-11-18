import { createSlice } from '@reduxjs/toolkit'
import type { IMusicState, Song } from '@/@types/song'

const initialState: IMusicState = {
  isPlaying: false,
  recentSongs: [],
  currentSongs: [],
  currentSong: null,
  isPlaylist: false,
  currentPlaylistName: null
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
    setCurrentSongs(state, action) {
      state.currentSongs = action.payload as Song[]
    },
    addRecentSong(state, action) {
      let songs = state.recentSongs
      const newSong = action.payload as Song
      if (songs.find(song => song.id === newSong.id))
        songs = songs.filter(song => song.id !== newSong.id)
      if (songs.length > 29)
        songs.pop()
      state.recentSongs = [newSong, ...songs]
    },
    setIsPlaylist(state, action) {
      state.isPlaylist = action.payload as boolean
    },

    // removeRecentSong(state, action) {
    //   const updateCart = state.cart.filter(product => product._id !== action.payload)
    //   state.cart = updateCart
    // },

    resetCart(state) {
      // state.cart = []
      // state.billing = null
      // // state.activeStep = 0
      // state.total = 0
      // state.subTotal = 0
      // state.discount = 0
      // state.shipping = 0
      // state.paymentMethod = null
    },

    backStep(state) {
      // state.activeStep -= 1
    },

    nextStep(state) {
      // state.activeStep += 1
    },

    gotoStep(state, action) {
      const step = action.payload
      // state.activeStep = step
    },

    // increaseQuantity(state, action) {
    //   const productId = action.payload

    //   const updateCart = state.checkout.cart.map((product) => {
    //     if (product.id === productId) {
    //       return {
    //         ...product,
    //         quantity: product.quantity + 1,
    //       }
    //     }
    //     return product
    //   })

    //   state.checkout.cart = updateCart
    // },

    // decreaseQuantity(state, action) {
    //   const productId = action.payload
    //   const updateCart = state.checkout.cart.map((product) => {
    //     if (product.id === productId) {
    //       return {
    //         ...product,
    //         quantity: product.quantity - 1,
    //       }
    //     }
    //     return product
    //   })

    //   state.checkout.cart = updateCart
    // },
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
  resetCart,
  gotoStep,
  backStep,
  nextStep,
} = slice.actions