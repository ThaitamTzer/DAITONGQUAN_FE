import React from 'react'
import { Dialog, DialogContent, DialogTitle, Grid, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import CategorySpendCard from './categorySpendCard'

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
          <Grid container spacing={3}>
            <CategorySpendCard status='all' />
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TableHeader
