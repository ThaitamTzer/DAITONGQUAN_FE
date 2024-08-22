import { create } from 'zustand'
import spendNoteService from 'src/service/spendNote.service'
import incomesNoteService from 'src/service/incomesNote.service'
import { INote, SpendNoteTypes, NoteTypes, IncomeNoteType } from 'src/types/apps/noteTypes'
import { CategoryType } from 'src/types/apps/categoryTypes'
import { mutate } from 'swr'
import toast from 'react-hot-toast'
import { GridRowSelectionModel } from '@mui/x-data-grid'

type SpendNoteState = {
  data: NoteTypes[]
  note: NoteTypes
  incomeNote: IncomeNoteType
  category: CategoryType
  openAddSpendNoteModal: boolean
  openUpdateSpendNoteModal: boolean
  openDeleteSpendNoteModal: boolean
  openViewNoteModal: boolean
  rowSelectionModel: any
}

type SpendNoteActions = {
  handleOpenAddSpendNoteModal: (category: CategoryType) => void
  handleCloseAddSpendNoteModal: () => void
  handleOpenUpdateSpendNoteModal: (note: NoteTypes) => void
  handleOpenUpdeteIncomeNoteModal: (note: NoteTypes) => void
  handleCloseUpdateIncomeNoteModal: () => void
  handleCloseUpdateSpendNoteModal: () => void
  handleAddSpendNote: (data: INote, swr: string) => Promise<void>
  handleUpdateSpendNote: (id: string, data: INote, swr: string) => Promise<void>
  handleAddIncomeNote: (data: INote, swr: string) => Promise<void>
  handleUpdateIncomeNote: (id: string, data: INote, swr: string) => Promise<void>
  handleOpenDeleteSpendNoteModal: (note: NoteTypes) => void
  handleCloseDeleteSpendNoteModal: () => void
  handleDeleteSpendNote: (id: string, swr: string) => Promise<void>
  handleDeleteIncomeNote: (id: string, swr: string) => Promise<void>
  handleOpenViewNoteModal: (note: NoteTypes) => void
  handleCloseViewNoteModal: () => void
  setRowSelectionModel: (data: any) => void
}

type SpendNoteStore = SpendNoteState & SpendNoteActions

export const useSpendNoteStore = create<SpendNoteStore>(set => ({
  data: [],
  note: {} as NoteTypes,
  incomeNote: {} as IncomeNoteType,
  category: {} as CategoryType,
  openAddSpendNoteModal: false,
  openUpdateSpendNoteModal: false,
  openDeleteSpendNoteModal: false,
  openViewNoteModal: false,
  rowSelectionModel: [],
  setRowSelectionModel: data => set({ rowSelectionModel: data }),
  handleOpenAddSpendNoteModal: category => set({ openAddSpendNoteModal: true, category }),
  handleCloseAddSpendNoteModal: () => set({ openAddSpendNoteModal: false }),
  handleOpenUpdateSpendNoteModal: note => set({ openUpdateSpendNoteModal: true, note }),
  handleCloseUpdateSpendNoteModal: () => set({ openUpdateSpendNoteModal: false }),
  handleOpenUpdeteIncomeNoteModal: note => set({ openUpdateSpendNoteModal: true, note }),
  handleCloseUpdateIncomeNoteModal: () => set({ openUpdateSpendNoteModal: false }),
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
  handleUpdateSpendNote: async (id, data, swr) => {
    toast.promise(
      spendNoteService.updateSpendNote({
        ...data,
        spendingNoteId: id
      }),
      {
        loading: 'Updating note...',
        success: () => {
          mutate(swr)

          return 'Update note successfully'
        },
        error: 'Update note failed'
      }
    )
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
      success: () => {
        mutate(swr)

        return 'Update note successfully'
      },
      error: 'Update note failed'
    })
    mutate(swr)
  },
  handleOpenDeleteSpendNoteModal: note => set({ openDeleteSpendNoteModal: true, note }),
  handleCloseDeleteSpendNoteModal: () => set({ openDeleteSpendNoteModal: false }),
  handleDeleteSpendNote: async (id, swr) => {
    toast.promise(spendNoteService.deleteSpendNote(id), {
      loading: 'Deleting note...',
      success: () => {
        mutate(swr)

        return 'Delete note successfully'
      },
      error: 'Delete note failed'
    })
    mutate(swr)
  },
  handleDeleteIncomeNote: async (id, swr) => {
    toast.promise(incomesNoteService.deleteIncomesNote(id), {
      loading: 'Deleting note...',
      success: () => {
        mutate(swr)

        return 'Delete note successfully'
      },
      error: 'Delete note failed'
    })
    mutate(swr)
  },
  handleOpenViewNoteModal: note => set({ openViewNoteModal: true, note }),
  handleCloseViewNoteModal: () => set({ openViewNoteModal: false, note: {} as NoteTypes })
}))
