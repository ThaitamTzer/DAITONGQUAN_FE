import userProfileService from 'src/service/userProfileService.service'
import { userProfile, userById } from 'src/types/user'
import { create } from 'zustand'

type userProfileState = {
  user: userProfile
  userId: userById
}

type userProfileActions = {
  getUserProfile: () => void
  getUserProfileById: (id: string) => void
}

type userProfileStore = userProfileState & userProfileActions

export const useUserProfileStore = create<userProfileStore>(set => ({
  user: {} as userProfile,
  userId: {} as userById,
  getUserProfileById: async (id: string) => {
    try {
      const response = await userProfileService.getUserProfileById(id)
      set({ userId: response })
    } catch (error) {
      console.log(error)
    }
  },
  getUserProfile: async () => {
    try {
      const response = await userProfileService.getUserProfile()
      set({ user: response })
    } catch (error) {
      console.log(error)
    }
  }
}))
