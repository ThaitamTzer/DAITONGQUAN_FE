import useSWR from 'swr'
import categoriesService from 'src/service/categories.service'
import CategoryCard from 'src/views/categories/categoryCard'
import { Grid } from '@mui/material'
import AddCategory from 'src/views/categories/addCategory'
import EditCategory from 'src/views/categories/editCategory'
import DialogAlert from 'src/views/categories/dialogAlert'
import { useCategoryStore } from 'src/store/categories'
import { useSpendNoteStore } from 'src/store/categories/note.store'
import AddLimitDialog from 'src/views/categories/addLimit'
import EditLimitDialog from 'src/views/categories/editLimit'
import AddNote from 'src/views/categories/addNote'

const SpendPage = () => {
  const {
    data: spends,
    isLoading,
    error
  } = useSWR('GET_ALL_SPENDS', categoriesService.getSpendCategories, {
    revalidateOnFocus: false
  })
  const { openDeleteCategoryModal, handleCloseDeleteCategoryModal, handleDeleteCategory } = useCategoryStore()
  const { openAddSpendNoteModal, handleCloseAddSpendNoteModal } = useSpendNoteStore()
  const categoryId = useCategoryStore(state => state.data?._id)
  const swr = 'GET_ALL_SPENDS'

  return (
    <Grid container spacing={3}>
      <AddCategory type='spend' swr={swr} />
      <CategoryCard data={spends} />
      <EditCategory type='spend' swr={swr} />
      <DialogAlert
        title='Delete Category'
        content='Are you sure you want to delete this category?'
        open={openDeleteCategoryModal}
        handleClose={handleCloseDeleteCategoryModal}
        handleSubmit={() => handleDeleteCategory(categoryId, swr)}
      />
      <AddLimitDialog />
      <EditLimitDialog />
      <AddNote open={openAddSpendNoteModal} handleClose={handleCloseAddSpendNoteModal} swr={swr} />
    </Grid>
  )
}

SpendPage.acl = {
  action: 'read',
  subject: 'member-page'
}
export default SpendPage
