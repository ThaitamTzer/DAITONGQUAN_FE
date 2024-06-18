import React from 'react'
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'
import spendNoteService from 'src/service/spendNote.service'
import { LoadingButton } from '@mui/lab'
import toast from 'react-hot-toast'
import { mutate } from 'swr'

const DeleteManyNotesDialog = ({ rowSelectionModel }: any) => {
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
      mutate('GET_ALL_SPENDNOTES')
    } catch (error: any) {
      toast.error(error.response.data.message)
      setLoading(false)
    }
  }

  const totalNotes = rowSelectionModel.length

  return (
    <>
      <Button
        onClick={() => handleOpen()}
        disabled={rowSelectionModel.length === 0}
        variant='contained'
        color='error'
        sx={{ color: 'white' }}
      >
        Delete Selected
      </Button>
      <Dialog open={open}>
        <DialogTitle variant='h3'>
          {rowSelectionModel.length === totalNotes ? 'Delete All Notes' : `Delete ${rowSelectionModel.length} Notes`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton loading={loading} onClick={handleDeleteManyNotes} color='error'>
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteManyNotesDialog
