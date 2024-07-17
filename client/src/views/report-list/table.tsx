import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  Box,
  Button
} from '@mui/material'
import { IconButton } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useReportStore } from 'src/store/apps/posts/report'
import { ReportType, StatusType } from 'src/types/apps/reportTypes'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { useTheme } from '@mui/material/styles'
import React, { ChangeEvent } from 'react'

export default function TableReportList() {
  const {
    handleFilterReportStatus,
    handleFilterReportType,
    noData,
    reportList,
    reportId,
    handleOpenBlockPostModal,
    handleOpenBlockUserModal,
    handleOpenReportModal,
    handleOpenAlreadyBlockedPostModal,
    handleOpenAlreadyBlockedUserModal,
    setReportId
  } = useReportStore()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState('all')
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [selectedType, setSelectedType] = React.useState('all')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMoreOptions = (event: React.MouseEvent<HTMLElement>, _id: string) => {
    setAnchorEl(event.currentTarget)
    setReportId(_id)
  }

  const handleCloseOptions = () => {
    setAnchorEl(null)
    setReportId('')
  }

  const handleStatusColor = (status: StatusType) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'Processed':
        return 'success'
      case 'rejected':
        return 'error'
      default:
        return 'default'
    }
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(1)
  }

  const renderClient = (row: ReportType) => {
    if (row.userId?.avatar.length > 0) {
      return <CustomAvatar src={row.userId.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
    }

    return (
      <CustomAvatar
        skin='light'
        sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
      >
        {getInitials(row.userId?.firstname + ' ' + row.userId?.lastname)}
      </CustomAvatar>
    )
  }

  const handleUnDerline = (text: string) => {
    return <Typography sx={{ textDecorationLine: 'underline' }}>{text}</Typography>
  }

  const FilterReport = () => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setSelected(value)
      handleFilterReportStatus(value)
    }

    return (
      <TextField select label='Status' value={selected} size='small' onChange={handleChange} sx={{ width: 150 }}>
        <MenuItem value='all'>All</MenuItem>
        <MenuItem value='pending'>Pending</MenuItem>
        <MenuItem value='Processed'>Processed</MenuItem>
        <MenuItem value='rejected'>Rejected</MenuItem>
      </TextField>
    )
  }

  const FilterType = () => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setSelectedType(value)
      handleFilterReportType(value)
    }

    return (
      <TextField select label='Type' value={selectedType} size='small' onChange={handleChange} sx={{ width: 150 }}>
        <MenuItem value='all'>All</MenuItem>
        <MenuItem value='spam'>Spam</MenuItem>
        <MenuItem value='harassment'>Harassment</MenuItem>
        <MenuItem value='violence'>Violence</MenuItem>
        <MenuItem value='hate'>Hate</MenuItem>
      </TextField>
    )
  }

  const NoDataLoGo = () => {
    return (
      <TableRow>
        <TableCell colSpan={mobile ? 1 : 4}>
          <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' p={5}>
            <Typography variant='h6'>No Data</Typography>
            <CardMedia
              sx={{
                width: '60%',
                objectFit: 'contain'
              }}
              component='img'
              image={
                'https://res.cloudinary.com/dtvhqvucg/image/upload/v1721118123/unsuccessful-state-feedback_v5wmol.png'
              }
              alt='post image'
            />
          </Box>
        </TableCell>
      </TableRow>
    )
  }

  // Calculate the paginated reports
  const paginatedReports = reportList.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  return (
    <Card>
      <CardHeader title={<Typography variant='h2'>Report List</Typography>}></CardHeader>
      <CardContent sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box mr={1}>
          <FilterType />
        </Box>
        <Box>
          <FilterReport />
        </Box>
      </CardContent>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {mobile ? (
              <TableRow>
                <TableCell>
                  <Typography variant='h6'>Report Content</Typography>
                </TableCell>
                <TableCell sx={{ px: '0 !important' }} align='right'></TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell>
                  <Typography variant='h6'>Author</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='h6'>Type</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='h6'>Content</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant='h6'>Status</Typography>
                </TableCell>
                {!mobile ? (
                  <TableCell align='right'>
                    <Typography variant='h6'>Action</Typography>
                  </TableCell>
                ) : (
                  <TableCell></TableCell>
                )}
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {noData && <NoDataLoGo />}
            {paginatedReports.map(report =>
              !mobile ? (
                <TableRow key={report._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {renderClient(report)}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                        <Typography noWrap sx={{ fontWeight: 500, textDecoration: 'none', color: 'text.secondary' }}>
                          {report.userId?.firstname + ' ' + report.userId?.lastname}
                        </Typography>
                        <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                          {report.userId?.rankID ? report.userId?.rankID : 'No Rank'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography>{report.reportType}</Typography>
                  </TableCell>
                  <TableCell
                    sx={{
                      wordBreak: 'break-all', // Changed from wordWrap to wordBreak
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {mobile ? (
                      <Typography
                        sx={{
                          wordBreak: 'break-all', // Apply here as well for consistency
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {report.reportContent.length > 20
                          ? report.reportContent.substring(0, 20) + '...'
                          : report.reportContent}
                      </Typography>
                    ) : (
                      report.reportContent
                    )}
                  </TableCell>
                  <TableCell align='center'>
                    <Chip
                      label={report.status}
                      color={handleStatusColor(report.status)}
                      sx={{ height: 24, fontSize: '0.75rem' }}
                    />
                  </TableCell>
                  <TableCell align='right'>
                    <Box display={'flex'} justifyContent={'flex-end'}>
                      {mobile ? (
                        <IconButton>
                          <Icon icon='mingcute:more-2-fill' />
                        </IconButton>
                      ) : (
                        <>
                          <IconButton>
                            <Icon icon='weui:eyes-on-outlined' />
                          </IconButton>
                          {report.status === 'Processed' ? (
                            <IconButton onClick={() => handleOpenAlreadyBlockedUserModal()}>
                              <Icon icon='solar:user-block-linear' />
                            </IconButton>
                          ) : (
                            <IconButton onClick={() => handleOpenBlockUserModal(report._id)}>
                              <Icon icon='solar:user-block-linear' />
                            </IconButton>
                          )}

                          {report.postId.status === 'blocked' ? (
                            <IconButton onClick={() => handleOpenAlreadyBlockedPostModal()}>
                              <Icon icon='streamline:browser-block' />
                            </IconButton>
                          ) : (
                            <IconButton onClick={() => handleOpenBlockPostModal(report._id)}>
                              <Icon icon='streamline:browser-block' />
                            </IconButton>
                          )}

                          <IconButton onClick={() => handleOpenReportModal(report._id)}>
                            <Icon icon='tdesign:delete' />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={report._id}>
                  <TableCell sx={{ bgcolor: handleStatusColor(report.status) }}>
                    <Typography
                      sx={{
                        wordBreak: 'break-all', // Apply here as well for consistency
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {handleUnDerline('User: ' + report.userId?.firstname + ' ' + report.userId?.lastname)} -{' '}
                      {report.reportType}: {report.reportContent}
                    </Typography>
                  </TableCell>
                  <TableCell
                    align='right'
                    sx={{
                      px: '5px !important'
                    }}
                  >
                    <IconButton onClick={event => handleMoreOptions(event, report._id)}>
                      <Icon icon='mingcute:more-2-fill' />
                    </IconButton>
                    <Menu
                      id='simple-menu'
                      PaperProps={{
                        sx: { width: '200px' }
                      }}
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && reportId === report._id}
                      onClose={handleCloseOptions}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                      }}
                    >
                      <MenuItem>
                        <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                          <Typography variant='body1'>View Post</Typography>
                          <Icon icon='weui:eyes-on-outlined' />
                        </Box>
                      </MenuItem>
                      <MenuItem>
                        <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                          <Typography variant='body1'>Block User</Typography>
                          <Icon icon='solar:user-block-linear' />
                        </Box>
                      </MenuItem>
                      <MenuItem>
                        <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                          <Typography variant='body1'>Block Post</Typography>
                          <Icon icon='streamline:browser-block' />
                        </Box>
                      </MenuItem>
                      <MenuItem>
                        <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                          <Typography variant='body1'>Delete Report</Typography>
                          <Icon icon='tdesign:delete' />
                        </Box>
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              )
            )}
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
            count={Math.ceil(reportList.length / rowsPerPage)}
            color='primary'
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      </TableContainer>
    </Card>
  )
}
