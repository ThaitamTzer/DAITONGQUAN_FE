import { create } from 'zustand'
import { mutate } from 'swr'
import statisticSpendService from 'src/service/statisticSpend.service'
import incomeStatisticService from 'src/service/statisticIncome.service'

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
    mutate('GET_STATISTIC_SPEND', () =>
      statisticSpendService.getStatisticSpend(filter, useStatisticStore.getState().number)
    )
    mutate('GET_STATISTIC_INCOME', () =>
      incomeStatisticService.getStatisticIncome(filter, useStatisticStore.getState().number)
    )
  },
  setNumber: number => {
    set(() => ({ number }))
    mutate('GET_STATISTIC_SPEND', () =>
      statisticSpendService.getStatisticSpend(useStatisticStore.getState().filter, number)
    )
    mutate('GET_STATISTIC_INCOME', () =>
      incomeStatisticService.getStatisticIncome(useStatisticStore.getState().filter, number)
    )
  },
  setCateId: cateId => {
    set(() => ({ cateId }))
    if (cateId !== 'All') {
      mutate('GET_STATISTIC_SPEND', () =>
        statisticSpendService.getStatisticSpend(
          useStatisticStore.getState().filter,
          useStatisticStore.getState().number,
          cateId
        )
      )
      mutate('GET_STATISTIC_INCOME', () =>
        incomeStatisticService.getStatisticIncome(
          useStatisticStore.getState().filter,
          useStatisticStore.getState().number,
          cateId
        )
      )
    } else {
      mutate('GET_STATISTIC_SPEND', () =>
        statisticSpendService.getStatisticSpend(
          useStatisticStore.getState().filter,
          useStatisticStore.getState().number
        )
      )
      mutate('GET_STATISTIC_INCOME', () =>
        incomeStatisticService.getStatisticIncome(
          useStatisticStore.getState().filter,
          useStatisticStore.getState().number
        )
      )
    }
  }
}))
