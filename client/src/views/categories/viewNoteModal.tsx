import { Button, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material'
import { NoteTypes } from 'src/types/apps/noteTypes'
import DialogWithCustomCloseButton from '../components/dialog/customDialog'

type ViewPostModalProps = {
  open: boolean
  onClose: () => void
  note: NoteTypes | undefined
  onSubmit: () => void
}

const ViewPostModal = (props: ViewPostModalProps) => {
  const { open, onClose, note, onSubmit } = props

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible'
        }
      }}
    >
      <DialogTitle>
        <Typography variant='h3'> Delete {note?.title}</Typography>
      </DialogTitle>
      <DialogWithCustomCloseButton handleClose={onClose}>
        <Typography variant='body1'>Are you sure you want to delete this note?</Typography>
      </DialogWithCustomCloseButton>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant='contained'
          color='error'
          onClick={() => {
            onSubmit()
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewPostModal
