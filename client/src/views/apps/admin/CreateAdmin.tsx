// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Import Third Party
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { getCreateAdminValidationSchema } from 'src/configs/validationSchema'
import masterAdminService from 'src/service/masterAdmin.service'
import toast from 'react-hot-toast'
import useSWR, { mutate } from 'swr'

const CreateAdmin = () => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)

  // ** Translation
  const { t } = useTranslation()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    reset({
      email: '',
      fullname: '',
      password: '',
      comfirmPassword: '',
      roleId: []
    })
  }

  const schema = getCreateAdminValidationSchema(t)

  interface FormData {
    email: string
    fullname: string
    password: string
    comfirmPassword: string
    roleId: []
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    const { email, fullname, password, roleId } = data
    try {
      await masterAdminService.createAdmin({ email, fullname, password, roleId })
      toast.success(t('Thêm Admin thành công'))
      handleClose()
      mutate('GET_ALL_ADMINS')
    } catch (error) {
      toast.error(t('Thêm Admin thất bại'))
    }
  }

  const { data: roles } = useSWR('GET_ALL_ROLES', masterAdminService.getAllRole)

  return (
    <Fragment>
      <Button variant='contained' onClick={handleClickOpen}>
        {t('Thêm Admin')}
      </Button>
      <Dialog fullWidth open={open} onClose={handleClose}>
        <form autoComplete='off' noValidate onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id='form-dialog-title'>
            <Typography variant='h2'>{t('Thêm Admin')}</Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={6}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      type='email'
                      label='Email'
                      placeholder='admin@gmail.com'
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={Boolean(errors.email)}
                      {...(errors.email && { helperText: errors.email.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <Controller
                  name='fullname'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label={t('Tên Admin')}
                      placeholder='Nguyễn Văn A'
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={Boolean(errors.fullname)}
                      {...(errors.fullname && { helperText: errors.fullname.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      id='password'
                      label={t('Mật khẩu')}
                      fullWidth
                      type='password'
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={Boolean(errors.password)}
                      {...(errors.password && { helperText: errors.password.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <Controller
                  name='comfirmPassword'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      id='comfirmPassword'
                      label={t('Xác nhận mật khẩu')}
                      fullWidth
                      type='password'
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      error={Boolean(errors.comfirmPassword)}
                      {...(errors.comfirmPassword && { helperText: errors.comfirmPassword.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={12}>
                <Controller
                  name='roleId'
                  control={control}
                  rules={{ required: true }}
                  defaultValue={[]}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      id='roleId'
                      select
                      label={t('Vai trò')}
                      value={value}
                      onChange={event => {
                        onChange(event.target.value)
                      }}
                      onBlur={onBlur}
                      SelectProps={{ multiple: true }}
                      error={Boolean(errors.roleId)}
                      {...(errors.roleId && { helperText: errors.roleId.message })}
                    >
                      {roles?.data.map((role: any) => (
                        <MenuItem key={role._id} value={role._id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </CustomTextField>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button variant='outlined' onClick={handleClose}>
              {t('Hủy')}
            </Button>
            <Button type='submit' disabled={!isValid} variant='contained'>
              {t('Thêm')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  )
}

export default CreateAdmin
