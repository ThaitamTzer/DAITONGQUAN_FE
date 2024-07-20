import axiosClient from 'src/lib/axios'

type UserListType = {
  _id: string
  firstname: string
  lastname: string
  email: string
  hyperlink: []
  avatar: string
  status: string
  isBlock: boolean
  createdAt: string | Date
  address: string
  dateOfBirth: string | Date
  description: string
  gender: string
  nickname: string
  phone: number
}

const userAdminService = {
  // ** Get all user
  getAllUser: async (): Promise<UserListType[]> => axiosClient.get('/users/list-users'),

  // ** Search user
  searchUser: async (searchKey: string) => axiosClient.get(`/users/search?searchKey=${searchKey}`),

  // Block User
  blockUser: async (data: any) => axiosClient.patch(`/users/update-block-user`, data),

  // ** Delete User
  deleteUser: async (data: any) => axiosClient.delete(`/users/delete-user`, { data })
}

export default userAdminService
