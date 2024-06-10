import axiosClient from 'src/lib/axios'

const userAdminService = {
  // ** Get all user
  getAllUser: async () => axiosClient.get('/users/list-users'),

  // ** Search user
  searchUser: async (searchKey: string) => axiosClient.get(`/users/search?searchKey=${searchKey}`),

  // Block User
  blockUser: async (data: any) => axiosClient.patch(`/users/update-block-user`, data),

  // ** Delete User
  deleteUser: async (data: any) => axiosClient.delete(`/users/delete-user`, { data })
}

export default userAdminService
