import { create } from 'zustand'
import { mutate } from 'swr'
import rankService from 'src/service/rank.service'
import { RankType } from 'src/types/rank/rankTypes'
import toast from 'react-hot-toast'

type RankStates = {
  openAddModal: boolean
  openEditModal: boolean
  loading: boolean
  anchorEl: HTMLElement | null
  selectedRank: string
  rank: RankType
}

type RankActions = {
  handleOpenAddModal: () => void
  handleCloseAddModal: () => void
  handleOpenEditModal: (_id: string, rank: RankType) => void
  handleCloseEditModal: () => void
  handleAddRank: (data: FormData) => Promise<void>
  handleEditRank: (_id: string, data: FormData) => Promise<void>
  handleOpenOptionMenu: (id: string, event: React.MouseEvent<HTMLElement>) => void
  handleCloseOptionMenu: () => void
  handleDeleteRank: (id: string) => void
  setloading: (loading: boolean) => void
}

type RankStore = RankStates & RankActions

export const useRankStore = create<RankStore>(set => ({
  openAddModal: false,
  openEditModal: false,
  loading: false,
  anchorEl: null,
  selectedRank: '',
  rank: {} as RankType,
  setloading: loading => set({ loading }),
  handleOpenAddModal: () => set({ openAddModal: true }),
  handleCloseAddModal: () => set({ openAddModal: false }),
  handleOpenEditModal: (_id, rank) => {
    set({ openEditModal: true, anchorEl: null, selectedRank: _id, rank })
  },
  handleCloseEditModal: () => set({ openEditModal: false, rank: {} as RankType, selectedRank: '' }),
  handleAddRank: async (formData: FormData) => {
    set({ loading: true })
    await rankService.createRank(formData)
    mutate('GetListRank')
    set({ loading: false })
  },
  handleEditRank: async (_id, formData) => {
    set({ loading: true })
    await rankService.updateRank(_id, formData)
    mutate('GetListRank')
    set({ loading: false })
  },
  handleDeleteRank: async id => {
    set({ anchorEl: null })
    toast.promise(rankService.deleteRank(id), {
      loading: 'Deleting...',
      success: () => {
        mutate('GetListRank')

        return 'Delete successfully'
      },
      error: 'Delete failed'
    })
  },
  handleOpenOptionMenu: (id, event) => set({ anchorEl: event.currentTarget, selectedRank: id }),
  handleCloseOptionMenu: () => set({ anchorEl: null, selectedRank: '' })
}))
