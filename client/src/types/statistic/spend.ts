export type ItemInMonth = {
  title: string
  cost: number
  category: string
  spendingDate: string | Date
}

export type StatisticMonth = {
  totalCost: 266254
  items: ItemInMonth[]
}

export type StatisticSpendMonth = {
  start: string | Date
  end: string | Date
  totalCosts: number
  groupedSpendingDetails: {
    [key: string]: StatisticMonth
  }
}
