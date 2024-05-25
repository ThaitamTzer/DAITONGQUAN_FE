// ** React Imports
import { Ref, useState, forwardRef, ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// import { SelectChangeEvent } from '@mui/material/Select'
// import Switch from '@mui/material/Switch'
// import Chip from '@mui/material/Chip'
// import FormControlLabel from '@mui/material/FormControlLabel'
// import FormControl from '@mui/material/FormControl'
// import Select from '@mui/material/Select'
// import InputLabel from '@mui/material/InputLabel'

// ** Custom Component Import
// import CustomTextField from 'src/@core/components/mui/text-field'

// ** Import hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Import third party
import { useTranslation } from 'react-i18next'
import { useFormatter } from 'next-intl'

// import addDays from 'date-fns/addDays'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getProfileValidationSchema } from 'src/configs/validationSchema'
import { addDays } from 'date-fns'
import useSWR from 'swr'
import addressService from 'src/service/address.service'
import userProfileService from 'src/service/userProfileService.service'

// import { useFormatter } from 'next-intl'

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
  dateOfBirth: Date
  address: string
  nickname: string
  description: string
  phone: string
  province: string
  district: string
  ward: string
  streetName: string | ''
  desciption: string | ''
}

const UpdateUserProfile = () => {
  // ** States
  const [show, setShow] = useState<boolean>(false)

  const [provinceID, setProvinceID] = useState<number>()
  const [districtID, setDistrictID] = useState<number>()
  const [province, setProvince] = useState<string>('')
  const [district, setDistrict] = useState<string>('')
  const [ward, setWard] = useState<string>('')
  const [streetName, setStreetName] = useState<string>('')
  const auth = useAuth()
  const { t } = useTranslation()
  const schema = getProfileValidationSchema(t)

  const format = useFormatter()

  // ** Fetch data
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

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        width: 250,
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
      }
    }
  }

  const handleDiscard = () => {
    setShow(false)

    // Reset form values to initial state
    reset({
      firstname: auth.user?.firstname || '', // Reset to user's original data or empty
      lastname: auth.user?.lastname || '',
      gender: auth.user?.gender || '',
      email: auth.user?.email || '',
      address: auth.user?.address || '',
      nickname: auth.user?.nickname || '',
      description: auth.user?.description || '',
      phone: auth.user?.phone || '',
      dateOfBirth: auth.user?.dateOfBirth ? new Date(auth.user?.dateOfBirth) : undefined
    })

    // Reset other states (province, district, etc.)
    setProvince('')
    setDistrict('')
    setWard('')
    setStreetName('')
  }

  const handleDivideAddress = (address: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        if (address || '') {
          const currentAddress = address.split(', ')
          const reverseAddress = currentAddress.reverse()
          setProvince(reverseAddress[0])
          setDistrict(reverseAddress[1])
          setWard(reverseAddress[2])
          if (reverseAddress.length > 3) {
            setStreetName(reverseAddress[3])
          }

          const foundProvince = provinceData?.find(
            (item: any) => item.province_name === reverseAddress[0] // Match province name
          )

          if (foundProvince) {
            setProvinceID(foundProvince.province_id)
            console.log('Province ID:', foundProvince.province_id)
          } else {
            console.log('Province not found')
          }

          // Wait for provinceID to be available, then find the district
          if (foundProvince) {
            setTimeout(() => {
              const foundDistrict = districtData?.find(
                (item: any) => item.district_name === reverseAddress[1] // Match district name
              )
              if (foundDistrict) {
                setDistrictID(foundDistrict.district_id)
                console.log('District ID:', foundDistrict.district_id)
              }
              resolve()
            }, 0)
          } else {
            resolve()
          }

          setShow(true)
        } else {
          resolve()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  const handleAddress = (province: string, district: string, ward: string, streetName: string) => {
    const capitalizeWords = (str: string) =>
      str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    const formattedProvince = capitalizeWords(province)
    const formattedDistrict = capitalizeWords(district)
    const formattedWard = capitalizeWords(ward)
    const formattedStreetName = streetName ? capitalizeWords(streetName) : ''

    if (formattedStreetName) {
      return `${formattedStreetName}, ${formattedWard}, ${formattedDistrict}, ${formattedProvince}`
    } else {
      return `${formattedWard}, ${formattedDistrict}, ${formattedProvince}`
    }
  }

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: FormData) => {
    const { firstname, lastname, email, gender, address, nickname, desciption, dateOfBirth } = data
    userProfileService.updateUserProfile({
      firstname,
      lastname,
      email,
      description,
      address, // Combine address
      nickname,
      
    })


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
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              {t('Thay đổi thông tin cá nhân')}
            </Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item sm={4} xs={12}>
              <Controller
                control={control}
                name='firstname'
                defaultValue={auth.user?.firstname || ''}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    id='firtname'
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
                rules={{ required: true }}
                defaultValue={auth.user?.lastname}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    id='lastname'
                    size='small'
                    fullWidth
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
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
                rules={{ required: true }}
                defaultValue={auth.user?.gender || ''}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    id='gender'
                    select
                    placeholder=''
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    size='small'
                    fullWidth
                    label={t('Giới tính')}
                    error={Boolean(errors.gender)}
                    {...(errors.gender && { helperText: errors.gender.message })}
                  >
                    <MenuItem value=''>{t('Trống')}</MenuItem>
                    <MenuItem value='male'>{t('Nam')}</MenuItem>
                    <MenuItem value='demale'>{t('Nữ')}</MenuItem>
                    <MenuItem value='other'>{t('Khác')}</MenuItem>
                    <MenuItem value='email'>Email</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                defaultValue={auth.user?.email}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    id='email'
                    fullWidth
                    size='small'
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    label='Email'
                    error={Boolean(errors.email)}
                    {...(errors.email && { helperText: errors.email.message })}
                  />
                )}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <Controller
                name='phone'
                control={control}
                rules={{ required: true }}
                defaultValue={auth.user?.phone}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    id='phone'
                    fullWidth
                    size='small'
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    label={t('Số điện thoại')}
                    inputProps={{ inputMode: 'numeric' }}
                    error={Boolean(errors.phone)}
                    {...(errors.phone && { helperText: errors.phone.message })}
                  />
                )}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              {/* <DatePickerWrapper>
                <Controller
                  name='dateOfBirth'
                  control={control}
                  defaultValue={handleDateOfBirth(auth.user?.dateOfBirth || new Date())}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <DatePicker
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode='select'
                      dateFormat={'dd/MM/yyyy'}
                      selected={value} // Use the Date object for the 'selected' prop
                      // onChange={(date: Date | null) => {
                      //   // Handle onChange
                      //   if (date) {
                      //     // Make sure the date is not null
                      //     setMonthYear(date)
                      //     onChange(date)
                      //   }
                      // }}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholderText='10/12/2003'
                      popperPlacement={'bottom-start'}
                      customInput={<TextField fullWidth size='small' label='Ngày sinh' />}
                    />
                  )}
                />
              </DatePickerWrapper> */}
              <DatePickerWrapper>
                <Controller
                  name='dateOfBirth'
                  control={control}
                  rules={{ required: true }}
                  defaultValue={auth.user?.dateOfBirth ? new Date(auth.user?.dateOfBirth) : undefined}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      showYearDropdown
                      showMonthDropdown
                      id='date-picker'
                      selected={value}
                      onChange={onChange}
                      dateFormat='dd/MM/yyyy'
                      maxDate={addDays(new Date(), 5)}
                      dropdownMode='select'
                      popperPlacement='bottom-start'
                      customInput={
                        <TextField
                          id='date-picker'
                          label={t('Ngày tháng năm sinh')}
                          fullWidth
                          size='small'
                          value={
                            value
                              ? format.dateTime(value, {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  timeZone: 'UTC'
                                })
                              : ''
                          }
                          error={Boolean(errors.dateOfBirth)}
                          {...(errors.dateOfBirth && { helperText: errors.dateOfBirth.message })}
                        />
                      }
                    />
                  )}
                />
              </DatePickerWrapper>
            </Grid>
            <Grid item sm={4} xs={12}>
              <Controller
                name='province'
                control={control}
                defaultValue={province}
                rules={{ required: true }}
                render={({ field: { value, onBlur } }) => (
                  <TextField
                    id='province'
                    select
                    multiline
                    fullWidth
                    size='small'
                    value={value}
                    onBlur={onBlur}
                    label={t('Tỉnh/Thành Phố')}
                    SelectProps={{ MenuProps }}
                    onChange={e => {
                      const selectedProvince = e.target.value

                      // Tìm ID của tỉnh/thành phố được chọn
                      const selectedProvinceData = provinceData?.find(
                        (item: any) => item.province_name === selectedProvince
                      )
                      if (selectedProvinceData) {
                        setProvinceID(selectedProvinceData.province_id) // Cập nhật provinceID để kích hoạt lại useSWR của district
                        setProvince(selectedProvinceData.province_name)
                      } else {
                        setProvinceID(undefined) // Reset provinceID nếu không tìm thấy
                      }
                    }}
                  >
                    {provinceData?.map((item: any) => (
                      <MenuItem key={item.province_id} value={item.province_name}>
                        {item.province_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <Controller
                name='district'
                control={control}
                defaultValue={district}
                rules={{ required: true }}
                render={({ field: { value, onBlur } }) => (
                  <TextField
                    id='district'
                    select
                    fullWidth
                    onBlur={onBlur}
                    size='small'
                    label={t('Quận/Huyện')}
                    value={value}
                    SelectProps={{ MenuProps }}
                    onChange={e => {
                      const selectedDistrict = e.target.value as string
                      const selectedDistrictData = districtData?.find(
                        (item: any) => item.district_name === selectedDistrict
                      )

                      if (selectedDistrictData) {
                        setDistrictID(selectedDistrictData.district_id)
                        setDistrict(selectedDistrictData.district_name)
                      } else {
                        setDistrictID(undefined)
                      }
                    }}
                  >
                    {districtData?.map((item: any) => (
                      <MenuItem key={item.district_id} value={item.district_name}>
                        {item.district_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <Controller
                name='ward'
                control={control}
                defaultValue={ward}
                rules={{ required: true }}
                render={({ field: { value, onBlur } }) => (
                  <TextField
                    id='ward'
                    select
                    value={value}
                    fullWidth
                    onBlur={onBlur}
                    size='small'
                    label={t('Phường/Xã')}
                    SelectProps={{ MenuProps }}
                    onChange={e => {
                      setWard(e.target.value as string)
                    }}
                  >
                    {wardData?.map((item: any) => (
                      <MenuItem key={item.ward_id} value={item.ward_name}>
                        {item.ward_name}
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
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    id='street_name'
                    fullWidth
                    size='small'
                    label={t('Số nhà tên đường')}
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.streetName)}
                    {...(errors.streetName && { helperText: errors.streetName.message })}
                  />
                )}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                id='nickname'
                fullWidth
                size='small'
                defaultValue={auth.user?.nickname}
                label={t('Biệt danh (Tùy chọn)')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id='decription'
                multiline
                maxRows={4}
                defaultValue={auth.user?.description}
                fullWidth
                size='small'
                label={t('Mô tả (Tùy chọn)')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 1 }} onClick={() => setShow(false)}>
            Submit
          </Button>
          <Button variant='tonal' color='secondary' onClick={() => handleDiscard()}>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default UpdateUserProfile
