import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { getCreateSpendNoteValidationSchema } from 'src/configs/validationSchema'
import { useTranslation } from 'react-i18next'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import { useFormatter } from 'next-intl'
import toast from 'react-hot-toast'

import DialogWithCustomCloseButton from '../components/dialog/customDialog'
import { INote, NoteTypes } from 'src/types/apps/noteTypes'
import { CategoryType } from 'src/types/apps/categoryTypes'

type UpdateSpendNoteProps = {
  open: boolean
  onClose: () => void
  note: NoteTypes
  submit: (id: string, data: INote, swr: string) => Promise<any>
  swr: string
  category: CategoryType[] | undefined
}
interface FormData {
  spendingNoteId: string
  cateId: string
  title: string
  content: string
  date: Date
  method: string
  amount: number
}

const UpdateNoteModal = (props: UpdateSpendNoteProps) => {
  const { open, onClose, note, submit, swr, category } = props

  const { t } = useTranslation()
  const format = useFormatter()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(getCreateSpendNoteValidationSchema(t)),
    mode: 'onBlur'
  })

  useEffect(() => {
    reset({
      cateId: note.cateId,
      title: note.title,
      content: note.content || '',
      date: new Date(note.spendingDate || note.incomeDate || new Date()),
      method: note.paymentMethod || note.method,
      amount: note.amount
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note])

  const onSubmit = async (data: FormData) => {
    try {
      submit(
        note._id,
        {
          ...data
        },
        swr
      )
      onClose()
    } catch (error) {
      toast.error('Update note failed')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible'
        }
      }}
    >
      <DialogTitle>
        <Typography variant='h4'>Update Note</Typography>
      </DialogTitle>
      <DialogWithCustomCloseButton handleClose={onClose}>
        <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name='title'
                rules={{ required: true }}
                control={control}
                defaultValue={note.title}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    id='Title'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    fullWidth
                    label='Title'
                    required
                    error={Boolean(errors.title)}
                    {...(errors.title && { helperText: errors.title.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='amount'
                rules={{ required: true }}
                control={control}
                defaultValue={note.amount}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    id='amount'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    fullWidth
                    type='number'
                    label='Amount'
                    required
                    error={Boolean(errors.amount)}
                    {...(errors.amount && { helperText: errors.amount.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='date'
                control={control}
                defaultValue={
                  new Date(note.incomeDate || note.spendingDate || new Date()) // This sets the default value to the current date
                } // This sets the default value to the current date
                render={({ field: { value, onChange } }) => (
                  <DatePickerWrapper>
                    <DatePicker
                      id='incomeDate'
                      showYearDropdown
                      showMonthDropdown
                      selected={value}
                      placeholderText='YYYY-MM-DD'
                      dropdownMode='select'
                      customInput={
                        <TextField
                          size='medium'
                          label={t('Spend Note Date')}
                          fullWidth
                          value={value ? format.dateTime(value, { dateStyle: 'medium' }) : ''}
                          onChange={onChange}
                        />
                      }
                      dateFormat='dd-MM-yyyy'
                      onChange={onChange} // Update the onChange prop here
                    />
                  </DatePickerWrapper>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='cateId'
                control={control}
                defaultValue={note.cateId}
                render={({ field: { value, onChange } }) => (
                  <TextField id='cateId' fullWidth value={value} onChange={onChange} label='Category' select>
                    {category?.map(cate => (
                      <MenuItem key={cate._id} value={cate._id}>
                        {cate.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='method'
                control={control}
                defaultValue={note.paymentMethod || note.method}
                render={({ field: { value, onChange } }) => (
                  <FormControl>
                    <FormLabel>Payment Method</FormLabel>
                    <RadioGroup row value={value} name='paymentMethod' onChange={onChange}>
                      <FormControlLabel value='cash' control={<Radio />} label='Cash' />
                      <FormControlLabel value='banking' control={<Radio />} label='Banking' />
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='content'
                control={control}
                defaultValue={note.content || ''}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    id='content'
                    fullWidth
                    onChange={onChange}
                    value={value}
                    label='Content'
                    name='content'
                    variant='outlined'
                    multiline
                    rows={4}
                  />
                )}
              />
            </Grid>
            <Grid item container xs={12} spacing={3}>
              <Grid item xs={6}>
                <Button fullWidth variant='outlined' onClick={() => onClose()}>
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant='contained' color='primary' type='submit'>
                  Update Note
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogWithCustomCloseButton>
    </Dialog>
  )
}

export default UpdateNoteModal
