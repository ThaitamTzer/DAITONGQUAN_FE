import { LoadingButton } from '@mui/lab'
import { Dialog, DialogTitle, Typography, DialogContent, TextField, DialogActions, Button } from '@mui/material'
import React from 'react'

const ActionLimitDialog = ({
  open,
  onClose,
  spendCategory,
  onSubmit,
  loading,
  value,
  handleDeleteLimit
}: {
  open: boolean
  onClose: () => void
  spendCategory: any
  onSubmit: (budget: number) => void
  loading: boolean
  value: number
  handleDeleteLimit: () => void
}) => {
  const [numericValue, setNumericValue] = React.useState<number>(value)

  React.useEffect(() => {
    setNumericValue(value)
  }, [value])

  const formatCurrency = (value: number) => {
    return `đ ${new Intl.NumberFormat('vi-VN').format(value)}`
  }

  const displayValue = React.useMemo(() => {
    return formatCurrency(numericValue)
  }, [numericValue])

  const handleInputChange = (event: any) => {
    const input = event.target.value.replace(/[^\d]/g, '') // Remove all non-numeric characters
    setNumericValue(Number(input)) // Update the actual form value
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant='h3'>
        Actions Limit
        <Typography>Set a limit for {spendCategory.name}</Typography>
      </DialogTitle>
      <form
        onSubmit={event => {
          event.preventDefault()
          onSubmit(numericValue)
        }}
      >
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            label='Budget'
            variant='outlined'
            value={displayValue}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <LoadingButton type='submit' loading={loading} variant='contained' color='primary'>
            Update
          </LoadingButton>
          <LoadingButton variant='contained' loading={loading} color='error' onClick={handleDeleteLimit}>
            Delete Limit
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ActionLimitDialog
