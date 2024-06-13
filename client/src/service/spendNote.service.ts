import axiosClient from 'src/lib/axios'

export type SpendNote = {
  spendingNotes: {
    _id: string
    cateId: string
    title: string
    content: string | null
    spendingDate: Date
    paymentMethod: string
    amount: number
    createdAt: Date
    updatedAt: Date
  }
}

type CreateSpendNote = {
  cateId: string | null
  title: string
  content: string
  amount: number
  paymentMethod: string
  spendingDate: Date
}

type UpdateSpendNote = {
  spendingNoteId: string
  cateId: string
  title: string
  content: string | null
  spendingDate: Date
  paymentMethod: string
  amount: number
}

const spendNoteService = {
  // ** Get All Spend Note
  getAllSpendNote: async (): Promise<SpendNote> => axiosClient.get('/spendingnote'),

  // ** Create Spend Note
  createSpendNote: async (data: CreateSpendNote): Promise<CreateSpendNote> => axiosClient.post('/spendingnote', data),

  // ** Update Spend Note
  updateSpendNote: async (data: UpdateSpendNote): Promise<UpdateSpendNote> => axiosClient.put('/spendingnote', data),

  // ** Delete Spend Note
  deleteSpendNote: async (data: string) => axiosClient.delete(`/spendingnote/${data}`),

  // ** Delete Many Spend Note
  deleteManySpendNote: async (data: string[]) => axiosClient.delete(`spendingnote/deleteMany`, { data }),

  // ** Search Spend Note
  searchSpendNote: async (data: string) => axiosClient.get(`/spendingnote/search/?${data}`),

  // ** Get Spend Note By Category
  getSpendNoteByCategory: async (cateId: string) => axiosClient.get(`/spendingnote/get-by-cate/${cateId}`),

  // ** Get Spend Note By Date
  getSpendNoteByDate: async (date: string) => axiosClient.get(`/spendingnote/filter-by-date/${date}`),

  // Get Notification Out Of Money
  getNotificationOutOfMoney: async () => axiosClient.get(`/spendingnote/notify-out-of-money`)
}

export default spendNoteService
