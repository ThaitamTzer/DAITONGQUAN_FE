import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  DialogActions,
  Button,
  InputAdornment,
  IconButton
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { RoleType, UpdateAdminsType, getUpdateAdmin } from 'src/types/apps/userTypes'
import { yupResolver } from '@hookform/resolvers/yup'

const UpdateAdminDialog = ({
  open,
  onClose,
  onConfirm,
  t,
  adminData,
  roleData,
  schema
}: {
  open: boolean
  onClose: () => void
  onConfirm: (data: UpdateAdminsType) => void
  t: (key: string) => string
  adminData: getUpdateAdmin | any
  roleData: RoleType[]
  schema: () => any
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<UpdateAdminsType>({
    mode: 'onBlur',
    resolver: yupResolver(schema())
  })

  const [values, setValues] = React.useState({ showPassword: false })

  const onSubmit = (data: UpdateAdminsType) => {
    console.log(data)
    onConfirm({
      ...data,
      id: adminData._id
    })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle align='center' variant='h3'>
        {t('Cập nhật Admin')}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='fullname'
            control={control}
            defaultValue={adminData.fullname}
            rules={{ required: true }}
            render={({ field: { value, onChange, onBlur } }) => (
              <CustomTextField
                fullWidth
                id='fullname'
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                margin='normal'
                label={t('Fullname')}
                error={!!errors.fullname}
                helperText={errors.fullname?.message}
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            rules={{ required: true }}
            defaultValue={adminData.email}
            render={({ field: { value, onChange, onBlur } }) => (
              <CustomTextField
                id='email'
                value={value}
                onChange={onChange}
                margin='normal'
                onBlur={onBlur}
                fullWidth
                label={t('Email')}
                error={Boolean(errors.email)}
                {...(errors.email && { helperText: errors.email.message })}
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange, onBlur } }) => (
              <CustomTextField
                fullWidth
                id='password'
                type={values.showPassword ? 'text' : 'password'}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                margin='normal'
                label={t('Password')}
                error={Boolean(errors.password)}
                {...(errors.password && { helperText: errors.password.message })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                        aria-label='toggle password visibility'
                      >
                        <Icon fontSize='1.25rem' icon={values.showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            )}
          />
          <Controller
            name='roleId'
            control={control}
            rules={{ required: true }}
            defaultValue={adminData.role ? adminData.role.map((r: { _id: any }) => r._id) : []}
            render={({ field: { value, onChange, onBlur } }) => (
              <CustomTextField
                id='roleId'
                select
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                fullWidth
                margin='normal'
                label={t('Role')}
                SelectProps={{ multiple: true }}
                error={Boolean(errors.roleId)}
                {...(errors.roleId && { helperText: errors.roleId.message })}
              >
                {roleData.map(role => (
                  <MenuItem key={role._id} value={role._id}>
                    {role.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />
          <DialogActions>
            <Button variant='outlined' onClick={onClose}>
              {t('Hủy')}
            </Button>
            <Button type='submit' disabled={!isValid} variant='contained' color='primary' autoFocus>
              {t('Cập nhật')}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateAdminDialog
