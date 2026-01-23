import { User } from '@/types/user'
import { create } from 'zustand'

interface UserState {
  user: User | null
  setUser: (userData: User) => void
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  setUser: (userData: User) => {
    set({ user: userData })
  },
}))
