'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, SignUpData, LoginData, OTPData } from '@/types/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginData) => Promise<void>
  signup: (data: SignUpData) => Promise<void>
  verifyOTP: (data: OTPData) => Promise<void>
  logout: () => void
  checkAuth: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (data: LoginData) => {
        set({ isLoading: true })
        try {
          // Dummy API call
          await new Promise((resolve) => setTimeout(resolve, 1500))
          
          const user: User = {
            id: '1',
            name: 'Spades',
            username: data.username,
            email: 'user@example.com',
            avatar: '/api/placeholder/40/40',
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      signup: async (data: SignUpData) => {
        set({ isLoading: true })
        try {
          await new Promise((resolve) => setTimeout(resolve, 1500))
          
          const user: User = {
            id: '1',
            name: data.name,
            username: data.username,
            email: data.email,
            phone: data.phone,
            avatar: '/api/placeholder/40/40',
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      verifyOTP: async (data: OTPData) => {
        set({ isLoading: true })
        try {
          await new Promise((resolve) => setTimeout(resolve, 2000))
          
          const user: User = {
            id: '1',
            name: 'Spades',
            username: 'spades',
            email: 'user@example.com',
            phone: data.phone,
            avatar: '/api/placeholder/40/40',
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      checkAuth: () => {
        return get().isAuthenticated && get().user !== null
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

