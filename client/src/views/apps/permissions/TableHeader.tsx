// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Import third party
import { useTranslation } from 'react-i18next'

// ** Permission
import permissions from '../../../configs/permissions.json'

// ** Import third party

// ** Service
import masterAdminService from 'src/service/masterAdmin.service'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getRoleValidationSchema } from 'src/configs/validationSchema'
import { mutate } from 'swr'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { value, handleFilter } = props

  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const { t } = useTranslation()
  const schema = getRoleValidationSchema(t)
  const handleDialogToggle = () => setOpen(!open)

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const permissionId = Number(event.target.name)
    setSelectedPermissions(prevState =>
      prevState.includes(permissionId) ? prevState.filter(id => id !== permissionId) : [...prevState, permissionId]
    )
  }

  const permissionsBySubject = permissions.reduce((acc: any, permission: any) => {
    const { subject } = permission
    if (!acc[subject]) {
      acc[subject] = []
    }
    acc[subject].push(permission)

    return acc
  }, {})

  interface FormData {
    name: string
    permissionID: number[]
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset // add this line
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    const payload = {
      ...data,
      permissionID: selectedPermissions
    }
    masterAdminService.createRole(payload)
    mutate('GET_ALL_ROLES')
    handleDialogToggle()
    setSelectedPermissions([])
    reset() // add this line
  }

  return (
    <>
      <Box
        sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <CustomTextField
          value={value}
          sx={{ mr: 4, mb: 2 }}
          placeholder='Search Permission'
          onChange={e => handleFilter(e.target.value)}
        />
        <Button sx={{ mb: 2 }} variant='contained' onClick={handleDialogToggle}>
          {t('Thêm quyền hạn')}
        </Button>
      </Box>
      <Dialog maxWidth='sm' onClose={handleDialogToggle} open={open}>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle
            component='div'
            sx={{
              textAlign: 'center',
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Typography variant='h3' sx={{ mb: 2 }}>
              {t('Thêm quyền hạn')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button type='submit' variant='contained' disabled={!isValid || selectedPermissions.length === 0}>
                {t('Thêm')}
              </Button>
              <Button type='reset' variant='outlined' color='secondary' onClick={handleDialogToggle}>
                {t('Hủy')}
              </Button>
            </Box>
          </DialogTitle>
          <DialogContent
            sx={{
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(13)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <Box
              sx={{
                mt: 4,
                mx: 'auto',
                width: '100%',
                maxWidth: 480,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    sx={{ mb: 3 }}
                    label={t('Tên quyền hạn')}
                    placeholder={t('Nhập tên quyền hạn') ?? ''}
                    error={Boolean(errors.name)}
                    {...(errors.name && { helperText: errors.name.message })}
                  />
                )}
              />
              {Object.entries(permissionsBySubject).map(([subject, permissions]) => (
                <Box key={subject} sx={{ mb: 3, width: '100%' }}>
                  <Typography variant='h6' sx={{ mb: 1 }}>
                    {subject}
                  </Typography>
                  <FormGroup>
                    {(permissions as any[]).map(permission => (
                      <FormControlLabel
                        key={permission.id}
                        control={
                          <Checkbox
                            checked={selectedPermissions.includes(permission.id)}
                            onChange={handleCheckboxChange}
                            name={String(permission.id)}
                          />
                        }
                        label={permission.namePermission}
                      />
                    ))}
                  </FormGroup>
                </Box>
              ))}
            </Box>
          </DialogContent>
        </form>
      </Dialog>
    </>
  )
}

export default TableHeader
