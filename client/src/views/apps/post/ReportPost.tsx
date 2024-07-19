import { Button, Dialog, DialogTitle, Grid, MenuItem, TextField } from '@mui/material'
import { useReportStore } from 'src/store/apps/posts/report'
import DialogWithCustomCloseButton from 'src/views/components/dialog/customDialog'
import { Controller, useForm } from 'react-hook-form'
import { getCreateReportPostValidationSchema } from 'src/configs/validationSchema'
import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'

const ReportPost = () => {
  const openReportModal = useReportStore(state => state.openReportModal)
  const postId = useReportStore(state => state.postId)
  const handleCloseReportModal = useReportStore(state => state.handleCloseReportModal)
  const submitReportPost = useReportStore(state => state.handleReportPost)
  const { t } = useTranslation()

  interface FormData {
    reportType: string
    reportContent: string
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(getCreateReportPostValidationSchema(t))
  })

  const onSubmit = (data: FormData) => {
    toast.promise(submitReportPost(postId, data.reportType, data.reportContent), {
      loading: 'Reporting...',
      success: 'Reported successfully',
      error: 'Report failed'
    })
    handleCloseReportModal()
    reset()
  }

  return (
    <Dialog
      open={openReportModal}
      onClose={handleCloseReportModal}
      fullWidth
      maxWidth='sm'
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible'
        }
      }}
    >
      <DialogTitle variant='h4'>
        Report Post <Icon icon='fxemoji:loudspeaker' />
      </DialogTitle>
      <DialogWithCustomCloseButton handleClose={handleCloseReportModal}>
        <form autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name='reportType'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    size='small'
                    select
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    label='Report Type'
                    error={Boolean(errors.reportType)}
                    {...(errors.reportType && {
                      helperText: errors.reportType.message
                    })}
                  >
                    <MenuItem value='spam'>Spam</MenuItem>
                    <MenuItem value='harassment'>Harassment</MenuItem>
                    <MenuItem value='violence'>Violence</MenuItem>
                    <MenuItem value='hate'>Hate</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='reportContent'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    label='Report Content'
                    error={Boolean(errors.reportContent)}
                    {...(errors.reportContent && {
                      helperText: errors.reportContent.message
                    })}
                  />
                )}
              />
            </Grid>
            <Grid container item xs={12} spacing={3} justifyContent={'right'}>
              <Grid item xs={3}>
                <Button id='ButtonSubmit' fullWidth variant='tonal' onClick={handleCloseReportModal}>
                  Cancel
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  disabled={!isValid}
                  type='submit'
                  id='ButtonCancel'
                  fullWidth
                  variant='contained'
                  color='primary'
                >
                  Report
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogWithCustomCloseButton>
    </Dialog>
  )
}

export default ReportPost
