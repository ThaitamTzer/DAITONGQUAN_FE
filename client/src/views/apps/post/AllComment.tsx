import { CommentType, RepliesComment } from 'src/types/apps/postTypes'
import React from 'react'
import { Avatar, Box, Button, Divider, Grid, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { renderContent } from './posts'
import Icon from 'src/@core/components/icon'
import { userDataStore } from 'src/store/apps/posts'
import ReplyCommentModal from './ReplieComment'
import { repliesCommentState, commentPostState, editCommentState } from 'src/store/apps/posts'
import toast from 'react-hot-toast'
import EditComment from './EditComment'

type CommentProps = {
  comments: CommentType[]
}

export const RenderRelativeTime = (date: Date | string) => {
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
  const [visibleReplies, setVisibleReplies] = React.useState<{ [key: string]: number }>({})
  const { comments } = props
  const { openReplies, comment, handleOpenReplies, handleCloseReplies, handleReplyComment } = repliesCommentState(
    state => state
  )
  const {
    openEditCommentModal,
    openEditReplyModal,
    updateComment,
    updateReplyComment,
    closeEditCommentModal,
    closeEditReplyModal,
    deleteReplyComment
  } = editCommentState(state => state)
  const handleDeleteComment = commentPostState(state => state.handleDeleteComment)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedCommentId, setSelectedCommentId] = React.useState<string | null>(null)
  const [selectedReplyId, setSelectedReplyId] = React.useState<string | null>(null)

  const handleMoreOptions = (event: React.MouseEvent<HTMLElement>, _id: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedCommentId(_id)
    setSelectedReplyId(_id)
  }

  const handleCloseOptions = () => {
    setAnchorEl(null)
    setSelectedCommentId(null)
    setSelectedReplyId(null)
  }

  const handleOpenEditComment = (content: string, _id: string) => {
    openEditCommentModal(content, _id)
    setAnchorEl(null)
  }

  const handleOpenEditReply = (content: string, _id: string, commentId: string) => {
    openEditReplyModal(content, _id, commentId)
    setAnchorEl(null)
  }

  const handleSubmitEditComment = async (_id: string, comment: string) => {
    toast.promise(updateComment(_id, comment), {
      loading: 'Updating...',
      success: 'Comment updated successfully',
      error: 'Failed to update comment'
    })
    setAnchorEl(null)
    closeEditCommentModal()
  }

  const handleSubmitEditReplyComment = async (commentId: string, replyId: string, selectedReplyComment: string) => {
    toast.promise(updateReplyComment(commentId, replyId, selectedReplyComment), {
      loading: 'Updating...',
      success: 'Comment updated successfully',
      error: 'Failed to update comment'
    })
    setAnchorEl(null)
    closeEditReplyModal()
  }

  const handleDelete = (commentId: string) => {
    if (handleDeleteComment) {
      toast.promise(handleDeleteComment(commentId), {
        loading: 'Deleting...',
        success: 'Comment deleted successfully',
        error: 'Failed to delete comment'
      })
      setAnchorEl(null)
    }
  }

  const handleDeleteReply = (commentId: string, replyId: string) => {
    if (deleteReplyComment) {
      toast.promise(deleteReplyComment(commentId, replyId), {
        loading: 'Deleting...',
        success: 'Comment deleted successfully',
        error: 'Failed to delete comment'
      })
      setAnchorEl(null)
    }
  }

  const handleSeeMore = (commentId: string) => {
    setVisibleReplies(prevState => ({
      ...prevState,
      [commentId]: (prevState[commentId] || 1) + 5
    }))
  }

  const userLocal = userDataStore(state => state.userLocal)
  const currentUser = userLocal._id

  console.log(comments)

  return (
    <>
      {comments.map((comment: CommentType) => (
        <React.Fragment key={comment._id}>
          <Divider />
          <Grid container xs={12}>
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
                        {RenderRelativeTime(comment.createdAt)}
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
                  <Grid container>
                    <Button
                      key={comment._id}
                      onClick={() => handleOpenReplies && handleOpenReplies(comment)}
                      color='inherit'
                      sx={{ borderRadius: '40%' }}
                      startIcon={<Icon icon='teenyicons:chat-outline' />}
                    >
                      {comment.repliesComment?.length || 0}
                    </Button>
                  </Grid>
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
                {currentUser === comment.userId._id ? (
                  <>
                    <IconButton onClick={event => handleMoreOptions(event, comment._id)}>
                      <Icon icon='ri:more-fill' />
                    </IconButton>
                    <Menu
                      PaperProps={{
                        sx: { width: '200px' }
                      }}
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedCommentId === comment._id}
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
                      <MenuItem onClick={() => handleOpenEditComment(comment.content, comment._id)}>
                        <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                          <Typography variant='body1'>Edit</Typography>
                          <Icon icon='eva:edit-2-fill' />
                        </Box>
                      </MenuItem>
                      <MenuItem onClick={() => handleDelete(comment._id)}>
                        <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                          <Typography variant='body1'>Delete Comment</Typography>
                          <Icon icon='gg:trash' color='red' />
                        </Box>
                      </MenuItem>
                    </Menu>
                  </>
                ) : null}
              </Grid>
            </Grid>
            {comment.repliesComment
              .slice(-visibleReplies[comment._id] || -1)
              .reverse()
              .map(reply => (
                <>
                  <Divider />
                  <Grid key={reply._id} container justifyContent={'flex-end'} pt={'0 !important'}>
                    <Grid container xs={11.5} pt={'0 !important'} sx={{ padding: 3, justifyContent: 'flex-end' }}>
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
                        <Avatar src={reply.userId?.avatar} alt={reply.userId?.lastname} />
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
                                {reply.userId?.firstname} {reply.userId?.lastname}
                              </Typography>
                              <Typography fontSize={'14px'} color='GrayText' marginRight={2} mt={0.6}>
                                {RenderRelativeTime(reply.createdAt)}
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
                            {renderContent(reply.content)}
                          </Grid>
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
                        {currentUser === reply.userId._id ? (
                          <>
                            <IconButton onClick={event => handleMoreOptions(event, reply._id)}>
                              <Icon icon='ri:more-fill' />
                            </IconButton>
                            <Menu
                              PaperProps={{
                                sx: { width: '200px' }
                              }}
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl) && selectedReplyId === reply._id}
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
                              <MenuItem onClick={() => handleOpenEditReply(reply.content, reply._id, comment._id)}>
                                <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                                  <Typography variant='body1'>Edit</Typography>
                                  <Icon icon='eva:edit-2-fill' />
                                </Box>
                              </MenuItem>
                              <MenuItem onClick={() => handleDeleteReply(comment._id, reply._id)}>
                                <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                                  <Typography variant='body1'>Delete Comment</Typography>
                                  <Icon icon='gg:trash' color='red' />
                                </Box>
                              </MenuItem>
                            </Menu>
                          </>
                        ) : null}
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              ))}
          </Grid>
          {comment.repliesComment.length > (visibleReplies[comment._id] || 1) && (
            <Grid container justifyContent={'flex-end'} mb={3}>
              <Grid item xs={10.5}>
                <Button variant='text' sx={{ p: '0px !important' }} onClick={() => handleSeeMore(comment._id)}>
                  see more
                </Button>
              </Grid>
            </Grid>
          )}
        </React.Fragment>
      ))}
      <ReplyCommentModal
        openReplies={openReplies}
        handleCloseReplies={handleCloseReplies}
        handleReplyComment={handleReplyComment}
        comment={comment}
      />
      <EditComment
        openEditCommentModal={editCommentState(state => state.openEditComment)}
        onCloseEditCommentModal={editCommentState(state => state.closeEditCommentModal)}
        selectedReplyComment={editCommentState(state => state.selectedComment)}
        onSubmiteditComment={handleSubmitEditComment}
      />
      <EditComment
        openEditCommentModal={editCommentState(state => state.opentEditReply)}
        selectedReplyComment={editCommentState(state => state.selectedReplyComment)}
        onCloseEditCommentModal={editCommentState(state => state.closeEditReplyModal)}
        onSubmiteditReplyComment={handleSubmitEditReplyComment}
      />
    </>
  )
}

export default AllComment
