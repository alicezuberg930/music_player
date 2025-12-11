import { createSlice } from '@reduxjs/toolkit'

type AppState = {
    showSideBarRight: boolean
    scrollTop: boolean
}

const initialState: AppState = {
    showSideBarRight: false,
    scrollTop: false,
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
        }
    }
})

// Reducer
export default slice.reducer

// Actions
export const {
    setShowSidebarRight,
    setScrollTop,
} = slice.actions