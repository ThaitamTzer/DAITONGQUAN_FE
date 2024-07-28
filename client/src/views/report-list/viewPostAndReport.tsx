import {
  CardMedia,
  Dialog,
  DialogProps,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'
import { useReportStore } from 'src/store/apps/posts/report'
import DialogWithCustomCloseButton from '../components/dialog/customDialog'
import { Box } from '@mui/system'
import { renderClient } from './reports'
import Icon from 'src/@core/components/icon'
import { useState } from 'react'
import { useRouter } from 'next/router'

const PreviewReport = () => {
  const { report, openPreviewReportModal, handleClosePreviewReportModal, handleOpenOptionMenu } = useReportStore(
    state => state
  )
  const [scroll] = useState<DialogProps['scroll']>('paper')
  const router = useRouter()

  const handleNavigateToPost = () => {
    router.push(`/posts/${report.post?._id}`)
  }

  return (
    <Dialog
      scroll={scroll}
      maxWidth='md'
      fullWidth
      open={openPreviewReportModal}
      onClose={handleClosePreviewReportModal}
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible'
        }
      }}
    >
      <DialogTitle>
        <Typography variant='h2'>Report Preview</Typography>
      </DialogTitle>
      <DialogWithCustomCloseButton handleClose={handleClosePreviewReportModal}>
        <Grid container spacing={3}>
          <Grid item container xs={12}>
            <Grid item xs={11}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {renderClient(report.post)}

                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                  <Typography noWrap sx={{ fontWeight: 500, textDecoration: 'none', color: 'text.secondary' }}>
                    {report.post?.userId?.firstname + ' ' + report.post?.userId?.lastname}
                  </Typography>

                  <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                    {report.post?.userId?.rankID ? report.post?.userId?.rankID.rankName : 'No Rank'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item container justifyContent={'flex-end'} xs={1}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <Tooltip placement='top' arrow title='To the post'>
                  <IconButton onClick={handleNavigateToPost}>
                    <Icon icon='majesticons:open-line' />
                  </IconButton>
                </Tooltip>
                <IconButton
                  onClick={e => {
                    handleOpenOptionMenu(report, e)
                  }}
                >
                  <Icon icon='ri:more-fill' />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
          <Grid item container spacing={3} xs={12} ml={9}>
            <Grid item xs={12}>
              <Typography variant='body1'>{report.post?.content}</Typography>
            </Grid>
            {report.post?.postImage && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    width: '100%'
                  }}
                >
                  <CardMedia
                    component='img'
                    alt='Post Image'
                    loading='lazy'
                    image={report.post?.postImage}
                    sx={{
                      width: '70%'
                    }}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12}>
            <Divider>REPORT</Divider>
          </Grid>
          <Grid item container spacing={3} xs={12}>
            {report.report?.map((item, index) => (
              <Grid key={item._id} item container spacing={2} xs={12}>
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {renderClient(item)}

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                        <Typography noWrap sx={{ fontWeight: 500, textDecoration: 'none', color: 'text.secondary' }}>
                          {item?.userId?.firstname + ' ' + item?.userId?.lastname}
                        </Typography>
                        <Typography
                          noWrap
                          sx={{ fontWeight: 500, textDecoration: 'none', color: 'text.secondary' }}
                          ml={1}
                        >
                          {item?.userId?.rankID ? item?.userId?.rankID?.rankName : 'No Rank'}
                        </Typography>
                      </Box>
                      <Typography
                        noWrap
                        sx={{
                          fontWeight: 500,
                          textDecoration: 'none',
                          color: 'text.secondary',
                          textDecorationLine: 'underline'
                        }}
                      >
                        Reported Type: {item.reportType.toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {item.reportContent && (
                  <Grid item xs={12} ml={12}>
                    <Typography
                      sx={{
                        wordBreak: 'break-word'
                      }}
                    >
                      Content: {item.reportContent}
                    </Typography>
                  </Grid>
                )}
                {report.report.length > 1 && (
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                )}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </DialogWithCustomCloseButton>
    </Dialog>
  )
}

export default PreviewReport
