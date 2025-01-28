// frontend/src/store/userStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    id: string
    name: string
    email: string
    phone?: string
    token: string
}

interface UserStore {
  user: User | null
  setUser: (user: User | null) => void
  isAuthenticated: () => boolean
  logout: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      
      setUser: (user) => set({ user }),
      
      isAuthenticated: () => !!get().user,
      
      logout: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
)