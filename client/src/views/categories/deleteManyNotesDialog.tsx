import React from 'react'
import { Button, Dialog, DialogActions, DialogTitle, IconButton } from '@mui/material'
import spendNoteService from 'src/service/spendNote.service'
import { LoadingButton } from '@mui/lab'
import toast from 'react-hot-toast'
import { mutate } from 'swr'
import Icon from 'src/@core/components/icon'
import { useSpendNoteStore } from 'src/store/categories/note.store'

interface DeleteManyNotesDialogProps {
  rowSelectionModel: any
  data: any[]
  startDate: any
  endDate: any
  handleDeleteMany: () => Promise<void>
}

const DeleteManyNotesDialog: React.FC<DeleteManyNotesDialogProps> = ({
  data,
  startDate,
  endDate,
  handleDeleteMany
}) => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)
  const rowSelectionModel = useSpendNoteStore(state => state.rowSelectionModel)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setLoading(false)
  }

  const handleDeleteManyNotes = async () => {
    if (rowSelectionModel.length === 0) return
    setLoading(true)

    try {
      await handleDeleteMany()
      setOpen(false)
      setLoading(false)
      toast.success('Notes deleted successfully')

      // Mutate data for notifications, all spend notes, and notes within the range date
      mutate('GET_ALL_NOTIFICATIONS')
      mutate('GET_ALL_SPEND_NOTES')
      mutate(['GET_SPENDNOTE_BY_RANGE_DATE', startDate, endDate])
    } catch (error: any) {
      toast.error(error.response.data.message)
      setLoading(false)
      mutate('GET_ALL_NOTIFICATIONS')
    }
  }

  const totalNotes = data?.length || 0

  return (
    <>
      {rowSelectionModel.length !== 0 && (
        <IconButton onClick={handleOpen} disabled={rowSelectionModel.length === 0} color='error'>
          <Icon icon='eva:trash-2-fill' />
        </IconButton>
      )}
      <Dialog open={open}>
        <DialogTitle variant='h3'>
          {rowSelectionModel.length === totalNotes ? 'Delete All Notes' : `Delete ${rowSelectionModel.length} Notes`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            variant='contained'
            type='submit'
            loading={loading}
            onClick={handleDeleteManyNotes}
            color='error'
            autoFocus
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteManyNotesDialog
