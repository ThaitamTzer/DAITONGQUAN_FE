// ** React Imports
import { useState, ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Import Third Party
import { useTranslation } from 'react-i18next'
import ReactDatePicker from 'react-datepicker'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

interface State {
  password: string
  showPassword: boolean
  showComfirmPassword: boolean
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '40rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import { useAuth } from 'src/hooks/useAuth'

interface FormData {
  email: string
  password: string
  comfirmPassword: string
  fullName: string
  dateOfBirth: Date
  address: string
  agree: boolean
}

const schema = yup.object().shape({
  email: yup.string().email().required().max(100),
  password: yup.string().min(5).max(50).required(),
  comfirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required(),
  fullName: yup.string().required().max(50),
  dateOfBirth: yup.date().required().max(new Date(), 'Date of Birth cannot be in the future'),
  address: yup.string().required().max(100),
  agree: yup.boolean().oneOf([true], 'You must agree to the privacy policy & terms')
})

const RegisterV1 = () => {
  // ** States
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false,
    showComfirmPassword: false
  })

  // ** Hook
  const theme = useTheme()
  const auth = useAuth()

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    const { email, password, fullName, dateOfBirth, address, agree } = data
    if (!agree) {
      setError('agree', { message: 'You must agree to the privacy policy & terms' })

      return
    }
    if (dateOfBirth > new Date()) {
      setError('dateOfBirth', { message: 'Date of Birth cannot be in the future' })

      return
    }
    try {
      await auth.register({ email, password, fullName, dateOfBirth, address }, () => {
        setError('email', { message: 'Email already exists' })
      })
    } catch (error) {
      setError('email', { message: 'Something went wrong' })
    }
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }
  const handleClickShowComfirmPassword = () => {
    setValues({ ...values, showComfirmPassword: !values.showComfirmPassword })
  }

  const { t } = useTranslation()

  return (
    <Box className='content-center'>
      <>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }} className='hehe'>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* <svg width={34} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  fill={theme.palette.primary.main}
                  d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
                />
                <path
                  fill='#161616'
                  opacity={0.06}
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
                />
                <path
                  fill='#161616'
                  opacity={0.06}
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  fill={theme.palette.primary.main}
                  d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
                />
              </svg> */}
              <Typography variant='h3' sx={{ ml: 2.5, fontWeight: 700 }}>
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant='h4' sx={{ mb: 1.5 }}>
                {t('Đăng ký tại đây')} 🚀
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} justifyContent='center' alignItems='center'>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='fullName'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        autoFocus
                        fullWidth
                        id='fullName'
                        sx={{ mb: 4 }}
                        label={t('Họ và tên')}
                        placeholder='John Doe'
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={Boolean(errors.fullName)}
                        {...(errors.fullName && { helperText: errors.fullName.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='email'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        type='email'
                        label='Email'
                        sx={{ mb: 4 }}
                        placeholder='john.doe@gmail.com'
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={Boolean(errors.email)}
                        {...(errors.email && { helperText: errors.email.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label={t('Mật khẩu')}
                        value={value}
                        placeholder='············'
                        id='auth-register-password'
                        onChange={onChange}
                        onBlur={onBlur}
                        type={values.showPassword ? 'text' : 'password'}
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
                        error={Boolean(errors.password)}
                        {...(errors.password && { helperText: errors.password.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='comfirmPassword'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label={t('Xác nhận mật khẩu')}
                        type={values.showComfirmPassword ? 'text' : 'password'}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onClick={handleClickShowComfirmPassword}
                                onMouseDown={e => e.preventDefault()}
                                aria-label='toggle password visibility'
                              >
                                <Icon
                                  fontSize='1.25rem'
                                  icon={values.showComfirmPassword ? 'tabler:eye' : 'tabler:eye-off'}
                                />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                        error={Boolean(errors.comfirmPassword)}
                        {...(errors.comfirmPassword && { helperText: errors.comfirmPassword.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    name='dateOfBirth'
                    rules={{ required: true }}
                    render={({ field: { value, onBlur, onChange } }) => (
                      <DatePickerWrapper>
                        <ReactDatePicker
                          selected={value}
                          onBlur={onBlur}
                          id='basic-input'
                          customInput={
                            <CustomTextField
                              fullWidth
                              label='Ngày tháng năm sinh'
                              error={Boolean(errors.dateOfBirth)}
                              {...(errors.dateOfBirth && { helperText: errors.dateOfBirth.message })}
                            />
                          }
                          popperPlacement='bottom-start'
                          onChange={onChange} // Add this line
                        />
                      </DatePickerWrapper>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='address'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={Boolean(errors.address)}
                        {...(errors.address && { helperText: errors.address.message })}
                        fullWidth
                        label={t('Địa chỉ')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name='agree'
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} color={errors.agree ? 'error' : 'primary'} />}
                        label={
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}
                          >
                            <Typography sx={{ color: 'text.secondary' }}>I agree to </Typography>
                            <Typography
                              component={LinkStyled}
                              href='/'
                              onClick={e => e.preventDefault()}
                              sx={{ ml: 1 }}
                            >
                              privacy policy & terms
                            </Typography>
                          </Box>
                        }
                      />
                    )}
                  />
                  {errors.agree && (
                    <Typography variant='caption' sx={{ color: 'error.main', mt: 1 }}>
                      {errors.agree.message}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                    Sign up
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Typography sx={{ color: 'text.secondary', mr: 2 }}>Already have an account?</Typography>
                    <Typography
                      component={LinkStyled}
                      href='/pages/auth/login-v1'
                      sx={{ fontSize: theme.typography.body1.fontSize }}
                    >
                      Sign in instead
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </>
    </Box>
  )
}

RegisterV1.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterV1
