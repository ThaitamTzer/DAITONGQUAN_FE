import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Switch
} from '@mui/material'
import { Dispatch, useState, useEffect } from 'react'

import DialogWithCustomCloseButton from 'src/views/components/dialog/customDialog'

import { Controller, useForm } from 'react-hook-form'
import CustomTextField from 'src/@core/components/mui/text-field'

import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { subDays } from 'date-fns'
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

type UpdateDebt = {
  dispatch: Dispatch<any>
  updateDebt: (debt: AddDebt) => void
  encryptDebt: (id: string) => void
  decryptDebt: (id: string) => void
  selectedDebt: AddDebt
}

const UpdateDebt = (props: UpdateDebt) => {
  const { dispatch, updateDebt, selectedDebt, decryptDebt, encryptDebt } = props
  const [openAddDebtDialog, setOpenAddDebtDialog] = useState(false)

  const handleOpenAddDebtDialog = () => {
    setOpenAddDebtDialog(true)
    setValue('creditor', selectedDebt.creditor)
    setValues(selectedDebt)
    setInitialEncrypted(selectedDebt.isEncrypted)
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
    dueDate: new Date(),
    isEncrypted: false
  }

  const [values, setValues] = useState<AddDebtInterFace>(defaultAddDebt)
  const [initialEncrypted, setInitialEncrypted] = useState<boolean | undefined>(false)

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

  const onSubmit = (data: { creditor: string; description?: string }) => {
    const modifiedDebt = {
      ...values,
      creditor: data.creditor,
      description: values.description,
      status: 'active'
    }

    dispatch(updateDebt(modifiedDebt))

    if (values.isEncrypted !== initialEncrypted) {
      if (values.isEncrypted) {
        dispatch(encryptDebt(selectedDebt._id as string))
      } else {
        dispatch(decryptDebt(selectedDebt._id as string))
      }
    }

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
            <DialogTitle>Update Debt</DialogTitle>
            <DialogWithCustomCloseButton handleClose={handleCloseAddDebtDialog}>
              <Grid container spacing={3}>
                <Grid item md={12} sm={12} xs={12}>
                  <Controller
                    name='creditor'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomTextField required fullWidth label='Creditor' value={value} onChange={onChange} />
                    )}
                  />{' '}
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <CustomTextField
                    fullWidth
                    required
                    label='Debtor'
                    value={values.debtor}
                    onChange={e => setValues({ ...values, debtor: e.target.value })}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <CustomTextField
                    type='number'
                    fullWidth
                    required
                    label='Amount'
                    value={values.amount}
                    onChange={e => setValues({ ...values, amount: Number(e.target.value) })}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
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
                <Grid item md={12} sm={12} xs={12}>
                  <CustomTextField
                    multiline
                    rows={3}
                    fullWidth
                    label='Description'
                    value={values.description}
                    onChange={e => setValues({ ...values, description: e.target.value })}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <FormControl sx={{ mb: 4 }}>
                    <FormControlLabel
                      label='Encrypt'
                      control={
                        <Switch
                          checked={values.isEncrypted}
                          onChange={e => setValues({ ...values, isEncrypted: e.target.checked })}
                        />
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </DialogWithCustomCloseButton>
            <DialogActions>
              <Button variant='outlined' onClick={() => handleCloseAddDebtDialog()}>
                Cancel
              </Button>
              <Button type='submit' variant='contained'>
                Update
              </Button>
            </DialogActions>
          </form>
        </DatePickerWrapper>
      </Dialog>
    </>
  )
}

export default UpdateDebt
