export interface INote {
  cateId: string
  title: string
  content: string
  date: Date
  method: string
  amount: number
  spendingNoteId?: string
}

export type NoteTypes = {
  _id: string
  cateId: string
  title: string
  content: string | null
  spendingDate?: Date
  incomeDate?: Date
  paymentMethod: string
  method?: string
  amount: number
  createdAt: Date
  updatedAt: Date
}

export type IncomeNoteType = {
  _id: string
  cateId: string
  title: string
  content: string | null
  incomeDate: Date
  paymentMethod: string
  amount: number
  createdAt: Date
  updatedAt: Date
}

export type SpendNoteTypes = {
  spendingNotes: NoteTypes[]
}

export type IncomeNoteTypes = {
  incomeNotes: IncomeNoteType[]
}
