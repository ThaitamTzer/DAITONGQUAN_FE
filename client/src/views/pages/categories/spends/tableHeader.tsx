import React from 'react'
import { Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import SpendCategoryList from './spendCategoryList'

const TableHeader = () => {
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <Button onClick={() => handleOpen()} variant='text'>
        See more {'>>>'}
      </Button>
      <Dialog open={open} fullWidth maxWidth={'md'} onClose={() => handleClose()}>
        <DialogTitle>
          <Typography variant='h3'>List of category</Typography>
        </DialogTitle>
        <DialogContent>
          <SpendCategoryList />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TableHeader
