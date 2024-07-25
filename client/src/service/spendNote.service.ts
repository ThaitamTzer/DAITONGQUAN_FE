import axiosClient from 'src/lib/axios'
import { INote, SpendNoteTypes, NoteTypes } from 'src/types/apps/noteTypes'

const spendNoteService = {
  // ** Get All Spend Note
  getAllSpendNote: async (): Promise<NoteTypes[]> => {
    const res: SpendNoteTypes = await axiosClient.get('/spendingnote')

    return res.spendingNotes
  },

  // ** Create Spend Note
  createSpendNote: async (data: INote) => axiosClient.post('/spendingnote', data),

  // ** Update Spend Note
  updateSpendNote: async (data: INote) => axiosClient.put('/spendingnote', data),

  // ** Delete Spend Note
  deleteSpendNote: async (data: string) => axiosClient.delete(`/spendingnote/${data}`),

  // ** Delete Many Spend Note
  deleteManySpendNote: async (data: { spendingNoteId: string[] }) =>
    axiosClient.delete(`spendingnote/deleteMany`, { data }),

  // ** Force Delete Spend Note
  forceDeleteSpendNote: async (data: string) => axiosClient.delete(`/spendingnote/delete-all-by-cate/${data}`),

  // ** Search Spend Note
  searchSpendNote: async (data: string) => axiosClient.get(`/spendingnote/search/?${data}`),

  // ** Get Spend Note By Category
  getSpendNoteByCategory: async (cateId: string) => axiosClient.get(`/spendingnote/get-by-cate/${cateId}`),

  // ** Get Spend Note By Range Date
  getSpendNoteByRangeDate: async (data: { startDate: string; endDate: string }): Promise<NoteTypes[]> =>
    axiosClient.get(`/spendingnote/filter-by-date`, { params: data }),

  // Get Notification Out Of Money
  getNotificationOutOfMoney: async (): Promise<any> => axiosClient.get(`/spendingnote/notify-out-of-money`)
}

export default spendNoteService
