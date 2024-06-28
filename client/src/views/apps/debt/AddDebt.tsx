import { Button, Dialog, DialogActions, DialogTitle, Grid, MenuItem } from '@mui/material'
import { Dispatch, useState } from 'react'

import DialogWithCustomCloseButton from 'src/views/components/dialog/customDialog'

import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'

import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { subDays } from 'date-fns'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

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

type AddDebtTypes = {
  dispatch: Dispatch<any>
  addDebt: (debt: AddDebt) => void
  type: string
}

const AddDebt = (props: AddDebtTypes) => {
  const { dispatch, addDebt, type } = props
  const [openAddDebtDialog, setOpenAddDebtDialog] = useState(false)

  const handleOpenAddDebtDialog = () => setOpenAddDebtDialog(true)

  interface AddDebtInterFace {
    debtor: string
    creditor: string
    amount: number | null
    type: string
    description: string
    status: string
    dueDate: Date | string
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
      type: type,
      status: 'active'
    }

    dispatch(addDebt(modifiedDebt))
    handleCloseAddDebtDialog()
  }

  return (
    <>
      <Button onClick={() => handleOpenAddDebtDialog()} variant='contained'>
        Add Debt
      </Button>
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
                <Grid item md={12}>
                  <Controller
                    name='creditor'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField fullWidth label='Creditor' value={value} onChange={onChange} />
                    )}
                  />{' '}
                </Grid>
                <Grid item md={12}>
                  <CustomTextField
                    fullWidth
                    label='Debtor'
                    value={values.debtor}
                    onChange={e => setValues({ ...values, debtor: e.target.value })}
                  />
                </Grid>
                <Grid item md={12}>
                  <CustomTextField
                    type='number'
                    fullWidth
                    label='Amount'
                    value={values.amount}
                    onChange={e => setValues({ ...values, amount: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item md={12}>
                  <DatePicker
                    id='min-date'
                    showYearDropdown
                    selected={values.dueDate as DateType}
                    minDate={subDays(new Date(), 0)}
                    onChange={(date: Date) => setValues({ ...values, dueDate: date })}
                    customInput={<CustomTextField fullWidth label='Due Date' />}
                  />
                </Grid>
                <Grid item md={12}>
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

export default AddDebt
