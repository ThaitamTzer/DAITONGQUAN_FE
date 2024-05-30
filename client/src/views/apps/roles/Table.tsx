// ** React Imports
import { useEffect, useCallback, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { SelectChangeEvent } from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
// import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
// import { fetchData } from 'src/store/apps/user'

// ** Types Imports
// import { RootState, AppDispatch } from 'src/store'
import { AdminsType, UsersType } from 'src/types/apps/userTypes'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/roles/TableHeader'

// ** Import Third Party
import useSWR from 'swr'
import masterAdminService from 'src/service/masterAdmin.service'

// interface UserRoleType {
//   [key: string]: { icon: string; color: string }
// }

interface UserStatusType {
  [key: string]: ThemeColor
}

interface CellType {
  row: AdminsType
}

// ** Vars
// const userRoleObj: UserRoleType = {
//   editor: { icon: 'tabler:edit', color: 'info' },
//   author: { icon: 'tabler:user', color: 'warning' },
//   admin: { icon: 'tabler:device-laptop', color: 'error' },
//   maintainer: { icon: 'tabler:chart-pie-2', color: 'success' },
//   subscriber: { icon: 'tabler:circle-check', color: 'primary' },
//   userManagement: { icon: 'tabler:users', color: 'secondary' }
// }

// const userStatusObj: UserStatusType = {
//   active: 'success',
//   pending: 'warning',
//   inactive: 'secondary'
// }

const adminStatusObj: UserStatusType = {
  isBlock: 'error',
  isActive: 'success'
}

// ** renders client column
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
    flex: 0.25,
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
              component={Link}
              href='/apps/user/view/account'
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
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

  // {
  //   flex: 0.15,
  //   field: 'role',
  //   minWidth: 170,
  //   headerName: 'Role',
  //   renderCell: ({ row }: CellType) => {
  //     return (
  //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //         <CustomAvatar
  //           skin='light'
  //           sx={{ mr: 4, width: 30, height: 30 }}
  //           color={(userRoleObj[row.role].color as ThemeColor) || 'primary'}
  //         >
  //           <Icon icon={userRoleObj[row.role].icon} />
  //         </CustomAvatar>
  //         <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
  //           {row.role}
  //         </Typography>
  //       </Box>
  //     )
  //   }
  // },
  // {
  //   flex: 0.1,
  //   minWidth: 120,
  //   headerName: 'Plan',
  //   field: 'currentPlan',
  //   renderCell: ({ row }: CellType) => {
  //     return (
  //       <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
  //         {row.currentPlan}
  //       </Typography>
  //     )
  //   }
  // },
  // {
  //   flex: 0.15,
  //   minWidth: 190,
  //   field: 'billing',
  //   headerName: 'Billing',
  //   renderCell: ({ row }: CellType) => {
  //     return (
  //       <Typography noWrap sx={{ color: 'text.secondary' }}>
  //         {row.billing}
  //       </Typography>
  //     )
  //   }
  // },
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
          color={adminStatusObj[row.isBlock ? 'inactive' : 'active']}
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
    renderCell: () => (
      <IconButton component={Link} href='/apps/user/view/account'>
        <Icon icon='tabler:eye' />
      </IconButton>
    )
  }
]

const UserList = () => {
  // ** State
  const [plan, setPlan] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const { data } = useSWR('GET_ALL_ADMIN', masterAdminService.getAllAdmin)

  console.log(data)

  // useEffect(() => {
  //   dispatch(
  //     fetchData({
  //       role: '',
  //       q: value,
  //       status: '',
  //       currentPlan: plan
  //     })
  //   )
  // }, [dispatch, plan, value])

  const handleFilter = useCallback((val: string) => {
    setValue(val)
  }, [])

  const handlePlanChange = useCallback((e: SelectChangeEvent<unknown>) => {
    setPlan(e.target.value as string)
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader plan={plan} value={value} handleFilter={handleFilter} handlePlanChange={handlePlanChange} />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={data?.map((item: { _id: any }) => ({ ...item, id: item._id })) ?? []}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserList
