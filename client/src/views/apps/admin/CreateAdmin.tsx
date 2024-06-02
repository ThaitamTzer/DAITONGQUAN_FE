import { Button, Dialog } from '@mui/material'
import { useState } from 'react'

import { useTranslation } from 'react-i18next'

const CreateAdminForm = () => {
  const [openForm, setOpenForm] = useState<Boolean>(false)

  const { t } = useTranslation()


  return (
    <>
      <Button variant='contained'>{t('Thêm Admin')}</Button>
      <Dialog></Dialog>
    </>
  )
}

export default CreateAdminForm
