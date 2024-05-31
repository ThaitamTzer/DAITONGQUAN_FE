import { useState, useCallback, FormEvent, ReactElement, Ref, forwardRef, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AlertTitle from '@mui/material/AlertTitle'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import PageHeader from 'src/@core/components/page-header'
import TableHeader from 'src/views/apps/permissions/TableHeader'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Types Imports
import { RolesRowType } from 'src/types/apps/roleTypes'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Import third party
import { useTranslation } from 'react-i18next'
import useSWR, { mutate } from 'swr'

// ** Service
import masterAdminService from 'src/service/masterAdmin.service'

// ** Permission
import permissions from '../../../configs/permissions.json'
import toast from 'react-hot-toast'
import {
  SlideProps,
  Slide,
  DialogContentText,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'

interface Colors {
  [key: string]: ThemeColor
}
interface CellType {
  row: RolesRowType
}

const colors: Colors = {
  CREATE: 'success',
  UPDATE: 'warning',
  READ: 'primary',
  DELETE: 'error'
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0,
    field: 'name',
    minWidth: 240,
    headerName: 'Roles Name',
    renderCell: ({ row }: CellType) => <Typography sx={{ color: 'text.secondary' }}>{row.name}</Typography>
  },
  {
    flex: 0.35,
    minWidth: 290,
    field: 'assignedTo',
    headerName: 'Assigned To',
    renderCell: ({ row }: CellType) => {
      return row.permissionID.map((permissionID: any, index: number) => {
        const permission = permissions.find((p: { id: number }) => p.id === permissionID)
        const permissionAction = permission ? permission.action.toUpperCase() : 'UNKNOWN'
        const permissionName = permission ? permission.namePermission.toUpperCase() : 'UNKNOWN'

        return (
          <CustomChip
            rounded
            size='small'
            key={index}
            skin='light'
            color={colors[permissionAction]}
            label={permissionName}
            sx={{
              '& .MuiChip-label': { textTransform: 'capitalize' },
              '&:not(:last-of-type)': { mr: 3 }
            }}
          />
        )
      })
    }
  }
]

const Transition = forwardRef(function Transition(
  props: SlideProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  t
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  t: (key: string) => string
}) => {
  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition}>
      <DialogTitle>{t('Xác nhận xóa')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('Bạn có chắc chắn muốn xóa vai trò này không?')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('Hủy')}</Button>
        <Button onClick={onConfirm} color='error' autoFocus>
          {t('Xóa')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const PermissionsTable = () => {
  const [value, setValue] = useState<string>('')
  const [editValue, setEditValue] = useState<string>('')
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const { t } = useTranslation()
  const { data: roles } = useSWR('GET_ALL_ROLES', masterAdminService.getAllRole)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [roleId, setRoleId] = useState<string | null>(null)
  const [rolePermissions, setRolePermissions] = useState<number[]>([])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const permissionsBySubject = permissions.reduce((acc: any, permission: any) => {
    const { subject } = permission
    if (!acc[subject]) {
      acc[subject] = []
    }
    acc[subject].push(permission)

    return acc
  }, {})

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const permissionId = Number(event.target.name)
    setRolePermissions(prevState =>
      prevState.includes(permissionId) ? prevState.filter(id => id !== permissionId) : [...prevState, permissionId]
    )
  }

  const handleEditPermission = async (role: RolesRowType) => {
    setRoleId(role._id)
    setEditValue(role.name)
    setRolePermissions(role.permissionID.map(Number))
    setEditDialogOpen(true)
  }

  const handleDeleteRole = (id: string) => {
    setRoleId(id)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = async () => {
    if (roleId) {
      try {
        await masterAdminService.deleteRole({ id: roleId })
        toast.success(t('Vai trò đã được xóa'))
        mutate('GET_ALL_ROLES')
      } catch (error: any) {
        toast.error(t('Có lỗi xảy ra'))
      }
    }
    setOpenDeleteDialog(false)
    setRoleId(null)
  }

  const handleConfirmUpdate = async () => {
    try {
      await masterAdminService.updateRole({ _id: roleId, name: editValue, permissionID: rolePermissions })
      toast.success(t('Vai trò đã được cập nhật'))
      mutate('GET_ALL_ROLES')
    } catch (error: any) {
      toast.error(t('Có lỗi xảy ra'))
    }
    setEditDialogOpen(false)
  }

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
    setRoleId(null)
  }

  const handleDialogToggle = () => setEditDialogOpen(!editDialogOpen)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleConfirmUpdate()
  }

  const filteredRoles =
    roles?.data.filter((role: RolesRowType) => role.name.toLowerCase().includes(value.toLowerCase())) ?? []

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0,
      minWidth: 120,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => handleEditPermission(row)}>
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton onClick={() => handleDeleteRole(row._id)}>
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <PageHeader
            title={
              <Typography variant='h4' sx={{ mb: 6 }}>
                {t('Danh sách vai trò')}
              </Typography>
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader value={value} handleFilter={handleFilter} mutateData={() => mutate('GET_ALL_ROLES')} />
            <DataGrid
              autoHeight
              rows={filteredRoles.slice(1).map((item: { _id: any }) => ({ ...item, id: item._id }))}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Card>
        </Grid>
      </Grid>
      <Dialog
        maxWidth='lg'
        fullWidth
        onClose={handleDialogToggle}
        open={editDialogOpen}
        TransitionComponent={Transition}
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Typography variant='h2' component='span' sx={{ mb: 2 }}>
            {t('Cập nhật vai trò')}
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Alert severity='warning' sx={{ maxWidth: '1200px' }}>
            <AlertTitle>{t('Cảnh báo!')}</AlertTitle>
            {t(
              'Bằng cách chỉnh sửa vai trò, bạn có thể phá vỡ chức năng cấp quyền của hệ thống. Hãy đảm bảo bạn hoàn toàn chắc chắn trước khi tiếp tục.'
            )}
          </Alert>
          <Box component='form' sx={{ mt: 8 }} onSubmit={onSubmit}>
            <FormGroup sx={{ mb: 2, alignItems: 'center', flexDirection: 'row', flexWrap: ['wrap', 'nowrap'] }}>
              <CustomTextField
                fullWidth
                value={editValue}
                label={t('Tên vai trò')}
                sx={{ mr: [0, 5], mb: [3, 0] }}
                placeholder={t('Nhập tên vai trò') || ''}
                onChange={e => setEditValue(e.target.value)}
              />
              <Button fullWidth type='submit' variant='contained' sx={{ mt: 4 }}>
                {t('Cập nhật')}
              </Button>
            </FormGroup>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Permission</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(permissionsBySubject).map(([subject, permissions]) => (
                    <TableRow key={subject}>
                      <TableCell>{subject.toUpperCase()}</TableCell>
                      {permissions.map((permission: any) => (
                        <TableCell key={permission.id}>
                          <FormGroup row>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name={permission.id.toString()}
                                  checked={rolePermissions.includes(permission.id)}
                                  onChange={handleCheckboxChange}
                                />
                              }
                              label={permission.namePermission}
                            />
                          </FormGroup>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
      </Dialog>
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        t={t}
      />
    </>
  )
}

export default PermissionsTable
