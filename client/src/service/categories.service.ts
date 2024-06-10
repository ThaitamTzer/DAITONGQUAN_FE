import axiosClient from 'src/lib/axios'

import { CategoryCard } from 'src/types/user/categories'

const categoriesService = {
  // Get all categories
  getAllCategories: async () => axiosClient.get<CategoryCard[]>('/category'),

  // Get categories spend
  getCategoriesSpend: async () => axiosClient.get<CategoryCard[]>('/category/spend'),

  // Get categories income
  getCategoriesIncome: async () => axiosClient.get<CategoryCard[]>('/category/income'),

  // Create new category
  createCategory: async (data: any) => axiosClient.post('/category', data),

  // Update category
  updateCategory: async (data: any) => axiosClient.put(`/category`, data),

  // Delete category
  deleteCategory: async (data: any) => axiosClient.delete(`/category/${data}`),

  // Get income categories
  getIncomeCategories: async () => axiosClient.get('/category/income'),

  // Get spend categories
  getSpendCategories: async () => axiosClient.get('/category/spend')
}

export default categoriesService
