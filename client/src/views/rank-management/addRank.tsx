import {
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Alert
} from '@mui/material'
import { useRankStore } from 'src/store/rank'
import DialogWithCustomCloseButton from '../components/dialog/customDialog'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { getCreateRankValidationSchema } from 'src/configs/validationSchema'
import { VisuallyHiddenInput } from 'src/pages/components/upload'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'

const AddRank = () => {
  const { t } = useTranslation()
  const openAddModal = useRankStore(state => state.openAddModal)
  const handleClose = useRankStore(state => state.handleCloseAddModal)
  const addRank = useRankStore(state => state.handleAddRank)
  const loading = useRankStore(state => state.loading)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)

  interface AddRankForm {
    rankName: string
    attendanceScore: number
    numberOfComment: number
    numberOfBlog: number
    numberOfLike: number
    alert: string
  }

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid }
  } = useForm<AddRankForm>({
    resolver: yupResolver(getCreateRankValidationSchema(t)),
    mode: 'onBlur'
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)
      setImage(file)
      setPreviewImage(imageUrl)
    }
  }

  const onSubmit = (data: AddRankForm) => {
    if (image) {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('rankName', data.rankName)
      formData.append('attendanceScore', data.attendanceScore.toString())
      formData.append('numberOfComment', data.numberOfComment.toString())
      formData.append('numberOfBlog', data.numberOfBlog.toString())
      formData.append('numberOfLike', data.numberOfLike.toString())
      addRank(formData)
        .then(() => {
          handleClose()
          reset()
          toast.success('Rank added successfully')
        })
        .catch(error => {
          setError('rankName', { type: 'manual', message: error.message })
        })
    } else {
      setError('alert', { type: 'manual', message: 'Please upload rank icon' })
    }
  }

  return (
    <Dialog
      open={openAddModal}
      onClose={handleClose}
      fullWidth
      maxWidth='sm'
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible'
        }
      }}
    >
      <form autoCapitalize='off' onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Typography variant='h3'>Add Rank</Typography>
        </DialogTitle>
        {errors.alert && <Alert severity='error'>{errors.alert.message}</Alert>}
        <DialogWithCustomCloseButton handleClose={handleClose}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name='rankName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    size='small'
                    label='Rank Name'
                    variant='outlined'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.rankName)}
                    {...(errors.rankName && { helperText: String(errors.rankName.message) })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='attendanceScore'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    size='small'
                    fullWidth
                    type='number'
                    label='Attendance Score'
                    variant='outlined'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.attendanceScore)}
                    {...(errors.attendanceScore && { helperText: String(errors.attendanceScore.message) })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='numberOfComment'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    size='small'
                    fullWidth
                    type='number'
                    label='Number of Comment'
                    variant='outlined'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.numberOfComment)}
                    {...(errors.numberOfComment && { helperText: String(errors.numberOfComment.message) })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='numberOfBlog'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    size='small'
                    fullWidth
                    type='number'
                    label='Number of Blog'
                    variant='outlined'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.numberOfBlog)}
                    {...(errors.numberOfBlog && { helperText: String(errors.numberOfBlog.message) })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='numberOfLike'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    size='small'
                    fullWidth
                    type='number'
                    label='Number of Like'
                    variant='outlined'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.numberOfLike)}
                    {...(errors.numberOfLike && { helperText: String(errors.numberOfLike.message) })}
                  />
                )}
              />
            </Grid>
            {previewImage && (
              <Grid item xs={12}>
                <CardMedia
                  component='img'
                  image={previewImage}
                  alt='rank image'
                  loading='lazy'
                  sx={{ width: '30%', height: 'auto', objectFit: 'contain' }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Button>
                <VisuallyHiddenInput id='upload-image' type='file' accept='image/*' onChange={handleImageChange} />
                <label htmlFor='upload-image'>
                  <Button variant='contained' component='span'>
                    Upload Rank Icon
                  </Button>
                </label>
              </Button>
            </Grid>
          </Grid>
        </DialogWithCustomCloseButton>
        <DialogActions>
          <Button variant='outlined' onClick={handleClose} color='error'>
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            type='submit'
            disabled={!isValid && !previewImage}
            variant='contained'
            color='primary'
          >
            Add Rank
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddRank
