import { CommentType } from 'src/types/apps/postTypes'
import { usePostStore } from 'src/store/apps/posts'
import { useEffect } from 'react'
import { Avatar, Box, Button, Card, CardMedia, Grid, IconButton, Typography } from '@mui/material'
import { renderContent, RenderUser } from './posts'
import Icon from 'src/@core/components/icon'
import { userDataStore } from 'src/store/apps/posts'
import ReplyCommentModal from './ReplieComment'
import { repliesCommentState } from 'src/store/apps/posts'

type CommentProps = {
  comments: CommentType[]
}

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

const AllComment = (props: CommentProps) => {
  const { comments } = props
  const { openReplies, comment, handleOpenReplies, handleCloseReplies, handleReplyComment } = repliesCommentState(
    state => state
  )

  console.log(comments)

  const RenderMoreOptions = ({ userId }: { userId: string }) => {
    const userLocal = userDataStore(state => state.userLocal)
    const currentUser = userLocal._id

    if (currentUser === userId) {
      return (
        <IconButton>
          <Icon icon='ri:more-fill' />
        </IconButton>
      )
    }

    return null
  }

  return (
    <>
      {comments.map((comment: CommentType) => (
        <>
          <Grid container sx={{ padding: 3 }}>
            <Grid
              item
              lg={1}
              md={1.5}
              xs={2}
              sm={1}
              sx={{
                display: 'grid',
                placeItems: 'center',
                alignContent: 'space-between'
              }}
            >
              <Avatar src={comment.userId?.avatar} alt={comment.userId?.firstname} />
            </Grid>
            <Grid item lg={10} md={9} xs={10} sm={10}>
              <Grid container spacing={2}>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant='subtitle1' fontWeight={'bold'} marginRight={2}>
                      {comment.userId?.firstname} {comment.userId?.lastname}
                    </Typography>
                    <Typography fontSize={'14px'} color='GrayText' marginRight={2} mt={0.6}>
                      {renderRelativeTime(comment.createdAt)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    paddingTop: '0px !important'
                  }}
                >
                  {renderContent(comment.content)}
                </Grid>

                <Button
                  onClick={() => handleOpenReplies && handleOpenReplies(comment)}
                  color='inherit'
                  sx={{ borderRadius: '40%' }}
                  startIcon={<Icon icon='teenyicons:chat-outline' />}
                >
                  {comment.repliesComment?.length || 0}
                </Button>
              </Grid>
            </Grid>
            <Grid
              item
              lg={1}
              md={1}
              xs={1}
              sm={1}
              sx={{
                display: 'flex',
                justifyContent: 'right',
                alignItems: 'start'
              }}
            >
              <RenderMoreOptions userId={`${comment.userId._id}`} />
            </Grid>
          </Grid>
        </>

        // <Grid item key={comment._id} xs={12}>
        //   <Grid
        //     key={comment._id}
        //     container
        //     spacing={2}
        //     sx={{
        //       my: 3,
        //       alignItems: 'center',
        //     }}
        //   >
        //     <Grid item xs={1}>
        //       <Avatar src={comment.userId?.avatar} alt={comment.userId?.firstname} />
        //     </Grid>
        //     <Grid item xs={11}>
        //       <Typography variant='h6'>
        //         {comment.userId?.firstname +
        //           ' ' +
        //           comment.userId?.lastname +
        //           ' ' +
        //           renderRelativeTime(comment.createdAt)}
        //       </Typography>
        //     </Grid>
        //   </Grid>
        // </Grid>
      ))}
      <ReplyCommentModal
        openReplies={openReplies}
        handleCloseReplies={handleCloseReplies}
        handleReplyComment={handleReplyComment}
        comment={comment}
      />
    </>
  )
}

export default AllComment
