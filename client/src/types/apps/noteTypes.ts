export interface INote {
  cateId: string
  title: string
  content: string
  spendingDate: Date
  paymentMethod: string
  amount: number
  spendingNoteId?: string
}

export type NoteTypes = {
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

export type SpendNoteTypes = {
  spendingNotes: NoteTypes[]
}
