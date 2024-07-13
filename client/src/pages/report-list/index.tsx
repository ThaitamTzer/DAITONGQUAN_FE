import { Avatar, Card, Grid, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useReportStore } from 'src/store/apps/posts/report'

export default function ReportListPage() {
  const { getAllReports, reportList } = useReportStore()

  useEffect(() => {
    getAllReports()
  }, [])

  return (
    <Grid container direction={'column'}>
      <Grid item container xs={12} direction={'row'}>
        <Grid item xs={3}>
          <Typography variant={'h4'}>Report Author</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant={'h4'}>Type</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant={'h4'}>Content</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant={'h4'}>Action</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {reportList.map(report => (
          <Grid item xs={12} key={report._id} spacing={3}>
            <Grid item container xs={12}>
              <Grid item xs={12}>
                <Card sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Grid item container xs={3}>
                    <Grid item xs={2} display={'flex'} justifyContent={'center'}>
                      <Avatar src={report.userId?.avatar} />
                    </Grid>
                    <Grid item container spacing={1} xs={10} alignItems={'center'}>
                      <Grid item>
                        <Typography variant={'h6'}>{report.userId?.firstname}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant={'h6'}>{report.userId?.lastname}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          // <Card key={report._id} sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          //   <Grid item container alignItems={'center'} my={3} spacing={3}>
          //     <Grid item sm={6} xs={12} lg={3}>
          //       <Grid item xs={2} display={'flex'} justifyContent={'center'}>
          //         <Avatar src={report.userId?.avatar} />
          //       </Grid>
          //       <Grid item xs={10} alignItems={'center'}>
          //         <Grid item mr={1}>
          //           <Typography variant={'h6'}>{report.userId?.firstname}</Typography>
          //         </Grid>
          //         <Grid item>
          //           <Typography variant={'h6'}>{report.userId?.lastname}</Typography>
          //         </Grid>
          //       </Grid>
          //     </Grid>
          //     <Grid item sm={12} xs={12} lg={1}>
          //       <Typography variant={'h6'}>{report.reportType}</Typography>
          //     </Grid>
          //     <Grid item xs={12} lg={6}>
          //       <Typography variant={'h6'}>{report.reportContent}</Typography>
          //     </Grid>
          //   </Grid>
          // </Card>
        ))}
      </Grid>
    </Grid>
  )
}

ReportListPage.acl = {
  action: 'read',
  subject: 'report'
}
