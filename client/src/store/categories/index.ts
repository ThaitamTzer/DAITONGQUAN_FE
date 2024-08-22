import { create } from 'zustand'
import { CategoryType } from 'src/types/apps/categoryTypes'
import categoryService from 'src/service/categories.service'
import { mutate } from 'swr'
import toast from 'react-hot-toast'

type CategoryState = {
  data: CategoryType | undefined
  openAddCategoryModal: boolean
  openUpdateCategoryModal: boolean
  openDeleteCategoryModal: boolean
}

type CategoryActions = {
  handleOpenAddCategoryModal: () => void
  handleCloseAddCategoryModal: () => void
  handleOpenUpdateCategoryModal: (data: CategoryType) => void
  handleCloseUpdateCategoryModal: () => void
  handleAddCategory: (data: any, swr: string) => Promise<void>
  handleUpdateCategory: (data: any, swr: string) => Promise<void>
  handleOpenDeleteCategoryModal: (data: CategoryType) => void
  handleCloseDeleteCategoryModal: () => void
  handleDeleteCategory: (_id: string | undefined, swr: string) => Promise<void>
}

type CategoryStore = CategoryState & CategoryActions

export const useCategoryStore = create<CategoryStore>(set => ({
  data: {} as CategoryType,
  openAddCategoryModal: false,
  openUpdateCategoryModal: false,
  openDeleteCategoryModal: false,
  handleOpenDeleteCategoryModal: (data: CategoryType) => {
    set({ data })
    set({ openDeleteCategoryModal: true })
  },
  handleCloseDeleteCategoryModal: () => set({ openDeleteCategoryModal: false }),
  handleOpenAddCategoryModal: () => set({ openAddCategoryModal: true }),
  handleCloseAddCategoryModal: () => set({ openAddCategoryModal: false }),
  handleOpenUpdateCategoryModal: (data: CategoryType) => {
    set({ data })
    set({ openUpdateCategoryModal: true })
  },
  handleCloseUpdateCategoryModal: () => set({ openUpdateCategoryModal: false, data: {} as CategoryType }),
  handleAddCategory: async (data, swr) => {
    toast.promise(categoryService.createCategory(data), {
      loading: 'Creating category...',
      success: () => {
        mutate(swr)

        return 'Category created successfully'
      },
      error: 'Error creating category'
    })
  },
  handleUpdateCategory: async (data, swr) => {
    toast.promise(categoryService.updateCategory(data), {
      loading: 'Updating category...',
      success: () => {
        mutate(swr)

        return 'Category updated successfully'
      },
      error: 'Error updating category'
    })
  },
  handleDeleteCategory: async (_id, swr) => {
    useCategoryStore.setState({ openDeleteCategoryModal: false })
    toast.promise(categoryService.deleteCategory(_id), {
      loading: 'Deleting category...',
      success: () => {
        mutate(swr)

        return 'Category deleted successfully'
      },
      error: (error: any) => {
        return error.response.data.message || 'Error deleting category'
      }
    })
  }
}))
