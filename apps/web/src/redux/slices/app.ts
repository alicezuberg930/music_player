import { createSlice } from '@reduxjs/toolkit'

type AppState = {
    showSideBarRight: boolean
    scrollTop: boolean
    lastTokenRefresh: number | null
}

const initialState: AppState = {
    showSideBarRight: false,
    scrollTop: false,
    lastTokenRefresh: null,
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setShowSidebarRight(state, action) {
            state.showSideBarRight = action.payload as boolean
        },
        setScrollTop(state, action) {
            state.scrollTop = action.payload as boolean
        },
        setLastTokenRefresh(state, action) {
            state.lastTokenRefresh = action.payload as number | null
        }
    }
})

// Reducer
export default slice.reducer

// Actions
export const {
    setShowSidebarRight,
    setScrollTop,
    setLastTokenRefresh,
} = slice.actions