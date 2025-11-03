'use client'

import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  activeChat: string | null
  toggleSidebar: () => void
  setActiveChat: (chatId: string | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeChat: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveChat: (chatId: string | null) => set({ activeChat: chatId }),
}))

