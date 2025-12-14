"use client"

import type { ReactNode } from "react"
import { Provider } from "react-redux"
import { ThemeProvider } from "next-themes"
import { store } from "@/lib/store/store"
import { SocketProvider } from "./socket-provider"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <SocketProvider>{children}</SocketProvider>
      </ThemeProvider>
    </Provider>
  )
}
