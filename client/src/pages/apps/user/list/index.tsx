// ** React Imports
import { useState, useCallback, useContext } from 'react'

// ** Next Imports
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import {
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Context
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Third Party Components
import axios from 'axios'
import useSWR, { mutate } from 'swr'
import toast from 'react-hot-toast'

// ** Types Imports
import { CardStatsType } from 'src/@fake-db/types'
import { getAllUser } from 'src/types/apps/userTypes'
import { CardStatsHorizontalWithDetailsProps } from 'src/@core/components/card-statistics/types'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import userAdminService from 'src/service/userAdmin.service'

interface CellType {
  row: getAllUser
}

// ** Utility function to format date
function FormatDate(dateString: string | null): string | null {
  if (dateString) {
    const dateObj = new Date(dateString)
    const day = String(dateObj.getDate()).padStart(2, '0')
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const year = dateObj.getFullYear()

    return `${day}/${month}/${year}`
  }

  return null
}

// ** Function to render client's avatar or initials
const renderClient = (row: getAllUser) => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row.firstname + ' ' + row.lastname)}
      </CustomAvatar>
    )
  }
}

// ** Component to handle row options (block/delete actions)
const RowOptions = ({ id }: { id: string }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [openBlockDialog, setOpenBlockDialog] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const ability = useContext(AbilityContext)

  const { data } = useSWR('GET_ALL_USERS', userAdminService.getAllUser)

  const handleOpenDialog = (id: string) => {
    setUserId(id)
    setOpenDialog(true)
  }

  const handleOpenDeleteDialog = (id: string) => {
    setUserId(id)
    setOpenBlockDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setOpenBlockDialog(false)
  }

  const handleConfirmBlockUser = async () => {
    if (!userId) return
    const userToModify = data?.find((item: { _id: string }) => item._id === userId)
    const newIsBlockStatus = !userToModify?.isBlock

    try {
      await userAdminService.blockUser({ _id: userId, isBlock: newIsBlockStatus })
      toast.success(newIsBlockStatus ? 'Account successfully blocked' : 'Account successfully unblocked')
      mutate('GET_ALL_USERS')
    } catch (error) {
      toast.error(newIsBlockStatus ? 'Failed to block account' : 'Failed to unblock account')
    }

    handleCloseDialog()
  }

  const handleDeleteUser = async () => {
    if (!userId) return
    try {
      await userAdminService.deleteUser({ _id: userId })
      toast.success('Account successfully deleted')
      mutate('GET_ALL_USERS')
    } catch (error) {
      toast.error('Failed to delete account')
    }

    handleCloseDialog()
  }

  return (
    <>
      {ability.can('block', 'user') && (
        <IconButton onClick={() => handleOpenDialog(id)}>
          <Icon
            icon={data?.find((item: { _id: string }) => item._id === id)?.isBlock ? 'tabler:lock' : 'tabler:lock-open'}
          />
        </IconButton>
      )}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          {userId && data
            ? data.find((item: { _id: string }) => item._id === userId)?.isBlock
              ? 'Confirm Unblock'
              : 'Confirm Block'
            : ''}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {userId && data
              ? data.find((item: { _id: string }) => item._id === userId)?.isBlock
                ? 'Are you sure you want to unblock this user?'
                : 'Are you sure you want to block this user?'
              : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmBlockUser} autoFocus>
            {userId && data
              ? data.find((item: { _id: string }) => item._id === userId)?.isBlock
                ? 'Unblock'
                : 'Block'
              : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
      {ability.can('delete', 'user') && (
        <IconButton onClick={() => handleOpenDeleteDialog(id)}>
          <Icon icon='tabler:trash' fontSize={20} />
        </IconButton>
      )}
      <Dialog open={openBlockDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this user?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDeleteUser} color='error' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

// ** Column definitions for the DataGrid
const columns: GridColDef[] = [
  {
    flex: 0.25,
    minWidth: 280,
    field: 'fullName',
    headerName: 'User',
    renderCell: ({ row }: CellType) => {
      const { firstname, lastname, email } = row

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
              {firstname + ' ' + lastname}
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
    flex: 0.15,
    field: 'gender',
    minWidth: 170,
    headerName: 'Gender',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.gender}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'status',
    minWidth: 170,
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={row.isBlock ? 'Blocked' : 'Active'}
          color={row.isBlock ? 'error' : 'success'}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  },
  {
    flex: 0.15,
    field: 'createdAt',
    minWidth: 170,
    headerName: 'Created At',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {FormatDate(row.createdAt)}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => <RowOptions id={row._id} />
  }
]

// ** Main component to display user list
const UserList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [role, setRole] = useState<string>('')
  const [plan, setPlan] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [searchQuery, setSearchQuery] = useState<string>('')

  const { data } = useSWR('GET_ALL_USERS', userAdminService.getAllUser)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    try {
      await userAdminService.searchUser(query)
    } catch (error) {
      toast.error('Failed to search users')
    }
  }

  const handleRoleChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setRole(e.target.value as string)
  }, [])

  const handlePlanChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setPlan(e.target.value as string)
  }, [])

  const handleStatusChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setStatus(e.target.value as string)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontalWithDetails.map((item: CardStatsHorizontalWithDetailsProps, index: number) => (
              <Grid item xs={12} md={3} sm={6} key={index}>
                <CardStatsHorizontalWithDetails {...item} />
              </Grid>
            ))}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Select Role'
                  SelectProps={{
                    value: role,
                    displayEmpty: true,
                    onChange: e => handleRoleChange(e)
                  }}
                >
                  <MenuItem value=''>Select Role</MenuItem>
                  <MenuItem value='admin'>Admin</MenuItem>
                  <MenuItem value='author'>Author</MenuItem>
                  <MenuItem value='editor'>Editor</MenuItem>
                  <MenuItem value='maintainer'>Maintainer</MenuItem>
                  <MenuItem value='subscriber'>Subscriber</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Select Plan'
                  SelectProps={{
                    value: plan,
                    displayEmpty: true,
                    onChange: e => handlePlanChange(e)
                  }}
                >
                  <MenuItem value=''>Select Plan</MenuItem>
                  <MenuItem value='basic'>Basic</MenuItem>
                  <MenuItem value='company'>Company</MenuItem>
                  <MenuItem value='enterprise'>Enterprise</MenuItem>
                  <MenuItem value='team'>Team</MenuItem>
                </CustomTextField>
              </Grid>
              <Grid item sm={4} xs={12}>
                <CustomTextField
                  select
                  fullWidth
                  defaultValue='Select Status'
                  SelectProps={{
                    value: status,
                    displayEmpty: true,
                    onChange: e => handleStatusChange(e)
                  }}
                >
                  <MenuItem value=''>Select Status</MenuItem>
                  <MenuItem value='pending'>Pending</MenuItem>
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='inactive'>Inactive</MenuItem>
                </CustomTextField>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader value={searchQuery} handleFilter={handleSearch} toggle={toggleAddUserDrawer} />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={
              (data?.map((item: { _id: any }) => ({ ...item, id: item._id })) ||
                data?.user.map((item: { _id: any }) => ({ ...item, id: item._id }))) ??
              []
            }
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/cards/statistics')
  const apiData: CardStatsType = res.data

  return {
    props: {
      apiData
    }
  }
}

UserList.acl = {
  action: 'read',
  subject: 'user'
}

export default UserList
