import React from 'react'
import { Button, Dialog, DialogActions, DialogTitle, IconButton } from '@mui/material'
import spendNoteService from 'src/service/spendNote.service'
import { LoadingButton } from '@mui/lab'
import toast from 'react-hot-toast'
import { mutate } from 'swr'

const DeleteManyNotesDialog = ({ rowSelectionModel, data }: any) => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setLoading(false)
  }

  const handleDeleteManyNotes = async () => {
    if (rowSelectionModel.length === 0) return
    setLoading(true)

    try {
      await spendNoteService.deleteManySpendNote({ spendingNoteId: rowSelectionModel })
      setOpen(false)
      setLoading(false)
      toast.success('Notes deleted successfully')
      mutate('GET_ALL_NOTIFICATIONS')
      mutate('GET_ALL_SPENDNOTES')
      mutate('GET_SPENDNOTE_BY_RANGE_DATE')
    } catch (error: any) {
      toast.error(error.response.data.message)
      setLoading(false)
      mutate('GET_ALL_NOTIFICATIONS')
    }
  }

  const totalNotes = data?.length
  console.log(totalNotes)

  return (
    <>
      <Button variant='contained' onClick={() => handleOpen()} disabled={rowSelectionModel.length === 0} color='error'>
        Delete Seleted
      </Button>
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
