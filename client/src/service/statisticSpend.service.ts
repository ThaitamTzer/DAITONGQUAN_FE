import axiosClient from 'src/lib/axios'
import { StatisticSpendMonth } from 'src/types/statistic/spend'

const statisticSpendService = {
  // ** Get Statistic Spend
  getStatisticSpend: async (
    filterBy: string,
    numberOfItem: number,
    cateId?: string
  ): Promise<StatisticSpendMonth[]> => {
    let url = `/spendingnote/statistic-spending?filterBy=${filterBy}&numberOfItem=${numberOfItem}`
    if (cateId) {
      url += `&cateId=${cateId}`
    }

    return axiosClient.get(url)
  }
}

export default statisticSpendService
