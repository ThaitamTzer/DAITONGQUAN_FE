import { Ref, useState, forwardRef, ReactElement, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'
import { useFormatter } from 'next-intl'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getProfileValidationSchema } from 'src/configs/validationSchema'
import { addDays } from 'date-fns'
import useSWR, { mutate } from 'swr'
import addressService from 'src/service/address.service'
import userProfileService from 'src/service/userProfileService.service'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface FormData {
  firstname: string
  lastname: string
  gender: string
  email: string
  dateOfBirth: Date | undefined
  address: string
  nickname: string
  description: string
  phone: string
  province: string
  district: string
  ward: string
  streetName: string | ''
}

const UpdateUserProfile = () => {
  const [show, setShow] = useState<boolean>(false)
  const [provinceID, setProvinceID] = useState<number>()
  const [districtID, setDistrictID] = useState<number>()
  const [province, setProvince] = useState<string>('')
  const [district, setDistrict] = useState<string>('')
  const [ward, setWard] = useState<string>('')
  const [streetName, setStreetName] = useState<string>('')
  const auth = useAuth()
  const { setUser } = useAuth()
  const { t } = useTranslation()
  const schema = getProfileValidationSchema(t)
  const format = useFormatter()

  const { data: provinceData } = useSWR('GET_ALL_PROVINCE', addressService.getProvince, {
    revalidateOnFocus: false
  })

  const { data: districtData } = useSWR(
    provinceID ? ['GET_ALL_DISTRICT', provinceID] : null,
    ([, provinceId]) => addressService.getDistrict(provinceId),
    { revalidateOnFocus: false }
  )

  const { data: wardData } = useSWR(
    districtID ? ['GET_ALL_WARD', districtID] : null,
    ([, districtId]) => addressService.getWard(districtId),
    { revalidateOnFocus: false }
  )

  const handleDiscard = () => {
    setShow(false)
    reset({
      firstname: auth.user?.firstname || '',
      lastname: auth.user?.lastname || '',
      gender: auth.user?.gender || '',
      email: auth.user?.email || '',
      address: auth.user?.address || '',
      nickname: auth.user?.nickname || '',
      description: auth.user?.description || '',
      phone: auth.user?.phone || '',
      dateOfBirth: auth.user?.dateOfBirth ? new Date(auth.user?.dateOfBirth) : undefined
    })
    setProvince('')
    setDistrict('')
    setWard('')
    setStreetName('')
  }

  const handleDivideAddress = (address: string) => {
    if (address || '') {
      const currentAddress = address.split(', ')
      const reverseAddress = currentAddress.reverse()
      setProvince(reverseAddress[0])
      setDistrict(reverseAddress[1])
      setWard(reverseAddress[2])
      if (reverseAddress.length > 3) {
        setStreetName(reverseAddress[3])
      }
      const foundProvince = provinceData?.find((item: any) => item.province_name === reverseAddress[0])
      if (foundProvince) {
        setProvinceID(foundProvince.province_id)
        setTimeout(() => {
          const foundDistrict = districtData?.find((item: any) => item.district_name === reverseAddress[1])
          setTimeout(() => {
            if (foundDistrict) {
              setDistrictID(foundDistrict.district_id)
            }
          }, 500)
        }, 800)
      }
      setShow(true)
    }
    setShow(true)
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
    console.log('Form Data:', data)
    try {
      const updatedProfile = {
        ...data,
        address: `${data.streetName}, ${data.ward}, ${data.district}, ${data.province}`
      }
      await userProfileService.updateUserProfile(updatedProfile)

      // Updating the user context
      setUser({
        ...auth.user,
        ...updatedProfile
      })

      // Optionally, you can use mutate if you're using SWR to revalidate the data
      mutate('GET_USER_PROFILE')

      setShow(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Failed to update profile.')
    }
  }

  useEffect(() => {
    const defaultProvince = provinceData?.find((item: any) => item.name === province)
    if (defaultProvince) {
      setProvinceID(defaultProvince.idProvince)
    }
  }, [province, provinceData])

  useEffect(() => {
    const defaultDistrict = districtData?.find((item: any) => item.name === district)
    if (defaultDistrict) {
      setDistrictID(defaultDistrict.idDistrict)
    }
  }, [district, districtData])

  return (
    <Card>
      <Button variant='contained' onClick={() => handleDivideAddress(auth.user?.address || '')}>
        Update Profile
      </Button>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
            <Grid container direction='row' justifyContent='center' alignItems='baseline' spacing={6}>
              <Grid item sm={4} xs={12}>
                <Controller
                  control={control}
                  name='firstname'
                  defaultValue={auth.user?.firstname || ''}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      id='firstname'
                      size='small'
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      label={t('Họ')}
                      error={Boolean(errors.firstname)}
                      {...(errors.firstname && { helperText: errors.firstname.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  control={control}
                  name='lastname'
                  defaultValue={auth.user?.lastname || ''}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      id='lastname'
                      size='small'
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      label={t('Tên')}
                      error={Boolean(errors.lastname)}
                      {...(errors.lastname && { helperText: errors.lastname.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={4} xs={12}>
                <Controller
                  control={control}
                  name='gender'
                  defaultValue={auth.user?.gender || ''}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      select
                      id='gender'
                      label={t('Giới tính')}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.gender)}
                      helperText={errors.gender ? errors.gender.message : ''}
                      size='small'
                      fullWidth
                    >
                      <MenuItem value='male'>{t('Nam')}</MenuItem>
                      <MenuItem value='female'>{t('Nữ')}</MenuItem>
                      <MenuItem value='other'>{t('Khác')}</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Controller
                  control={control}
                  name='email'
                  defaultValue={auth.user?.email || ''}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      type='email'
                      size='small'
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      label={t('Email')}
                      {...(errors.email && { helperText: errors.email.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Controller
                  control={control}
                  name='phone'
                  defaultValue={auth.user?.phone || ''}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      size='small'
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.phone)}
                      label={t('Số điện thoại')}
                      {...(errors.phone && { helperText: errors.phone.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Controller
                  name='dateOfBirth'
                  control={control}
                  defaultValue={auth.user?.dateOfBirth ? new Date(auth.user?.dateOfBirth) : undefined}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <DatePickerWrapper>
                      <DatePicker
                        id='date-picker'
                        showYearDropdown
                        showMonthDropdown
                        selected={value}
                        placeholderText='YYYY-MM-DD'
                        dropdownMode='select'
                        customInput={
                          <TextField
                            size='small'
                            label={t('Ngày sinh')}
                            fullWidth
                            value={value ? format.dateTime(value, { dateStyle: 'medium' }) : ''}
                            onBlur={onBlur}
                            error={Boolean(errors.dateOfBirth)}
                            {...(errors.dateOfBirth && { helperText: errors.dateOfBirth.message })}
                          />
                        }
                        onChange={date => onChange(date)}
                        onBlur={onBlur}
                        dateFormat='yyyy-MM-dd'
                        maxDate={addDays(new Date(), 0)}
                      />
                    </DatePickerWrapper>
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Controller
                  name='nickname'
                  control={control}
                  defaultValue={auth.user?.nickname || ''}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      size='small'
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.nickname)}
                      label={t('Biệt danh')}
                      {...(errors.nickname && { helperText: errors.nickname.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name='description'
                  defaultValue={auth.user?.description || ''}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      rows={4}
                      multiline
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      label={t('Mô tả')}
                      size='small'
                      error={Boolean(errors.description)}
                      {...(errors.description && { helperText: errors.description.message })}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Controller
                  name='province'
                  control={control}
                  defaultValue={province}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      select
                      id='province'
                      label={t('Tỉnh/Thành phố')}
                      value={value}
                      onBlur={onBlur}
                      onChange={e => {
                        onChange(e)
                        const provinceID = provinceData?.find((item: any) => item.name === e.target.value).idProvince
                        setProvinceID(provinceID)
                      }}
                      size='small'
                      fullWidth
                      error={Boolean(errors.province)}
                      helperText={errors.province ? errors.province.message : ''}
                    >
                      {provinceData?.map((province: any) => (
                        <MenuItem key={province.idProvince} value={province.name}>
                          {province.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Controller
                  name='district'
                  control={control}
                  defaultValue={district}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      select
                      id='district'
                      label={t('Quận/Huyện')}
                      value={value}
                      onBlur={onBlur}
                      onChange={e => {
                        onChange(e)
                        const districtID = districtData?.find((item: any) => item.name === e.target.value).idDistrict
                        setDistrictID(districtID)
                      }}
                      size='small'
                      fullWidth
                      error={Boolean(errors.district)}
                      helperText={errors.district ? errors.district.message : ''}
                    >
                      {districtData?.map((district: any) => (
                        <MenuItem key={district.idDistrict} value={district.name}>
                          {district.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Controller
                  name='ward'
                  control={control}
                  defaultValue={ward}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      select
                      id='ward'
                      label={t('Phường/Xã')}
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      size='small'
                      fullWidth
                      error={Boolean(errors.ward)}
                      helperText={errors.ward ? errors.ward.message : ''}
                    >
                      {wardData?.map((ward: any) => (
                        <MenuItem key={ward.idCommune} value={ward.name}>
                          {ward.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <Controller
                  name='streetName'
                  control={control}
                  defaultValue={streetName}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      size='small'
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.streetName)}
                      label={t('Tên đường')}
                      {...(errors.streetName && { helperText: errors.streetName.message })}
                    />
                  )}
                />
              </Grid>
              <DialogActions sx={{ justifyContent: 'center', marginTop: '12px' }}>
                <Button type='submit' disabled={!isValid} variant='contained' sx={{ mr: 1 }}>
                  {t('Cập nhật')}
                </Button>
                <Button variant='outlined' color='secondary' onClick={handleDiscard}>
                  {t('Hủy bỏ')}
                </Button>
              </DialogActions>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default UpdateUserProfile
