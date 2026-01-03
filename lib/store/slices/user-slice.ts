import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { searchUsers } from "@/lib/api/profile-api"

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
  searchError: string | null
}

const initialState: UserState = {
  searchResults: [],
  selectedUser: null,
  isSearching: false,
  searchError: null,
}

export const searchUserThunk = createAsyncThunk(
  "user/searchUser",
  async ({ query, type }: { query: string; type: "email" | "username" }, { rejectWithValue }) => {
    try {
      const result = await searchUsers(query, type)

      if ("message" in result && "user" in result === false) {
        return rejectWithValue(result.message)
      }

      if ("user" in result) {
        const user = result.user
        return {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          isOnline: false,
        }
      }

      return rejectWithValue("No user found")
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Search failed")
    }
  },
)

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<UserProfile | null>) => {
      state.selectedUser = action.payload
    },
    clearSearch: (state) => {
      state.searchResults = []
      state.searchError = null
      state.isSearching = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUserThunk.pending, (state) => {
        state.isSearching = true
        state.searchError = null
      })
      .addCase(searchUserThunk.fulfilled, (state, action) => {
        state.isSearching = false
        state.searchResults = [action.payload]
        state.selectedUser = action.payload
      })
      .addCase(searchUserThunk.rejected, (state, action) => {
        state.isSearching = false
        state.searchError = action.payload as string
        state.searchResults = []
        state.selectedUser = null
      })
  },
})

export const { setSelectedUser, clearSearch } = userSlice.actions
export default userSlice.reducer
