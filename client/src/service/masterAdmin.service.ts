import axiosClient from 'src/lib/axios'

const masterAdminService = {
  // ** Get All Admin
  getAllAdmin: async () => axiosClient.get('/admin'),

  // ** Create New Admin
  createAdmin: async (data: any) => axiosClient.post('/admin', data),

  // ** Update Admin
  updateAdmin: async (data: any) => axiosClient.put(`/admin`, data),

  // ** Delete Admin
  deleteAdmin: async () => axiosClient.delete(`/admin`),

  // ** Blocl Admin
  blockAdmin: async () => axiosClient.put(`/admin/update-block`)
}

export default masterAdminService
