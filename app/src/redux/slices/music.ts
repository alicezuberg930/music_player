import { createSlice } from '@reduxjs/toolkit'
import type { IMusicState, Song } from '@/@types/song'

const initialState: IMusicState = {
  songId: null,
  isPlaying: false,
  recentSongs: [],
  currentSongs: [],
  currentSong: null,
  isPlaylistPlaying: false,
  currentPlaylistName: null
}

const slice = createSlice({
  name: 'music',
  initialState,
  reducers: {
    addRecentSong(state, action) {
      let songs = state.recentSongs
      const newSong = action.payload as Song
      if (songs.find(song => song.id === newSong.id))
        songs = songs.filter(song => song.id !== newSong.id)
      if (songs.length > 29)
        songs.pop()
      state.recentSongs = [newSong, ...songs]
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

    createBilling(state, action) {
      if (action.payload._id) delete action.payload._id
      state.billing = action.payload
    },

    applyDiscount(state, action) {
      const discount = action.payload
      state.discount = discount
      state.total = state.subTotal - discount
    },

    applyShipping(state, action) {
      const shipping = action.payload
      state.shipping = shipping
      state.total = state.subTotal - state.discount + shipping
    },

    applyPaymentMethod(state, action) {
      const paymentMethod = action.payload
      state.paymentMethod = paymentMethod
    },

  },
})

// Reducer
export default slice.reducer

// Actions
export const {
  addRecentSong,
  resetCart,
  gotoStep,
  backStep,
  nextStep,
  createBilling,
  applyShipping,
  applyDiscount,
  applyPaymentMethod,
} = slice.actions