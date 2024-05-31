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

  // ** Block Admin
  blockAdmin: async () => axiosClient.put(`/admin/update-block`),

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
