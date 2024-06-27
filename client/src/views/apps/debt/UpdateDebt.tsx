import { Button, Dialog, DialogActions, DialogTitle, Grid, IconButton, MenuItem } from '@mui/material'
import { Dispatch, useState } from 'react'

import DialogWithCustomCloseButton from 'src/views/components/dialog/customDialog'

import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'

import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { subDays } from 'date-fns'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
import Icon from 'src/@core/components/icon'

type AddDebt = {
  debtor: string
  creditor: string
  amount: number | null
  type: string
  description: string
  status: string
  dueDate: Date | string
  isEncrypted?: boolean
  _id?: string
}

type AddDebtType = {
  debts: AddDebt[]
}

type UpdateDebt = {
  store: AddDebtType
  dispatch: Dispatch<any>
  updateDebt: (debt: AddDebt) => void
  LendId: string
}

const UpdateDabt = (props: UpdateDebt) => {
  const { store, dispatch, updateDebt, LendId } = props
  const [openAddDebtDialog, setOpenAddDebtDialog] = useState(false)

  const handleOpenAddDebtDialog = () => {
    if (store.debts.length > 0) {
      const debt = store.debts.find(debt => debt._id === LendId)
      if (debt) {
        setValue('creditor', debt.creditor)
        setValues({ ...debt, description: debt.description || '' })
      }

      setOpenAddDebtDialog(true)
    }
  }

  interface AddDebtInterFace {
    debtor: string
    creditor: string
    amount: number | null
    type: string
    description: string
    status: string
    dueDate: Date | string
    isEncrypted?: boolean
    _id?: string
  }

  const defaultAddDebt: AddDebtInterFace = {
    debtor: '',
    creditor: '',
    amount: null,
    type: '',
    description: '',
    status: '',
    dueDate: new Date()
  }

  const [values, setValues] = useState<AddDebtInterFace>(defaultAddDebt)

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors }
  } = useForm({ defaultValues: { creditor: '' } })

  const handleCloseAddDebtDialog = () => {
    setOpenAddDebtDialog(false)
    reset(defaultAddDebt)
    setValues(defaultAddDebt)
    clearErrors()
  }

  const onSubmit = (data: { creditor: string }) => {
    const modifiedDebt = {
      ...values,
      creditor: data.creditor,
      status: 'active'
    }

    dispatch(updateDebt(modifiedDebt))
    handleCloseAddDebtDialog()
  }

  return (
    <>
      <IconButton onClick={() => handleOpenAddDebtDialog()}>
        <Icon icon='tabler:edit' />
      </IconButton>
      <Dialog
        fullWidth
        maxWidth='sm'
        open={openAddDebtDialog}
        onClose={() => handleCloseAddDebtDialog}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DatePickerWrapper>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>Add Debt</DialogTitle>
            <DialogWithCustomCloseButton handleClose={handleCloseAddDebtDialog}>
              <Grid container spacing={3}>
                <Grid item md={12} sm={9}>
                  <Controller
                    name='creditor'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField fullWidth label='Creditor' value={value} onChange={onChange} />
                    )}
                  />{' '}
                </Grid>
                <Grid item md={12} sm={9}>
                  <CustomTextField
                    fullWidth
                    label='Debtor'
                    value={values.debtor}
                    onChange={e => setValues({ ...values, debtor: e.target.value })}
                  />
                </Grid>
                <Grid item md={12} sm={9}>
                  <CustomTextField
                    type='number'
                    fullWidth
                    label='Amount'
                    value={values.amount}
                    onChange={e => setValues({ ...values, amount: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item md={12} sm={9}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Type'
                    value={values.type}
                    onChange={e => setValues({ ...values, type: e.target.value as string })}
                  >
                    <MenuItem value='lending_debt'>Lend</MenuItem>
                    <MenuItem value='borrow_debt'>Borrow</MenuItem>
                  </CustomTextField>
                </Grid>
                <Grid item md={12} sm={9}>
                  <DatePicker
                    id='min-date'
                    showYearDropdown
                    dateFormat='dd/MM/yyyy' // Added dateFormat property
                    selected={values.dueDate instanceof Date ? values.dueDate : new Date(values.dueDate)}
                    minDate={subDays(new Date(), 0)}
                    onChange={(date: Date | null) => {
                      if (date) {
                        setValues({ ...values, dueDate: date })
                      } else {
                        // Handle invalid date selection, e.g., by setting to a default date
                        setValues({ ...values, dueDate: new Date() })
                      }
                    }}
                    customInput={<CustomTextField fullWidth label='Due Date' />}
                  />
                </Grid>
                <Grid item md={12} sm={9}>
                  <CustomTextField
                    multiline
                    rows={3}
                    fullWidth
                    label='Description'
                    value={values.description}
                    onChange={e => setValues({ ...values, description: e.target.value })}
                  />
                </Grid>
              </Grid>
            </DialogWithCustomCloseButton>
            <DialogActions>
              <Button variant='outlined' onClick={() => handleCloseAddDebtDialog()}>
                Cancel
              </Button>
              <Button type='submit' variant='contained'>
                Add
              </Button>
            </DialogActions>
          </form>
        </DatePickerWrapper>
      </Dialog>
    </>
  )
}

export default UpdateDabt
