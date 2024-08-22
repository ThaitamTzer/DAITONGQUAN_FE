import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { t } from 'i18next'
import { Controller, useForm } from 'react-hook-form'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import { CustomCloseButton } from '../components/dialog/customDialog'
import { INote } from 'src/types/apps/noteTypes'
import { yupResolver } from '@hookform/resolvers/yup'
import { getCreateSpendNoteValidationSchema } from 'src/configs/validationSchema'
import { useFormatter } from 'next-intl'
import { useSpendNoteStore } from 'src/store/categories/note.store'

type AddNoteProps = {
  open: boolean
  handleClose: () => void
  handleAddNote: (data: INote, swr: string) => void
  swr: string
}

const AddNote = (props: AddNoteProps) => {
  const { open, handleClose, handleAddNote, swr } = props

  const { category } = useSpendNoteStore()
  const format = useFormatter()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<INote>({
    resolver: yupResolver(getCreateSpendNoteValidationSchema(t)),
    mode: 'onBlur'
  })

  const onClose = () => {
    handleClose()
    reset({
      title: '',
      amount: 0,
      date: new Date(),
      method: 'cash',
      content: '',
      cateId: ''
    })
  }

  const onSubmit = async (data: INote) => {
    try {
      onClose()
      handleAddNote(
        {
          ...data,
          cateId: category._id
        },
        swr
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      open={open}
      onClose={handleClose}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogTitle variant='h3'>Add Spend Note For {category.name}</DialogTitle>
      <DialogContent>
        <CustomCloseButton onClick={handleClose}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </CustomCloseButton>
        <form autoCapitalize='off' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name='title'
                rules={{ required: true }}
                control={control}
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
                defaultValue={new Date()} // This sets the default value to the current date
                render={({ field: { value, onChange } }) => (
                  <DatePickerWrapper>
                    <DatePicker
                      id='date'
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
                      onChange={onChange} // Add the onChange prop here
                    />
                  </DatePickerWrapper>
                )}
              />
              <Grid item xs={12}>
                <Controller
                  name='method'
                  control={control}
                  defaultValue='cash'
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
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='content'
                control={control}
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
            <Grid item xs={12}>
              <Button fullWidth variant='contained' color='primary' type='submit'>
                Add Note
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNote
