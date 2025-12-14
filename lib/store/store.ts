import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/auth-slice"
import chatReducer from "./slices/chat-slice"
import settingsReducer from "./slices/settings-slice"
import userReducer from "./slices/user-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    settings: settingsReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
