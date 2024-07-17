import { useState, ChangeEvent, MouseEvent } from 'react'
import { GetPostType } from 'src/types/apps/postTypes'
import { Box } from '@mui/system'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import IconButton from '@mui/material/IconButton'
import TableSortLabel from '@mui/material/TableSortLabel'
import Pagination from '@mui/material/Pagination'
import Icon from 'src/@core/components/icon'
import { Card, CardHeader, Paper, Typography, MenuItem, TextField, Skeleton } from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { visuallyHidden } from '@mui/utils'

// Sorting utility functions
const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T) => {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }

  return 0
}

const getComparator = <Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key
): ((a: { [key in Key]: any }, b: { [key in Key]: any }) => number) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const stableSort = <T,>(array: T[], comparator: (a: T, b: T) => number) => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order

    return a[1] - b[1]
  })

  return stabilizedThis.map(el => el[0])
}

// PostList props
type PostListProps = {
  listPost: GetPostType[]
  loading: boolean
  openModalPost: (data: GetPostType) => void
  closeModalPost: () => void
}

const PostList = (props: PostListProps) => {
  const { listPost, loading, openModalPost } = props

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = useState<keyof GetPostType>('createdAt')

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(1)
  }

  const handleRequestSort = (event: MouseEvent<unknown>, property: keyof GetPostType) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const renderClient = (row: GetPostType) => {
    if (row.userId?.avatar.length) {
      return <CustomAvatar src={row.userId?.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
    }

    return (
      <CustomAvatar
        skin='light'
        color='info'
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row.userId?.firstname + ' ' + row.userId?.lastname)}
      </CustomAvatar>
    )
  }

  const handleDate = (date: Date | string) => {
    const d = new Date(date)
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)

    return `${da}/${mo}/${ye}`
  }

  const sortedPosts = stableSort(listPost, getComparator(order, orderBy))
  const paginatedPosts = sortedPosts.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const handleOpenModal = (data: GetPostType) => {
    openModalPost(data)
  }

  return (
    <Card>
      <CardHeader title={<Typography variant='h2'>List Posts</Typography>} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'userId.firstname'}
                  direction={orderBy === 'userId.firstname' ? order : 'asc'}
                  onClick={event => handleRequestSort(event, 'userId.firstname')}
                >
                  Author
                  {orderBy === 'userId.firstname' ? (
                    <Box component='span' sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'content'}
                  direction={orderBy === 'content' ? order : 'asc'}
                  onClick={event => handleRequestSort(event, 'content')}
                >
                  Content
                  {orderBy === 'content' ? (
                    <Box component='span' sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderBy === 'createdAt' ? order : 'asc'}
                  onClick={event => handleRequestSort(event, 'createdAt')}
                >
                  Created At
                  {orderBy === 'createdAt' ? (
                    <Box component='span' sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'updatedAt'}
                  direction={orderBy === 'updatedAt' ? order : 'asc'}
                  onClick={event => handleRequestSort(event, 'updatedAt')}
                >
                  Updated At
                  {orderBy === 'updatedAt' ? (
                    <Box component='span' sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'isApproved'}
                  direction={orderBy === 'isApproved' ? order : 'asc'}
                  onClick={event => handleRequestSort(event, 'isApproved')}
                >
                  Approve
                  {orderBy === 'isApproved' ? (
                    <Box component='span' sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel>Actions</TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from(new Array(rowsPerPage)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant='rectangular' width={38} height={38} />
                      <Skeleton variant='text' width={100} height={20} />
                      <Skeleton variant='text' width={80} height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant='text' width={300} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant='text' width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant='text' width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant='text' width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant='text' width={100} />
                    </TableCell>
                  </TableRow>
                ))
              : paginatedPosts.map((row: GetPostType) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {renderClient(row)}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                          <Typography noWrap sx={{ fontWeight: 500, textDecoration: 'none', color: 'text.secondary' }}>
                            {row.userId?.firstname + ' ' + row.userId?.lastname}
                          </Typography>
                          <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                            {row.userId?.rankID ? row.userId?.rankID : 'No Rank'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {row.content.length > 50 ? `${row.content.slice(0, 50)}...` : row.content}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{handleDate(row.createdAt)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{handleDate(row.updatedAt)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{row.isApproved ? 'Approved' : 'In Process'}</Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenModal(row)}>
                        <Icon icon='lucide:edit' />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant='body2' sx={{ color: 'text.secondary', mr: 2 }}>
              Rows per page:
            </Typography>
            <TextField
              select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              size='small'
              sx={{ width: '80px' }}
            >
              {[5, 10, 25, 50, 100].map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Pagination
            count={Math.ceil(listPost.length / rowsPerPage)}
            color='primary'
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      </TableContainer>
    </Card>
  )
}

PostList.acl = {
  action: 'read',
  subject: 'post'
}
export default PostList
