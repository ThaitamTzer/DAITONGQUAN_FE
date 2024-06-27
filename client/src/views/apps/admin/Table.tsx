// ** React Imports
import { useCallback, useState, Ref, forwardRef, ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { Button, Slide, SlideProps } from '@mui/material'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import UpdateAdminDialog from 'src/views/apps/admin/UpdateAdmin'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Types Imports
import { AdminsType, UpdateAdminsType } from 'src/types/apps/userTypes'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/admin/TableHeader'

// ** Import Third Party
import useSWR from 'swr'
import { useTranslation } from 'react-i18next'
import masterAdminService from 'src/service/masterAdmin.service'
import toast from 'react-hot-toast'
import { getUpdateAdminValidationSchema } from 'src/configs/validationSchema'

interface UserStatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: AdminsType | any
}

const adminStatusObj: UserStatusType = {
  isBlock: 'error',
  isActive: 'success'
}

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

const AdminList = () => {
  // ** State
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [adminId, setAdminId] = useState<string | null>(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [open, setOpen] = useState(false)
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null)
  const [selectedAdmin, setSelectedAdmin] = useState<any>({
    _id: '',
    fullname: '',
    email: '',
    password: '',
    role: [{ _id: '', name: '' }]
  })

  // ** Hooks
  const { data: admins, mutate } = useSWR('GET_ALL_ADMIN', masterAdminService.getAllAdmin)

  const { data: roles } = useSWR('GET_ALL_ROLES', masterAdminService.getAllRole)
  const { t } = useTranslation()

  // ** Methods
  const handleDeleteAdmin = (id: string) => {
    setAdminId(id)
    setOpenDeleteDialog(true)
  }

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false)
    setSelectedAdmin({
      _id: '',
      fullname: '',
      email: '',
      password: '',
      role: [{ _id: '', name: '' }]
    })
  }

  const handleConfirmDelete = async () => {
    if (adminId) {
      try {
        await masterAdminService.deleteAdmin({ id: adminId }).then(() => {
          mutate()
        })
        toast.success(t('Xóa Admin thành công'))
      } catch (error) {
        toast.error(t('Xóa Admin thất bại'))
      }
    }
    setOpenDeleteDialog(false)
  }

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handlePlanChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setPlan(e.target.value as string)
  }, [])

  const handleCancelUpdate = () => {
    setOpenUpdateDialog(false)
  }

  const handleUpdateAdmin = (admin: UpdateAdminsType) => {
    if (!admin.id) {
      console.error('Admin object must have an _id field')

      return
    }
    setSelectedAdmin(admin)
    
    // console.log('admin: ', admin)
    setOpenUpdateDialog(true)
  }

  const handleConfirmUpdate = async (data: UpdateAdminsType) => {
    try {
      await masterAdminService
        .updateAdmin({
          id: data.id,
          fullname: data.fullname,
          email: data.email,
          roleId: data.roleId,
          password: data.password
        })
        .then(() => {
          mutate()
        })
      toast.success(t('Cập nhật Admin thành công'))
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
    setOpenUpdateDialog(false)
  }

  const handleOpenDialog = (id: string) => {
    setCurrentAdminId(id)
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
  }

  const handleConfirmBlockAdmin = async () => {
    if (!currentAdminId) return

    const adminToModify = admins?.find((item: { _id: string }) => item._id === currentAdminId)
    const newIsBlockStatus = !adminToModify?.isBlock

    try {
      await masterAdminService.blockAdmin({ id: currentAdminId, isBlock: newIsBlockStatus }).then(() => {
        mutate() // Refresh the data after updating
      })

      if (newIsBlockStatus) {
        toast.success(t('Block Admin thành công'))
      } else {
        toast.success(t('Mở Block Admin thành công'))
      }
    } catch (error) {
      if (newIsBlockStatus) {
        toast.error(t('Block Admin thất bại'))
      } else {
        toast.error(t('Mở Block Admin thất bại'))
      }
    }

    handleCloseDialog()
  }

  const renderClient = (row: AdminsType) => {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row.fullname ? row.fullname : 'Admin')}
      </CustomAvatar>
    )
  }

  const columns: GridColDef[] = [
    {
      flex: 0,
      minWidth: 280,
      field: 'fullname',
      headerName: 'Admin',
      renderCell: ({ row }: CellType) => {
        const { fullname, email } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary'
                }}
              >
                {fullname}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.3,
      field: 'role',
      minWidth: 170,
      headerName: 'Role',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {row.role.map((item: { name: string }, index: number) => (
              <Typography key={item.name} noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                {item.name}
                {index !== row.role.length - 1 && '-'}
              </Typography>
            ))}
          </Box>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }: CellType) => {
        return (
          <CustomChip
            rounded
            skin='light'
            size='small'
            label={row.isBlock ? 'Blocked' : 'Active'}
            color={adminStatusObj[row.isBlock ? 'isBlock' : 'isActive']}
            sx={{ textTransform: 'capitalize' }}
          />
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() =>
              handleUpdateAdmin({
                ...row,
                _id: row.id
              })
            }
          >
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton onClick={() => handleOpenDialog(row._id)}>
            <Icon icon={row.isBlock ? 'tabler:lock' : 'tabler:lock-open'} />
          </IconButton>
          <IconButton onClick={() => handleDeleteAdmin(row._id)}>
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader plan={plan} value={value} handleFilter={handleFilter} handlePlanChange={handlePlanChange} />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={admins?.map((item: { _id: any }) => ({ ...item, id: item._id })) ?? []}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        t={t}
      />
      <UpdateAdminDialog
        open={openUpdateDialog}
        onClose={handleCancelUpdate}
        onConfirm={(data: UpdateAdminsType) => handleConfirmUpdate(data)}
        adminData={selectedAdmin}
        schema={() => getUpdateAdminValidationSchema(t)}
        roleData={roles?.data ?? []}
        t={t}
      />
      <Dialog
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {
            currentAdminId && admins
              ? admins.find((item: { _id: string }) => item._id === currentAdminId)?.isBlock
                ? t('Xác nhận mở khóa')
                : t('Xác nhận khóa')
              : '' // Or a default title if admin data isn't available yet
          }
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {
              currentAdminId && admins
                ? admins.find((item: { _id: string }) => item._id === currentAdminId)?.isBlock
                  ? t('Bạn có chắc chắn muốn mở khóa Admin này không?')
                  : t('Bạn có chắc chắn muốn khóa Admin này không?')
                : '' // Or a default message
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('Hủy')}</Button>
          <Button onClick={handleConfirmBlockAdmin} autoFocus>
            {
              currentAdminId && admins
                ? admins.find((item: { _id: string }) => item._id === currentAdminId)?.isBlock
                  ? t('Mở khóa')
                  : t('Khóa')
                : t('Xác nhận') // Or a default label
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default AdminList
