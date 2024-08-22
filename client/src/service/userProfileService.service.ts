import axiosClient, { axiosUpload } from 'src/lib/axios'
import { ProfileAboutType } from 'src/types/apps/profileType'
import { userProfile, userById } from 'src/types/user'

const userProfileService = {
  // ** Get User Profile
  getUserProfile: async (): Promise<userProfile> => axiosClient.get(`/users/view-profile`),

  // ** Update User Profile
  updateUserProfile: async (data: ProfileAboutType): Promise<ProfileAboutType> =>
    axiosClient.put(`/users/update-profile`, data),

  // ** Upload Profile Avatar with multipath Form Data
  uploadProfileAvatar: async (data: FormData): Promise<string> => axiosUpload.patch(`/users/update-avatar`, data),

  // ** Attendance User
  attendanceUser: async (): Promise<any> => axiosClient.patch(`/users/attendance-user`),

  //Get User Profile by ID
  getUserProfileById: async (id: string): Promise<userById> => axiosClient.get(`/users/view-profile/${id}`)
}

export default userProfileService
