import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  name: string
  username: string
  email: string
  avatar?: string
  bio?: string
  createdAt: string
  lastNameChange?: string
  lastUsernameChange?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  otpEmail: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otpEmail: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },
    setOtpEmail: (state, action: PayloadAction<string>) => {
      state.otpEmail = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    updateAvatar: (state, action: PayloadAction<string | undefined>) => {
      if (state.user) {
        state.user.avatar = action.payload
      }
    },
    removeAvatar: (state) => {
      if (state.user) {
        state.user.avatar = undefined
      }
    },
  },
})

export const {
  setLoading,
  setUser,
  setError,
  logout,
  setOtpEmail,
  clearError,
  updateProfile,
  updateAvatar,
  removeAvatar,
} = authSlice.actions
export default authSlice.reducer
