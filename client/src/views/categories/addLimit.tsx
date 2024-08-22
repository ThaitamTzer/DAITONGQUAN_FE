import { Dialog, DialogTitle, TextField, DialogActions, Button, Typography } from '@mui/material'
import DialogWithCustomCloseButton from '../components/dialog/customDialog'
import { Controller, useForm } from 'react-hook-form'
import { useSpendLimitStore } from 'src/store/categories/limit.store'
import { LoadingButton } from '@mui/lab'
import { yupResolver } from '@hookform/resolvers/yup'
import { getCreateLimitSpendingValidationSchema } from 'src/configs/validationSchema'
import { useState } from 'react'

const AddLimitDialog = () => {
  const [formattedValue, setFormattedValue] = useState<string>('')
  const {
    data: spendCategory,
    loading,
    openAddSpendLimitModal,
    handleCloseAddSpendLimitModal,
    handleAddSpendLimit
  } = useSpendLimitStore()

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '')
    const floatValue = parseFloat(numericValue)
    if (isNaN(floatValue)) {
      return ''
    }

    return floatValue.toLocaleString('vn-VN', {
      style: 'currency',
      currency: 'vnd',
      minimumFractionDigits: 0
    })
  }

  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    const numericValue = inputValue.replace(/[^0-9.]/g, '')
    const formatted = formatCurrency(inputValue) // Format the value

    // Set the formatted value in the TextField
    setFormattedValue(formatted)

    // Update the form state with the numeric value
    setValue('budget', parseFloat(numericValue))
  }

  interface FormData {
    budget: number | null
  }

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors } // Add isDirty to track form changes
  } = useForm<FormData>({
    resolver: yupResolver(getCreateLimitSpendingValidationSchema()),
    mode: 'onBlur' // Validate on every change
  })

  const onClose = () => {
    handleCloseAddSpendLimitModal()
    reset({
      budget: null
    })
    setFormattedValue('')
  }

  const onSubmit = async (data: FormData) => {
    if (!spendCategory?._id) return

    await handleAddSpendLimit({ ...data, spendingCateId: spendCategory._id })
    onClose()
  }

  return (
    <Dialog
      open={openAddSpendLimitModal}
      scroll='body'
      maxWidth='sm'
      fullWidth
      onClose={onClose}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <form autoCapitalize='off' onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Typography variant='h4'>Add limit</Typography>
          <Typography variant='subtitle1'>Set a limit for {spendCategory?.name} category</Typography>
        </DialogTitle>
        <DialogWithCustomCloseButton handleClose={onClose}>
          <Controller
            name='budget'
            rules={{ required: true }}
            control={control}
            defaultValue={spendCategory?.budget}
            render={({ field }) => (
              <TextField
                value={formattedValue}
                onChange={handleBudgetChange}
                onBlur={field.onBlur}
                autoFocus
                fullWidth
                size='small'
                type='text'
                label='Budget'
                error={Boolean(errors.budget)}
                helperText={errors.budget ? errors.budget.message : ''}
              />
            )}
          />
        </DialogWithCustomCloseButton>
        <DialogActions>
          <Button onClick={onClose} color='error'>
            Cancel
          </Button>
          <LoadingButton type='submit' loading={loading} variant='contained'>
            Save
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddLimitDialog
