import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  IconButtonProps,
  TextField,
  Typography
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import styled from '@emotion/styled'

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const LimitSpend = ({ spendCategory }: any) => {
  const [open, setOpen] = React.useState(false)
  const [cateId, setCateId] = React.useState<string | null>(null)

  const handleOpen = (id: string) => {
    setOpen(true)
    setCateId(id)
  }
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button onClick={() => handleOpen(spendCategory._id)} variant='text' sx={{ padding: '0 !important' }}>
        <Icon icon='tabler:plus' />
        <Typography variant='caption'>Add limit</Typography>
      </Button>
      <Dialog
        open={open}
        scroll='body'
        maxWidth='sm'
        onClose={handleClose}
        onBackdropClick={handleClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle align='center' marginBottom={3}>
          <Typography variant='h2'>Add limit</Typography>
          <Typography variant='caption'>Set a limit for this category</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <TextField fullWidth label='Budget' size='small' />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='error'>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleClose} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default LimitSpend
