export type ItemInMonth = {
  title: string
  amount: number
  category: string
  incomeDate: string | Date
}

export type StatisticMonth = {
  totalAmount: 266254
  items: ItemInMonth[]
}

export type StatisticIncomeMonth = {
  start: string | Date
  end: string | Date
  highestAmount: number
  totalAmount: number
  groupedIncomeDetails: {
    [key: string]: StatisticMonth
  }
}
