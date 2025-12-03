import { createSlice } from '@reduxjs/toolkit'

type AppState = {
    showSideBarRight: boolean
    scrollTop: boolean
    language: string
}

const initialState: AppState = {
    showSideBarRight: false,
    scrollTop: false,
    language: 'en',
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
        setLanguage(state, action) {
            state.language = action.payload as string
        }
    }
})

// Reducer
export default slice.reducer

// Actions
export const {
    setShowSidebarRight,
    setScrollTop,
    setLanguage,
} = slice.actions