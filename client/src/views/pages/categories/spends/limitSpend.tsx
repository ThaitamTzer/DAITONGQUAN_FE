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
import limitSpendingService from 'src/service/limitSpending.service'
import toast from 'react-hot-toast'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getCreateLimitSpendingValidationSchema } from 'src/configs/validationSchema'
import { mutate } from 'swr'
import { LoadingButton } from '@mui/lab'

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: theme.palette.grey[500],
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

const LimitSpend = ({ spendCategory, openUpdateLimit, closeUpdateLimit, limitSpend }: any) => {
  const [open, setOpen] = React.useState(false)
  const [cateId, setCateId] = React.useState<string | null>(null)
  const [formattedValue, setFormattedValue] = React.useState<string>('')
  const [loading, setLoading] = React.useState(false)

  const handleOpen = (spendCategory: any) => {
    setOpen(true)
    setCateId(spendCategory._id)
  }
  const handleClose = () => {
    setOpen(false)
    reset()
    setFormattedValue('')
  }

  interface FormData {
    budget: number
  }

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid } // Add isDirty to track form changes
  } = useForm<FormData>({
    resolver: yupResolver(getCreateLimitSpendingValidationSchema()),
    mode: 'onBlur' // Validate on every change
  })

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

  const onSubmit = async (data: FormData) => {
    if (!cateId) return

    try {
      await limitSpendingService.createLimit({ spendingCateId: cateId, budget: data.budget })
      toast.success('Limit added successfully')
      handleClose()
      mutate('GET_ALL_SPENDS')
    } catch (error) {
      toast.error('Failed to add limit')
    }
  }

  return (
    <>
      <Button onClick={() => handleOpen(spendCategory)} variant='text' sx={{ padding: '0 !important' }}>
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            <Typography variant='h2'>Add limit</Typography>
            <Typography variant='caption'>Set a limit for {spendCategory.name} category</Typography>
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
            <Controller
              name='budget'
              rules={{ required: true }}
              control={control}
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color='error'>
              Cancel
            </Button>

            <LoadingButton type='submit' loading={loading} variant='contained' color='primary'>
              Save
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default LimitSpend
