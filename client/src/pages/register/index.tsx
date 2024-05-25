// ** React Imports
import { useState, ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import { FormControl, FormHelperText } from '@mui/material'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

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

// import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Validation Schema
import { getRegisterValidationSchema, getValidationMessages } from 'src/configs/validationSchema'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '30rem' }
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

// **Styled Components
const CustomTextFieldStyled = styled(CustomTextField)(({ theme }) => ({
  marginBottom: theme.spacing(3)
}))

interface State {
  showPassword: boolean
  showComfirmPassword: boolean
}

interface FormData {
  firstname: string
  lastname: string
  email: string
  password: string
  comfirmPassword: string
  agree: boolean
  username: string
}

const Register = () => {
  // ** States
  const [values, setValues] = useState<State>({
    showPassword: false,
    showComfirmPassword: false
  })

  // ** Hook
  const theme = useTheme()
  const auth = useAuth()
  const { t } = useTranslation()
  const schema = getRegisterValidationSchema(t)
  const messages = getValidationMessages(t)

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    const { email, password, agree, username, firstname, lastname } = data
    if (!agree) {
      setError('agree', { message: messages.agreement.required })

      return
    }
    try {
      await auth.register({ email, password, username, firstname, lastname }, () => {
        setError('email', { message: messages.email.exists })
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
              <Grid container spacing={3}>
                <Grid item sm={6} xs={12}>
                  <Controller
                    name='firstname'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextFieldStyled
                        autoFocus
                        fullWidth
                        id='firstname'
                        label={t('Họ')}
                        placeholder='David Ngô Ngọc'
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={Boolean(errors.firstname)}
                        {...(errors.firstname && { helperText: errors.firstname.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Controller
                    name='lastname'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextFieldStyled
                        fullWidth
                        id='lastname'
                        label={t('Tên')}
                        placeholder='David Ngô Ngọc'
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        error={Boolean(errors.lastname)}
                        {...(errors.lastname && { helperText: errors.lastname.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Controller
                name='username'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextFieldStyled
                    fullWidth
                    id='username'
                    label={t('Tên tài khoản')}
                    placeholder='DavidNguyen222'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.username)}
                    {...(errors.username && { helperText: errors.username.message })}
                  />
                )}
              />
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextFieldStyled
                    fullWidth
                    type='email'
                    label='Email'
                    placeholder='john.doe@gmail.com'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
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
                  <CustomTextFieldStyled
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
                    helperText={t('Mật khẩu phải chứa số, chữ in hoa, ký tự đặc biệt')}
                    {...(errors.password && { helperText: errors.password.message })}
                  />
                )}
              />
              <Controller
                name='comfirmPassword'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextFieldStyled
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
              <Controller
                name='agree'
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControl error={Boolean(errors.agree)}>
                    <FormControlLabel
                      control={<Checkbox {...field} color={errors.agree ? 'error' : 'primary'} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <Typography sx={{ color: 'text.secondary' }}>{t('Tôi đồng ý với ')}</Typography>
                          <Typography component={LinkStyled} href='/' onClick={e => e.preventDefault()} sx={{ ml: 1 }}>
                            {t('điều khoản và dịch vụ')}
                          </Typography>
                        </Box>
                      }
                    />
                    {errors.agree && <FormHelperText>{errors.agree.message}</FormHelperText>}
                  </FormControl>
                )}
              />

              {/* </Grid> */}

              {/* <Grid item xs={12}> */}
              <Button fullWidth type='submit' disabled={!isValid} variant='contained' sx={{ mb: 4 }}>
                {t('Đăng ký')}
              </Button>
              {/* </Grid> */}
              {/* <Grid item xs={12}> */}
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>{t('Đã có tài khoản?')}</Typography>
                <Typography component={LinkStyled} href='/login' sx={{ fontSize: theme.typography.body1.fontSize }}>
                  {t('Đăng nhập')}
                </Typography>
              </Box>
              {/* </Grid> */}
              {/* </Grid> */}
            </form>
          </CardContent>
        </Card>
      </>
    </Box>
  )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register
