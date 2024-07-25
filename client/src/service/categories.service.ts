import axiosClient from 'src/lib/axios'
import { CategoryType } from 'src/types/apps/categoryTypes'

const categoriesService = {
  // Get all categories
  getAllCategories: async (): Promise<CategoryType[]> => axiosClient.get('/category'),

  // Create new category
  createCategory: async (data: any) => axiosClient.post('/category', data),

  // Update category
  updateCategory: async (data: any) => axiosClient.put(`/category`, data),

  // Delete category
  deleteCategory: async (data: any) => axiosClient.delete(`/category/${data}`),

  // Get income categories
  getIncomeCategories: async (): Promise<CategoryType[]> => axiosClient.get('/category/income'),

  // Get spend categories
  getSpendCategories: async (): Promise<CategoryType[]> => axiosClient.get('/category/spend')
}

export default categoriesService
