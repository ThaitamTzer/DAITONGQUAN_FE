import { CategoryType } from 'src/types/apps/categoryTypes'
import { create } from 'zustand'
import limitSpendingService from 'src/service/limitSpending.service'
import toast from 'react-hot-toast'
import { mutate } from 'swr'

type SpendLimitState = {
  data: CategoryType | undefined
  loading: boolean
  openAddSpendLimitModal: boolean
  openUpdateSpendLimitModal: boolean
}

type SpendLimitActions = {
  handleOpenAddSpendLimitModal: (data: CategoryType) => void
  handleCloseAddSpendLimitModal: () => void
  handleOpenUpdateSpendLimitModal: (data: CategoryType) => void
  handleCloseUpdateSpendLimitModal: () => void
  handleAddSpendLimit: (data: any) => Promise<void>
  handleEditSpendLimit: (data: any) => Promise<void>
}

type SpendLimitStore = SpendLimitState & SpendLimitActions

export const useSpendLimitStore = create<SpendLimitStore>(set => ({
  data: {} as CategoryType,
  loading: false,
  openAddSpendLimitModal: false,
  openUpdateSpendLimitModal: false,
  handleOpenAddSpendLimitModal: data => set({ openAddSpendLimitModal: true, data }),
  handleCloseAddSpendLimitModal: () => set({ openAddSpendLimitModal: false }),
  handleOpenUpdateSpendLimitModal: data => set({ openUpdateSpendLimitModal: true, data }),
  handleCloseUpdateSpendLimitModal: () => set({ openUpdateSpendLimitModal: false }),
  handleAddSpendLimit: async data => {
    set({ loading: true })
    toast.promise(limitSpendingService.createLimit(data), {
      loading: 'Adding limit...',
      success: () => {
        mutate('GET_ALL_SPENDS')

        return 'Limit added successfully'
      },
      error: 'Failed to add limit'
    })
    set({ loading: false })
  },
  handleEditSpendLimit: async data => {
    set({ loading: true })
    toast.promise(limitSpendingService.updateLimit(data), {
      loading: 'Updating limit...',
      success: () => {
        mutate('GET_ALL_SPENDS')

        return 'Limit updated successfully'
      },
      error: 'Failed to update limit'
    })
    set({ loading: false })
  }
}))
