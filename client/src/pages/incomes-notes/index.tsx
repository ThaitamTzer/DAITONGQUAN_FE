import TableNote from 'src/views/categories'
import useSWR from 'swr'
import incomesNoteService from 'src/service/incomesNote.service'
import categoriesService from 'src/service/categories.service'

const IncomeNotesPage = () => {
  const {
    data: notes,
    isLoading,
    error
  } = useSWR('GET_ALL_NOTES', incomesNoteService.getAllIncomesNote, {
    revalidateOnFocus: false
  })

  const { data: categories } = useSWR('GET_ALL_INCOME_CATEGORIES', categoriesService.getIncomeCategories, {
    revalidateOnFocus: false
  })

  return <TableNote title='List of Income Notes' data={notes || undefined} catedata={categories} />
}

IncomeNotesPage.acl = {
  action: 'read',
  subject: 'member-page'
}

export default IncomeNotesPage
