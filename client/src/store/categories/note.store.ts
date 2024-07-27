import { create } from 'zustand'
import spendNoteService from 'src/service/spendNote.service'
import incomesNoteService from 'src/service/incomesNote.service'
import { INote, SpendNoteTypes, NoteTypes } from 'src/types/apps/noteTypes'
import { CategoryType } from 'src/types/apps/categoryTypes'
import { mutate } from 'swr'
import toast from 'react-hot-toast'

type SpendNoteState = {
  data: NoteTypes[]
  note: NoteTypes
  category: CategoryType
  openAddSpendNoteModal: boolean
  openUpdateSpendNoteModal: boolean
}

type SpendNoteActions = {
  handleOpenAddSpendNoteModal: (category: CategoryType) => void
  handleCloseAddSpendNoteModal: () => void
  handleOpenUpdateSpendNoteModal: (note: NoteTypes) => void
  handleCloseUpdateSpendNoteModal: () => void
  handleAddSpendNote: (data: INote, swr: string) => Promise<void>
  handleUpdateSpendNote: (data: INote, swr: string) => Promise<void>
  handleAddIncomeNote: (data: INote, swr: string) => Promise<void>
  handleUpdateIncomeNote: (id: string, data: INote, swr: string) => Promise<void>
}

type SpendNoteStore = SpendNoteState & SpendNoteActions

export const useSpendNoteStore = create<SpendNoteStore>(set => ({
  data: [],
  note: {} as NoteTypes,
  category: {} as CategoryType,
  openAddSpendNoteModal: false,
  openUpdateSpendNoteModal: false,
  handleOpenAddSpendNoteModal: category => set({ openAddSpendNoteModal: true, category }),
  handleCloseAddSpendNoteModal: () => set({ openAddSpendNoteModal: false }),
  handleOpenUpdateSpendNoteModal: note => set({ openUpdateSpendNoteModal: true, note }),
  handleCloseUpdateSpendNoteModal: () => set({ openUpdateSpendNoteModal: false }),
  handleAddSpendNote: async (data, swr) => {
    toast.promise(spendNoteService.createSpendNote(data), {
      loading: 'Adding note...',
      success: () => {
        mutate(swr)

        return 'Add note successfully'
      },
      error: 'Add note failed'
    })
    mutate(swr)
  },
  handleUpdateSpendNote: async (data, swr) => {
    toast.promise(spendNoteService.updateSpendNote(data), {
      loading: 'Updating note...',
      success: 'Update note successfully',
      error: 'Update note failed'
    })
    mutate(swr)
  },
  handleAddIncomeNote: async (data, swr) => {
    toast.promise(incomesNoteService.createIncomesNote(data), {
      loading: 'Adding note...',
      success: () => {
        mutate(swr)

        return 'Add note successfully'
      },
      error: 'Add note failed'
    })
    mutate(swr)
  },
  handleUpdateIncomeNote: async (id, data, swr) => {
    toast.promise(incomesNoteService.updateIncomesNote(id, data), {
      loading: 'Updating note...',
      success: 'Update note successfully',
      error: 'Update note failed'
    })
    mutate(swr)
  }
}))
