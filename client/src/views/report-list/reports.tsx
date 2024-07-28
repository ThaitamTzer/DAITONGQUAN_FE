import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { ReportType, StatusType } from 'src/types/apps/reportTypes'
import { getInitials } from 'src/@core/utils/get-initials'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon'
import { useReportStore } from 'src/store/apps/posts/report'
import MenuOptions from './menu'
import { forEach } from 'lodash'

type ViewReportProps = {
  reports: ReportType[] | undefined
}

export const renderClient = (row: any) => {
  if (row?.userId?.avatar.length > 0) {
    return <CustomAvatar src={row.userId.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  }

  return (
    <CustomAvatar
      skin='light'
      sx={{ mr: 2.5, width: 38, height: 38, fontWeight: 500, fontSize: theme => theme.typography.body1.fontSize }}
    >
      {getInitials(row?.userId?.firstname + ' ' + row?.userId?.lastname)}
    </CustomAvatar>
  )
}

const handleStatusColor = (status: string | undefined) => {
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

const ViewReports = (props: ViewReportProps) => {
  const { reports } = props
  console.log(reports)

  const { handleOpenPreviewReportModal, handleOpenOptionMenu, handleDeleteReport } = useReportStore(state => state)

  const handleCapperCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  return (
    <Card>
      <CardHeader title={<Typography variant='h2'>Report List</Typography>}></CardHeader>
      <CardContent sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {/* <Box mr={1}>
          <FilterType />
        </Box>
        <Box mr={1}>
          <FilterReport />
        </Box>
        <Box>
          <FilterPostOwner />
        </Box> */}
      </CardContent>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant='h6'>The violator</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h6'>Post</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h6'>Status</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='h6'>Action</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports?.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {renderClient(row.post)}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          flexDirection: 'row'
                        }}
                      >
                        <Typography noWrap sx={{ fontWeight: 500, textDecoration: 'none', color: 'text.secondary' }}>
                          {row.post.userId?.firstname + ' ' + row.post.userId?.lastname}
                        </Typography>
                        {row.post.userId?.isBlock && <Icon icon='tabler:lock' />}
                      </Box>
                      <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                        {row.post.userId?.rankID ? row.post.userId?.rankID.rankName : 'No Rank'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography variant='body1'>{row.post.content}</Typography>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Chip
                    label={handleCapperCase(row?.report[0]?.status)}
                    color={handleStatusColor(row?.report[0]?.status)}
                  />
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      p: 0
                    }}
                  >
                    <IconButton onClick={() => handleOpenPreviewReportModal(row)}>
                      <Icon icon='tabler:eye' />
                    </IconButton>
                    {row?.report?.find(rp => rp?.status !== 'rejected') && (
                      <IconButton
                        onClick={e => {
                          handleOpenOptionMenu(row, e)
                        }}
                      >
                        <Icon icon='tabler:edit' />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => {
                        forEach(row.report, rp => {
                          handleDeleteReport(rp._id)
                        })
                      }}
                    >
                      <Icon icon='tabler:trash' />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <MenuOptions />
    </Card>
  )
}

export default ViewReports
