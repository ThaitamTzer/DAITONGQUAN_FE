import TableNote from 'src/views/categories'
import useSWR from 'swr'
import incomesNoteService from 'src/service/incomesNote.service'
import categoriesService from 'src/service/categories.service'
import ViewNoteModal from 'src/views/categories/viewNoteModal'
import { useSpendNoteStore } from 'src/store/categories/note.store'
import UpdateNoteModal from 'src/views/categories/updateNotes'
import ViewNote from 'src/views/categories/viewNote'

const IncomeNotesPage = () => {
  const {
    openDeleteSpendNoteModal,
    handleCloseDeleteSpendNoteModal,
    note,
    handleDeleteIncomeNote,
    handleCloseUpdateIncomeNoteModal,
    openUpdateSpendNoteModal,
    handleUpdateIncomeNote
  } = useSpendNoteStore(state => state)
  const {
    data: notes,
    isLoading,
    error
  } = useSWR('GET_ALL_INCOME_NOTES', incomesNoteService.getAllIncomesNote, {
    revalidateOnFocus: false
  })
  const { data: incomesCate } = useSWR('GET_ALL_INCOMES', categoriesService.getIncomeCategories, {
    revalidateOnFocus: false
  })

  const { data: categories } = useSWR('GET_ALL_INCOME_CATEGORIES', categoriesService.getIncomeCategories, {
    revalidateOnFocus: false
  })

  return (
    <>
      <TableNote title='List of Income Notes' data={notes || undefined} catedata={categories} />
      <ViewNoteModal
        open={openDeleteSpendNoteModal}
        onClose={handleCloseDeleteSpendNoteModal}
        note={note}
        onSubmit={() => handleDeleteIncomeNote(note._id, 'GET_ALL_INCOME_NOTES')}
      />
      <UpdateNoteModal
        open={openUpdateSpendNoteModal}
        onClose={handleCloseUpdateIncomeNoteModal}
        note={note}
        submit={handleUpdateIncomeNote}
        swr='GET_ALL_INCOME_NOTES'
        category={incomesCate}
      />
      <ViewNote category={incomesCate} />
    </>
  )
}

IncomeNotesPage.acl = {
  action: 'read',
  subject: 'member-page'
}

export default IncomeNotesPage
