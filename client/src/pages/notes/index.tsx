// import TableNote from 'src/views/categories'
// import { useSpendNoteStore } from 'src/store/categories/note.store'
// import useSWR from 'swr'
// import spendNoteService from 'src/service/spendNote.service'
// import categoriesService from 'src/service/categories.service'

// const SpendNotesPage = () => {
//   const {
//     data: notes,
//     isLoading,
//     error
//   } = useSWR('GET_ALL_NOTES', spendNoteService.getAllSpendNote, {
//     revalidateOnFocus: false
//   })

//   const { data: categories } = useSWR('GET_ALL_CATEGORIES', categoriesService.getAllCategories, {
//     revalidateOnFocus: false
//   })

//   return <TableNote data={notes || undefined} catedata={categories} />
// }
// SpendNotesPage.acl = {
//   action: 'read',
//   subject: 'member-page'
// }
// export default SpendNotesPage

import { GetStaticProps } from 'next/types'
import TableNote from 'src/views/categories'
import spendNoteService from 'src/service/spendNote.service'
import categoriesService from 'src/service/categories.service'
import { NoteTypes } from 'src/types/apps/noteTypes'
import { CategoryType } from 'src/types/apps/categoryTypes'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useContext } from 'react'

type SpendNotesPageProps = {
  notes: NoteTypes[] | undefined
  categories: CategoryType[] | undefined
}

const SpendNotesPage = ({ notes, categories }: SpendNotesPageProps) => {
  const ability = useContext(AbilityContext)

  if (ability.can('read', 'member-page')) {
    return <TableNote data={notes || undefined} catedata={categories} />
  }
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [notes, categories] = await Promise.all([
      spendNoteService.getAllSpendNote(),
      categoriesService.getAllCategories()
    ])

    return {
      props: {
        notes,
        categories
      }
    }
  } catch (error) {
    console.log('Error fetching data for SpendNotesPage:', error)

    return {
      notFound: true
    }
  }
}

SpendNotesPage.acl = {
  action: 'read',
  subject: 'member-page'
}

export default SpendNotesPage
