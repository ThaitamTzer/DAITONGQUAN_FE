import TableNote from 'src/views/categories'
import { useSpendNoteStore } from 'src/store/categories/note.store'
import useSWR from 'swr'
import spendNoteService from 'src/service/spendNote.service'
import categoriesService from 'src/service/categories.service'

const SpendNotesPage = () => {
  const {
    data: notes,
    isLoading,
    error
  } = useSWR('GET_ALL_NOTES', spendNoteService.getAllSpendNote, {
    revalidateOnFocus: false
  })

  const { data: categories } = useSWR('GET_ALL_CATEGORIES', categoriesService.getAllCategories, {
    revalidateOnFocus: false
  })

  return <TableNote data={notes || undefined} catedata={categories} />
}
SpendNotesPage.acl = {
  action: 'read',
  subject: 'member-page'
}
export default SpendNotesPage
