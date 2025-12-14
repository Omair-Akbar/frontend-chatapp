import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type LockDisplayMode = "text" | "icon" | "custom"

interface SettingsState {
  theme: "light" | "dark" | "system"
  lockDisplayMode: LockDisplayMode
  customLockText: string
  notifications: boolean
  soundEnabled: boolean
}

const initialState: SettingsState = {
  theme: "system",
  lockDisplayMode: "text",
  customLockText: "Locked",
  notifications: true,
  soundEnabled: true,
}

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload
    },
    setLockDisplayMode: (state, action: PayloadAction<LockDisplayMode>) => {
      state.lockDisplayMode = action.payload
    },
    setCustomLockText: (state, action: PayloadAction<string>) => {
      state.customLockText = action.payload
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled
    },
  },
})

export const { setTheme, setLockDisplayMode, setCustomLockText, toggleNotifications, toggleSound } =
  settingsSlice.actions
export default settingsSlice.reducer
