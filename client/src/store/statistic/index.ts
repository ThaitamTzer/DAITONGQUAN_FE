import { create } from 'zustand'
import { mutate } from 'swr'

type StatisticState = {
  filter: string
  number: number
  cateId: string | undefined
}

type StatisticActions = {
  setFilter: (filter: string) => void
  setNumber: (number: number) => void
  setCateId: (cateId: string | undefined) => void
}

type StatisticStore = StatisticState & StatisticActions

export const useStatisticStore = create<StatisticStore>(set => ({
  filter: 'month',
  number: 12,
  cateId: undefined,
  setFilter: filter => {
    set(() => ({ filter }))
    mutate('GET_STATISTIC_SPEND')
    mutate('GET_STATISTIC_INCOME')
  },
  setNumber: number => set(() => ({ number })),
  setCateId: cateId => set(() => ({ cateId }))
}))
