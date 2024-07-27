import useSWR from 'swr'
import { CategoryType } from 'src/types/apps/categoryTypes'
import categoriesService from 'src/service/categories.service'
import CategoryCard from 'src/views/categories/categoryCard'
import { Grid } from '@mui/material'
import AddCategory from 'src/views/categories/addCategory'
import EditCategory from 'src/views/categories/editCategory'
import DialogAlert from 'src/views/categories/dialogAlert'
import { useCategoryStore } from 'src/store/categories'
import { useSpendNoteStore } from 'src/store/categories/note.store'
import { CategoryCardSkeleton } from 'src/views/skeleton'
import AddNote from 'src/views/categories/addNote'
import Error500 from '../500'

const IncomePage = () => {
  const {
    data: limits,
    isLoading,
    error
  } = useSWR('GET_ALL_INCOMES', categoriesService.getIncomeCategories, {
    revalidateOnFocus: false
  })
  const { openDeleteCategoryModal, handleCloseDeleteCategoryModal, handleDeleteCategory } = useCategoryStore()
  const { openAddSpendNoteModal, handleCloseAddSpendNoteModal, handleAddIncomeNote } = useSpendNoteStore()
  const categoryId = useCategoryStore(state => state.data?._id)
  const swr = 'GET_ALL_INCOMES'

  if (error) return <Error500 />

  return (
    <Grid container spacing={3}>
      <AddCategory type='income' swr={swr} />
      {isLoading ? <CategoryCardSkeleton /> : <CategoryCard data={limits} />}
      <EditCategory type='income' swr={swr} />
      <DialogAlert
        title='Delete Category'
        content='Are you sure you want to delete this category?'
        open={openDeleteCategoryModal}
        handleClose={handleCloseDeleteCategoryModal}
        handleSubmit={() => handleDeleteCategory(categoryId, swr)}
      />
      <AddNote
        open={openAddSpendNoteModal}
        handleClose={handleCloseAddSpendNoteModal}
        handleAddNote={handleAddIncomeNote}
        swr={swr}
        method='method'
        dateNoteField='incomeDate'
      />
    </Grid>
  )
}
IncomePage.acl = {
  action: 'read',
  subject: 'member-page'
}
export default IncomePage
