import { yupResolver } from '@hookform/resolvers/yup'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  IconButtonProps,
  Radio,
  RadioGroup,
  TextField
} from '@mui/material'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { getCreateSpendNoteValidationSchema } from 'src/configs/validationSchema'
import { useTranslation } from 'react-i18next'
import spendNoteService from 'src/service/spendNote.service'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import { useFormatter } from 'next-intl'
import toast from 'react-hot-toast'
import styled from '@emotion/styled'
import { mutate } from 'swr'

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'white',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `red !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const AddSpendNote = ({ spendCate }: any) => {
  const [open, setOpen] = React.useState(false)
  const [cateId, setCateId] = React.useState<string | null>(null)

  const { t } = useTranslation()
  const format = useFormatter()

  const handleOpen = (cateId: any) => {
    setOpen(true)
    setCateId(cateId)
  }

  const handleClose = () => {
    reset({
      title: '',
      amount: 0,
      content: '',
      paymentMethod: 'cash',
      spendingDate: new Date()
    })
    setOpen(false)
  }

  interface FormData {
    cateId: string
    title: string
    content: string
    amount: number
    paymentMethod: string
    spendingDate: Date
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(getCreateSpendNoteValidationSchema(t)),
    mode: 'onBlur'
  })

  const onSubmit = async (data: FormData) => {
    const spendNote = {
      ...data,
      content: data.content,
      cateId: cateId
    }
    try {
      await spendNoteService
        .createSpendNote(spendNote)
        .then(res => {
          mutate('GET_ALL_SPENDNOTES')
          if (res.warningMessage) {
            toast('Be careful, you are adding a note with a large amount of money', {
              icon: '⚠️',
              style: { backgroundColor: '#FFC1078A' }
            })
          } else {
            toast.success('Add Spend Note Successfully')
            mutate('GET_ALL_NOTIFICATIONS')
          }
          handleClose()
        })
        .catch(() => {
          toast.error('Add Spend Note Failed')
        })
    } catch (error) {
      toast.error('Add Spend Note Failed')
    }
  }

  return (
    <>
      <IconButton onClick={() => handleOpen(spendCate._id)}>
        <Icon icon='tabler:plus' />
      </IconButton>
      <Dialog
        fullWidth
        maxWidth='md'
        open={open}
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle variant='h3'>Add Spend Note For {spendCate.name}</DialogTitle>
        <DialogContent>
          <CustomCloseButton onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <form onSubmit={handleSubmit(onSubmit)}>
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
                  name='spendingDate'
                  control={control}
                  defaultValue={new Date()} // This sets the default value to the current date
                  render={({ field: { value, onChange } }) => (
                    <DatePickerWrapper>
                      <DatePicker
                        id='spendingDate'
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
                    name='paymentMethod'
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
    </>
  )
}

export default AddSpendNote
