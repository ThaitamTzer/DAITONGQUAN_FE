import useSWR from 'swr'
import { CategoryType } from 'src/types/apps/categoryTypes'
import categoriesService from 'src/service/categories.service'
import CategoryCard from 'src/views/categories/categoryCard'
import { Grid } from '@mui/material'
import AddCategory from 'src/views/categories/addCategory'
import EditCategory from 'src/views/categories/editCategory'
import DialogAlert from 'src/views/categories/dialogAlert'
import { useCategoryStore } from 'src/store/categories'
import { useSpendLimitStore } from 'src/store/categories/limit.store'
import AddLimitDialog from 'src/views/categories/addLimit'
import EditLimitDialog from 'src/views/categories/editLimit'
import { useSpendNoteStore } from 'src/store/categories/note.store'
import AddNote from 'src/views/categories/addNote'

const IncomePage = () => {
  const {
    data: limits,
    isLoading,
    error
  } = useSWR('GET_ALL_INCOMES', categoriesService.getIncomeCategories, {
    revalidateOnFocus: false
  })
  const { openDeleteCategoryModal, handleCloseDeleteCategoryModal, handleDeleteCategory } = useCategoryStore()
  const { openAddSpendNoteModal, handleCloseAddSpendNoteModal } = useSpendNoteStore()
  const categoryId = useCategoryStore(state => state.data?._id)
  const swr = 'GET_ALL_INCOMES'

  return (
    <Grid container spacing={3}>
      <AddCategory type='income' swr={swr} />
      <CategoryCard data={limits} />
      <EditCategory type='income' swr={swr} />
      <DialogAlert
        title='Delete Category'
        content='Are you sure you want to delete this category?'
        open={openDeleteCategoryModal}
        handleClose={handleCloseDeleteCategoryModal}
        handleSubmit={() => handleDeleteCategory(categoryId, swr)}
      />
      <AddNote open={openAddSpendNoteModal} handleClose={handleCloseAddSpendNoteModal} swr={swr} />
    </Grid>
  )
}
IncomePage.acl = {
  action: 'read',
  subject: 'member-page'
}
export default IncomePage
