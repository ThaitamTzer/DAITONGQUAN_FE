import axiosClient, { axiosUpload } from 'src/lib/axios'
import { ProfileAboutType } from 'src/types/apps/profileType'

const userProfileService = {
  // ** Get User Profile
  getUserProfile: async (): Promise<any> => axiosClient.get(`/users/view-profile`),

  // ** Update User Profile
  updateUserProfile: async (data: ProfileAboutType): Promise<ProfileAboutType> =>
    axiosClient.put(`/users/update-profile`, data),

  // ** Upload Profile Avatar with multipath Form Data
  uploadProfileAvatar: async (data: FormData): Promise<string> => axiosUpload.patch(`/users/update-avatar`, data)
}

export default userProfileService
