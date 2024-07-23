import axiosClient from 'src/lib/axios'
import { RankType, AddRankType } from 'src/types/rank/rankTypes'

const rankService = {
  // Get list rank
  getListRank: async (): Promise<RankType[]> => {
    const response: any = await axiosClient.get('/rank')

    return response
  },

  // Create rank
  createRank: async (formData: FormData) => {
    const response = await axiosClient.post('/rank', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response
  },

  // Update rank
  updateRank: async (id: string, data: FormData) => {
    const response = await axiosClient.put(`/rank/update/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response
  },

  // Delete rank
  deleteRank: async (id: string) => {
    const response = await axiosClient.delete(`/rank/${id}`)

    return response
  },

  // Get rank by id
  getRankById: async (id: string) => {
    const response = await axiosClient.get(`/rank/${id}`)

    return response.data
  }
}

export default rankService
