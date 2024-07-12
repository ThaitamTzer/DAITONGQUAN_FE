import { useState, useContext, useMemo, useCallback } from 'react'
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import useDebounce from 'src/utils/debounce'
import Icon from 'src/@core/components/icon'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import { getInitials } from 'src/@core/utils/get-initials'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import axios from 'axios'
import useSWR, { mutate } from 'swr'
import toast from 'react-hot-toast'
import { CardStatsType } from 'src/@fake-db/types'
import { getAllUser } from 'src/types/apps/userTypes'
import { CardStatsHorizontalWithDetailsProps } from 'src/@core/components/card-statistics/types'
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddUserDrawer from 'src/views/apps/user/list/AddUserDrawer'
import userAdminService from 'src/service/userAdmin.service'

interface CellType {
  row: getAllUser
}

const FormatDate = (dateString: string | null): string | null => {
  if (dateString) {
    const dateObj = new Date(dateString)
    const day = String(dateObj.getDate()).padStart(2, '0')
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const year = dateObj.getFullYear()

    return `${day}/${month}/${year}`
  }

  return null
}

const renderClient = (row: getAllUser) => {
  if (row.avatar.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  }

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
            <Typography noWrap sx={{ fontWeight: 500, textDecoration: 'none', color: 'text.secondary' }}>
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
    renderCell: ({ row }: CellType) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.gender}
        </Typography>
      </Box>
    )
  },
  {
    flex: 0.15,
    field: 'status',
    minWidth: 170,
    headerName: 'Status',
    renderCell: ({ row }: CellType) => (
      <CustomChip
        rounded
        skin='light'
        size='small'
        label={row.isBlock ? 'Blocked' : 'Active'}
        color={row.isBlock ? 'error' : 'success'}
        sx={{ textTransform: 'capitalize' }}
      />
    )
  },
  {
    flex: 0.15,
    field: 'createdAt',
    minWidth: 170,
    headerName: 'Created At',
    renderCell: ({ row }: CellType) => (
      <Typography noWrap sx={{ color: 'text.secondary' }}>
        {FormatDate(row.createdAt)}
      </Typography>
    )
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

const UserList = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [userData, setUserData] = useState<getAllUser[] | undefined>([])
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [searchQuery, setSearchQuery] = useState<string>('')

  const { data } = useSWR('GET_ALL_USERS', userAdminService.getAllUser)

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  useMemo(() => {
    if (data) {
      setUserData(data)
    }
  }, [data])

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
          <TableHeader value={searchQuery} handleFilter={handleSearch} />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={userData?.map(item => ({ ...item, id: item._id })) ?? []}
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
