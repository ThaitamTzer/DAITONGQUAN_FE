import axiosClient from 'src/lib/axios'

const masterAdminService = {
  // ** Get All Admin
  getAllAdmin: async () => axiosClient.get('/admin'),

  // ** Create New Admin
  createAdmin: async (data: any) => axiosClient.post('/admin', data),

  // ** Update Admin
  updateAdmin: async (data: any) => axiosClient.put(`/admin`, data),

  // ** Delete Admin
  deleteAdmin: async (data: any) => axiosClient.delete(`/admin`, { data }),

  // ** Block Admin
  blockAdmin: async (data: any) => axiosClient.patch(`/admin/update-block`, data),

  // ** Get All Role
  getAllRole: async () => axiosClient.get('/role'),

  // ** Create New Role
  createRole: async (data: any) => axiosClient.post('/role', data),

  // ** Update Role
  updateRole: async (data: any) => axiosClient.put('/role', data),

  // ** Delete Role with requestd body id
  deleteRole: async (data: any) => axiosClient.delete('/role', { data })
}

export default masterAdminService
