import axiosClient from 'src/lib/axios'

const limitSpendingService = {
  // ** Create limit
  createLimit: async (data: any) => axiosClient.post('/spendinglimit', data),

  // ** Update limit
  updateLimit: async (data: any) => axiosClient.put(`/spendinglimit`, data),

  // ** Delete limit
  deleteLimit: async (data: any) => axiosClient.delete(`/spendinglimit/${data}`)
}

export default limitSpendingService
