import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface UserProfile {
  id: string
  name: string
  username: string
  email: string
  avatar?: string
  bio?: string
  isOnline: boolean
  lastSeen?: string
}

interface UserState {
  searchResults: UserProfile[]
  selectedUser: UserProfile | null
  isSearching: boolean
}

const initialState: UserState = {
  searchResults: [],
  selectedUser: null,
  isSearching: false,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<UserProfile[]>) => {
      state.searchResults = action.payload
    },
    setSelectedUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.selectedUser = action.payload
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload
    },
    clearSearch: (state) => {
      state.searchResults = []
      state.isSearching = false
    },
  },
})

export const { setSearchResults, setSelectedUser, setIsSearching, clearSearch } = userSlice.actions
export default userSlice.reducer
