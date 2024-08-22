import { Avatar, Button, CardMedia, Dialog, DialogContent, Grid, IconButton, Typography, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon'
import { RankId } from 'src/types/apps/userTypes'

export const renderRelativeTime = (date: Date | string) => {
  const currentDate = new Date()
  const postDate = new Date(date)
  const diff = currentDate.getTime() - postDate.getTime()
  const seconds = diff / 1000
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  const months = days / 30
  const years = months / 12

  if (years >= 1) {
    return `${postDate.getDate()}/${postDate.getMonth() + 1}/${postDate.getFullYear()}`
  }
  if (months >= 1) {
    return `${Math.floor(months)} months ago`
  }
  if (days >= 1) {
    return `${Math.floor(days)} days ago`
  }
  if (hours >= 1) {
    return `${Math.floor(hours)} hours ago`
  }
  if (minutes >= 1) {
    return `${Math.floor(minutes)} minutes ago`
  }

  return `${Math.floor(seconds)} seconds ago`
}

export const renderHidePost = (isShow: boolean | undefined) => {
  return !isShow ? <Icon icon='ic:outline-lock' color='GrayText' /> : null
}

export const renderIsApproved = (isApproved: boolean | undefined) => {
  return !isApproved ? <Icon icon='iconamoon:clock-thin' color='#ffcc00' /> : null
}

export const renderRejected = (status?: string) => {
  return status === 'rejected' ? (
    <>
      <IconButton>
        <Icon icon='ci:stop-sign' color='error' />
      </IconButton>
    </>
  ) : null
}

export const userAvatar = (userId: any) => {
  return <Avatar src={userId?.avatar} alt={`${userId?.firstname} ${userId?.lastname}`} />
}

export const RenderUser = (
  userId: any,
  updatedAt: any,
  isShow: boolean | undefined,
  isApproved: boolean | undefined,
  status?: string | undefined,
  rankID?: RankId | undefined
) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant='subtitle1' fontWeight={'bold'} marginRight={1}>
        {userId?.firstname} {userId?.lastname}
      </Typography>
      {rankID && (
        <CardMedia
          component={'img'}
          image={rankID?.rankIcon}
          alt={rankID?.rankName}
          sx={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '50%', mr: 1 }}
          loading='lazy'
        />
      )}
      <Typography fontSize={'14px'} color='GrayText' marginRight={2} mt={0.6}>
        {renderRelativeTime(updatedAt)}
      </Typography>
      {renderHidePost(isShow)}
      {status ? renderRejected(status) : renderIsApproved(isApproved)}
    </Box>
  )
}

export const renderContent = (content: string | undefined) => {
  return content ? (
    <Typography
      variant='body1'
      sx={{
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        minWidth: '100%'
      }}
    >
      {content}
    </Typography>
  ) : null
}

export const ImageDialog = (post: any, openImage: string, handleCloseImage: any) => {
  // Assuming handleCloseImage is defined to set openImage to null or false
  return (
    <Dialog
      fullScreen
      key={post._id}
      open={openImage === post._id}
      onClose={handleCloseImage} // This will trigger on clicking outside or pressing escape
    >
      <DialogContent sx={{ py: '0px !important', px: '60px !important' }} onClick={() => handleCloseImage()}>
        {/* Close Button */}
        <IconButton
          onClick={handleCloseImage}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            margin: 1
          }}
        >
          <Icon icon='eva:close-fill' width={40} height={40} />
        </IconButton>
        {/* Image */}
        <CardMedia
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
          component='img'
          image={post.postImage}
          alt='post image'
        />
      </DialogContent>
    </Dialog>
  )
}

export const ButtonApprove = ({
  isApproved,
  _id,
  handleApprove
}: {
  isApproved: boolean
  _id: string
  handleApprove: (id: string, isApproved: boolean) => Promise<void>
}) => {
  return !isApproved ? (
    <Grid item xs={2}>
      <Grid container justifyContent={'right'}>
        <Grid item>
          <Button
            variant='contained'
            color='primary'
            startIcon={<Icon icon='ph:clock-duotone' />}
            onClick={() => handleApprove(_id, isApproved)}
          >
            Approve
          </Button>
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <Grid item xs={2}>
      <Grid container justifyContent={'right'}>
        <Grid item>
          <Button variant='contained' color='success' startIcon={<Icon icon='icon-park-twotone:check-one' />}>
            Approved
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
