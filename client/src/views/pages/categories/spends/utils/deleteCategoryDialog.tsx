import { LoadingButton } from '@mui/lab'
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@mui/material'
import { Toaster } from 'react-hot-toast'
import DialogWithCustomCloseButton from 'src/views/components/dialog/customDialog'

const DeleteCategoryDialog = ({ open, onClose, spendCategory, onSubmit, loading }: any) => {
  return (
    <Dialog sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }} open={open} onClose={onClose}>
      <Toaster position='top-right' toastOptions={{ className: 'react-hot-toast' }} />
      <DialogTitle>Delete Category</DialogTitle>
      <DialogWithCustomCloseButton handleClose={onClose}>
        <Typography>Are you sure you want to delete {spendCategory.name}?</Typography>
      </DialogWithCustomCloseButton>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton loading={loading} variant='contained' color='error' onClick={onSubmit}>
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export const ForceDeleteDialog = ({ open, onClose, spendCategory, onSubmit, loading }: any) => {
  return (
    <Dialog sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }} open={open} onClose={onClose}>
      <Toaster position='top-right' toastOptions={{ className: 'react-hot-toast' }} />
      <DialogTitle>This category already has a note</DialogTitle>
      <DialogWithCustomCloseButton handleClose={onClose}>
        <Typography>Are you sure you want to force delete {spendCategory.name}?</Typography>
      </DialogWithCustomCloseButton>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton loading={loading} variant='contained' color='error' onClick={onSubmit}>
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteCategoryDialog
