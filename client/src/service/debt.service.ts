import axiosClient from 'src/lib/axios'

export type AddDebt = {
  debtor: string
  creditor: string
  amount: number | null
  type: string
  description: string
  status: string
  dueDate: Date | string
  isEncrypted?: boolean
  _id?: string
}

export type GetDebt = {
  _id: string
  debtor: string
  creditor: string
  amount: number
  type: string
  description: string
  status: string
  dueDate: Date | string
  createdAt: Date | string
  updatedAt: Date | string
  isEncrypted?: boolean
}

const DebtService = {
  // ** Create a new debt
  addDebt: (data: AddDebt) => axiosClient.post<GetDebt>('/debt', data),

  // ** Update a debt
  updateDebt: (_id: string, data: Partial<AddDebt>) => axiosClient.put<AddDebt>(`/debt/${_id}`, data),

  // ** Delete a debt
  deleteDebt: (_id: string) => axiosClient.delete<GetDebt>(`/debt/${_id}`),

  // ** Get all lend
  getLend: () => axiosClient.get<GetDebt[]>('/debt/lending'),

  // ** Get all borrow
  getBorrow: () => axiosClient.get<GetDebt[]>('/debt/borrowing'),

  // ** Notify a debt
  notifyDebt: (): Promise<any> => axiosClient.get<GetDebt>(`/debt/notify-due`),

  // ** Encrypt a debt
  encryptDebt: (_id: string) => axiosClient.put(`/debt/enable-encrypt/${_id}`),

  // ** Decrypt a debt
  decryptDebt: (_id: string) => axiosClient.put(`/debt/disable-encrypt/${_id}`)
}

export default DebtService
