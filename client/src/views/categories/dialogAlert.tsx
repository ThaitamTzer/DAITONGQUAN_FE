import { Button, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material'
import DialogWithCustomCloseButton from '../components/dialog/customDialog'

type DialogAlertProps = {
  open: boolean
  handleClose: () => void
  title: string
  content: string
  handleSubmit?: () => void
}
const DialogAlert = (props: DialogAlertProps) => {
  const { open, handleClose, title, content, handleSubmit } = props

  return (
    <Dialog
      fullWidth
      maxWidth='sm'
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root': {
          overflow: 'visible'
        }
      }}
    >
      <DialogTitle>
        <Typography variant='h2'>{title}</Typography>
      </DialogTitle>
      <DialogWithCustomCloseButton handleClose={handleClose}>{content}</DialogWithCustomCloseButton>
      {handleSubmit && (
        <DialogActions>
          <Button variant='outlined' onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant='contained'>
            OK
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default DialogAlert
