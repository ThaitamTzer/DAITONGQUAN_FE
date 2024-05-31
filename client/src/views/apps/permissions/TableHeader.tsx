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
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import toast from 'react-hot-toast'

interface TableHeaderProps {
  value: string
  handleFilter: (val: string) => void
  mutateData: () => void
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
    toast.success(t('Thêm vai trò thành công'))
    props.mutateData()
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
          {t('Thêm vai trò')}
        </Button>
      </Box>
      <Dialog maxWidth='lg' fullWidth onClose={handleDialogToggle} open={open}>
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
              {t('Thêm vai trò')}
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
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(5)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(5)} !important`]
            }}
          >
            <Box
              sx={{
                mt: 4,
                mx: 'auto',
                width: '100%',
                maxWidth: 1000,
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
                    label={t('Tên vai trò')}
                    placeholder={t('Nhập tên vai trò') ?? ''}
                    error={Boolean(errors.name)}
                    {...(errors.name && { helperText: errors.name.message })}
                  />
                )}
              />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Permission</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(permissionsBySubject).map(([subject, permissions]) => {
                      const allSelected = permissions.every((permission: any) =>
                        selectedPermissions.includes(permission.id)
                      )

                      const handleSelectAll = () => {
                        if (allSelected) {
                          // If all permissions are selected, unselect them
                          setSelectedPermissions(
                            selectedPermissions.filter(
                              id => !permissions.map((permission: any) => permission.id).includes(id)
                            )
                          )
                        } else {
                          // If not all permissions are selected, select them
                          setSelectedPermissions([
                            ...selectedPermissions,
                            ...permissions.map((permission: any) => permission.id)
                          ])
                        }
                      }

                      return (
                        <TableRow key={subject}>
                          <TableCell>{subject.toUpperCase()}</TableCell>
                          <TableCell>
                            <FormControlLabel
                              key={permissions.id}
                              control={<Checkbox checked={allSelected} onChange={handleSelectAll} />}
                              label={'All'}
                            />
                          </TableCell>
                          {permissions.map((permission: any) => (
                            // eslint-disable-next-line react/jsx-key
                            <TableCell>
                              <FormGroup row>
                                <FormControlLabel
                                  key={permission.id}
                                  control={
                                    <Checkbox
                                      checked={selectedPermissions.includes(permission.id)}
                                      onChange={handleCheckboxChange}
                                      name={permission.id.toString()}
                                    />
                                  }
                                  label={permission.namePermission.toUpperCase()}
                                />
                              </FormGroup>
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </DialogContent>
        </form>
      </Dialog>
    </>
  )
}

export default TableHeader
