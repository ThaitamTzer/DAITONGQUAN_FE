import axiosClient from 'src/lib/axios'

const incomesNoteService = {
  // Create new incomes note
  createIncomesNote: async (data: any) => axiosClient.post('incomenote', data),

  // Get all incomes note
  getAllIncomesNote: async () => axiosClient.get('incomenote'),

  // Update incomes note
  updateIncomesNote: async (incomeNoteId: string, data: any) => axiosClient.put(`incomenote/${incomeNoteId}`, data),

  // Delete incomes note
  deleteIncomesNote: async (data: any) => axiosClient.delete(`incomenote/${data}`),

  // Get incomes by category
  getIncomesByCategory: async (data: string) => axiosClient.get(`/incomenote/get-by-cate/${data}`),

  // Get incomes by date range
  getIncomesByDateRange: async (data: { startDate: string; endDate: string }) =>
    axiosClient.get(`/incomenote/filter-by-date`, { params: data })
}

export default incomesNoteService
