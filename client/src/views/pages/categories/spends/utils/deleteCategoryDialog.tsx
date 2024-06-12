import { LoadingButton } from '@mui/lab'
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@mui/material'

const DeleteCategoryDialog = ({ open, onClose, spendCategory, onSubmit, loading }: any) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Category</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete {spendCategory.name}?</Typography>
      </DialogContent>
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
