import axiosClient from 'src/lib/axios'
import { StatisticIncomeMonth } from 'src/types/statistic/income'

const incomeStatisticService = {
  // ** Get Statistic Income
  getStatisticIncome: async (
    filterBy: string,
    numberOfItem: number,
    cateId?: string
  ): Promise<StatisticIncomeMonth> => {
    let url = `/incomenote/statistics-income?filterBy=${filterBy}&numberOfItem=${numberOfItem}`
    if (cateId) {
      url += `&cateId=${cateId}`
    }

    return axiosClient.get(url)
  }
}

export default incomeStatisticService
