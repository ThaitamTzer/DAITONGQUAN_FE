import axiosClient from 'src/lib/axios'
import { INote, IncomeNoteTypes, NoteTypes } from 'src/types/apps/noteTypes'

const incomesNoteService = {
  // Create new incomes note
  createIncomesNote: async (data: INote) => axiosClient.post('/incomenote', data),

  // Get all incomes note
  getAllIncomesNote: async (): Promise<NoteTypes[]> => {
    const res: IncomeNoteTypes = await axiosClient.get('/incomenote')

    return res.incomeNotes
  },

  // Update incomes note
  updateIncomesNote: async (incomeNoteId: string, data: INote) => axiosClient.put(`incomenote/${incomeNoteId}`, data),

  // Delete incomes note
  deleteIncomesNote: async (data: string) => axiosClient.delete(`incomenote/${data}`),

  // Delete many incomes note
  deleteManyIncomeNote: async (data: { incomeNoteIds: string[] }) =>
    axiosClient.delete(`/incomenote/deleteMany`, { data }),

  // Get incomes by category
  getIncomesByCategory: async (data: string) => axiosClient.get(`/incomenote/get-by-cate/${data}`),

  // Get incomes by date range
  getIncomesByDateRange: async (data: { startDate: string; endDate: string }) =>
    axiosClient.get(`/incomenote/filter-by-date`, { params: data })
}

export default incomesNoteService
