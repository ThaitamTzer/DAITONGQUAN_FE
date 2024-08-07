import {
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { useRankStore } from 'src/store/rank'
import DialogWithCustomCloseButton from '../components/dialog/customDialog'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { getCreateRankValidationSchema } from 'src/configs/validationSchema'
import VisuallyHiddenInput from 'src/pages/components/upload'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'

interface EditRankForm {
  rankName: string
  attendanceScore: number
  numberOfComment: number
  numberOfBlog: number
  numberOfLike: number
  action: string[]
}

const EditRank = () => {
  const { t } = useTranslation()
  const openEditModal = useRankStore(state => state.openEditModal)
  const onCloseModal = useRankStore(state => state.handleCloseEditModal)
  const editRank = useRankStore(state => state.handleEditRank)
  const rank = useRankStore(state => state.rank)
  const selectedRank = useRankStore(state => state.selectedRank)
  const loading = useRankStore(state => state.loading)
  const setLoading = useRankStore(state => state.setloading)
  const [previewImage, setPreviewImage] = useState<string>(rank.rankIcon)
  const [image, setImage] = useState<File | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isValid }
  } = useForm<EditRankForm>({
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

  useEffect(() => {
    if (selectedRank) {
      reset({
        rankName: rank.rankName,
        attendanceScore: rank.score?.attendanceScore,
        numberOfComment: rank.score?.numberOfComment,
        numberOfBlog: rank.score?.numberOfBlog,
        numberOfLike: rank.score?.numberOfLike
      })
      setPreviewImage(rank.rankIcon)
    }
  }, [selectedRank, rank, reset])

  console.log(rank)

  const handleClose = () => {
    onCloseModal()
    reset({
      rankName: '',
      attendanceScore: 0,
      numberOfComment: 0,
      numberOfBlog: 0,
      numberOfLike: 0,
      action: []
    })
    setPreviewImage('')
    setImage(null)
  }

  const onSubmit = (data: EditRankForm) => {
    const formData = new FormData()
    if (image) {
      formData.append('image', image)
    }
    formData.append('rankName', data.rankName)
    formData.append('attendanceScore', data.attendanceScore.toString())
    formData.append('numberOfComment', data.numberOfComment.toString())
    formData.append('numberOfBlog', data.numberOfBlog.toString())
    formData.append('numberOfLike', data.numberOfLike.toString())
    formData.append('action', data.action.toString())

    editRank(selectedRank, formData)
      .then(() => {
        handleClose()
        toast.success('Rank edit successfully')
      })
      .catch(error => {
        setError('rankName', { type: 'manual', message: 'Rank name existed' })
        setLoading(false)
      })
  }

  return (
    <Dialog
      open={openEditModal}
      onClose={onCloseModal}
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
          <Typography variant='h3'>Edit Rank</Typography>
        </DialogTitle>
        <DialogWithCustomCloseButton handleClose={onCloseModal}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name='rankName'
                control={control}
                rules={{ required: true }}
                defaultValue={rank.rankName}
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
                defaultValue={rank.score?.attendanceScore}
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
                name='numberOfBlog'
                control={control}
                rules={{ required: true }}
                defaultValue={rank.score?.numberOfBlog}
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
                defaultValue={rank.score?.numberOfLike}
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
            <Grid item xs={12}>
              <Controller
                name='numberOfComment'
                control={control}
                rules={{ required: true }}
                defaultValue={rank.score?.numberOfComment}
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
                name='action'
                control={control}
                rules={{ required: false }}
                defaultValue={rank.action?.map(action => {
                  return action
                })}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    size='small'
                    fullWidth
                    select
                    type='string'
                    label='Action'
                    variant='outlined'
                    SelectProps={{ multiple: true }}
                    value={Array.isArray(value) ? value : []}
                    onChange={onChange}
                    onBlur={onBlur}
                  >
                    <MenuItem value='story'>Story</MenuItem>
                  </TextField>
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
            Change
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditRank
