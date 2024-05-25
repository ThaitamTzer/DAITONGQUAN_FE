import axiosClient from 'src/lib/axios'
import { ProfileAboutType } from 'src/types/apps/profileType'

const userProfileService = {
  // ** Get User Profile
  getUserProfile: async (): Promise<ProfileAboutType[]> => axiosClient.get(`/users/view-profile`),

  // ** Update User Profile
  updateUserProfile: async (data: ProfileAboutType): Promise<ProfileAboutType> =>
    axiosClient.post(`/users/update-profile`, data)
}

export default userProfileService
