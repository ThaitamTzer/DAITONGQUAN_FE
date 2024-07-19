import { Button, Dialog, DialogActions, DialogTitle, Typography } from '@mui/material'
import DialogWithCustomCloseButton from '../components/dialog/customDialog'
import { Box } from '@mui/system'

type DialogConfirmProps = {
  onSubmit?: any
  onClose?: () => void
  open?: boolean
  title?: string
}

export default function DialogConfirm(props: DialogConfirmProps) {
  const { onSubmit, onClose, open, title } = props

  return (
    <Dialog
      open={open !== undefined ? open : false}
      maxWidth='xs'
      onClose={onClose}
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible'
        }
      }}
    >
      <DialogTitle>
        <Typography variant='h4'>{title}</Typography>
      </DialogTitle>
      <DialogWithCustomCloseButton handleClose={onClose}></DialogWithCustomCloseButton>
      {onSubmit && (
        <DialogActions>
          <Box display={'flex'}>
            <Button sx={{ mr: 2 }} fullWidth variant='outlined' color='error' onClick={onClose}>
              No
            </Button>
            <Button fullWidth variant='contained' color='success' onClick={onSubmit}>
              Yes
            </Button>
          </Box>
        </DialogActions>
      )}
    </Dialog>
  )
}
