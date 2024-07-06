import { Card, Typography, CardMedia, Divider, Grid, IconButton, Button, Menu, MenuItem } from '@mui/material'
import { Box } from '@mui/system'
import Avatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import { GetPostType } from 'src/types/apps/postTypes'
import React, { Fragment, useContext } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import toast from 'react-hot-toast'

type UserPostsPageProps = {
  posts: GetPostType[]
  children?: React.ReactNode
  approvePost?: (_id: string, isApproved: boolean) => Promise<void>
  reactionPost?: (_id: string, action: string) => Promise<void>
  deleteReactionPost?: (_id: string) => Promise<void>
  openCommentModalPost?: (data: GetPostType) => void
}

const renderRelativeTime = (date: Date | string) => {
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

const renderHidePost = (isShow: boolean) => {
  return !isShow ? <Icon icon='ic:outline-lock' color='GrayText' /> : null
}

const renderIsApproved = (isApproved: boolean) => {
  return !isApproved ? <Icon icon='iconamoon:clock-thin' color='#ffcc00' /> : null
}

export const RenderUser = (userId: any, updatedAt: Date | string, isShow: boolean, isApproved: boolean) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant='subtitle1' fontWeight={'bold'} marginRight={2}>
        {userId?.firstname} {userId?.lastname}
      </Typography>
      <Typography fontSize={'14px'} color='GrayText' marginRight={2} mt={0.6}>
        {renderRelativeTime(updatedAt)}
      </Typography>
      {renderHidePost(isShow)}
      {renderIsApproved(isApproved)}
    </Box>
  )
}

export const renderContent = (content: string) => {
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

const PostsPage = (props: UserPostsPageProps) => {
  const { posts, children, approvePost, reactionPost, deleteReactionPost, openCommentModalPost } = props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedPostId, setSelectedPostId] = React.useState<string | null>(null)
  const ability = useContext(AbilityContext)

  const RenderButtonReaction = ({ isLiked, post }: { isLiked: boolean; post: any }) => {
    return isLiked ? (
      <Button
        onClick={() => handleDeleteReaction(post._id)}
        color='inherit'
        sx={{ borderRadius: '40%' }}
        startIcon={<Icon icon='bi:heart-fill' color='#ff0000' />}
      >
        {post.reactionCount}
      </Button>
    ) : (
      <Button
        onClick={() => handleReaction(post._id, 'like')}
        color='inherit'
        sx={{ borderRadius: '40%' }}
        startIcon={<Icon icon='bi:heart' color='error' />}
      >
        {post.reactionCount}
      </Button>
    )
  }

  const handleApprove = async (_id: string, data: boolean) => {
    if (approvePost) {
      toast.promise(approvePost(_id, data), {
        loading: 'Approving...',
        success: 'Approved!',
        error: 'Error approving post'
      })
    }
  }

  const handleReaction = async (_id: string, action: string) => {
    if (reactionPost) {
      await reactionPost(_id, action)
    }
  }

  const handleDeleteReaction = async (_id: string) => {
    if (deleteReactionPost) {
      await deleteReactionPost(_id)
    }
  }

  const handleMoreOptions = (event: React.MouseEvent<HTMLElement>, postId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedPostId(postId)
  }

  const handleCloseOptions = () => {
    setAnchorEl(null)
    setSelectedPostId(null)
  }

  const userAvatar = (userId: any) => {
    return <Avatar src={userId?.avatar} alt={`${userId?.firstname} ${userId?.lastname}`} />
  }

  const ButtonApprove = ({ isApproved, _id }: { isApproved: boolean; _id: string }) => {
    return !isApproved ? (
      <Grid item xs={12}>
        <Grid container justifyContent={'right'}>
          <Grid item>
            <Button
              variant='contained'
              color='primary'
              startIcon={<Icon icon='ph:clock-duotone' />}
              onClick={() => handleApprove(_id, true)}
            >
              Approve
            </Button>
          </Grid>
        </Grid>
      </Grid>
    ) : (
      <Grid item xs={12}>
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

  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  const idUser: string = userData._id

  return (
    <Card>
      {posts.map(post => (
        <Fragment key={post._id}>
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
                alignContent: 'space-between',
                marginTop: 2,
                ...(ability.can('read', 'member-page') ? { cursor: 'pointer' } : {})
              }}
            >
              {userAvatar(post.userId)}
            </Grid>
            <Grid item lg={11} md={10} xs={10} sm={11}>
              <Grid
                container
                spacing={2}

                // onClick={() => console.log('jahjdhajs')}
                // sx={{ ...(ability.can('read', 'member-page') ? { cursor: 'pointer' } : {}) }}
              >
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '-6px',
                    ...(ability.can('read', 'member-page') ? { cursor: 'pointer' } : {})
                  }}
                >
                  {RenderUser(post.userId, post.createdAt, post.isShow, post.isApproved)}
                  <IconButton onClick={event => handleMoreOptions(event, post._id)} size='small'>
                    <Icon icon='ri:more-fill' />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedPostId === post._id}
                    onClose={handleCloseOptions}
                  >
                    <MenuItem
                      onClick={() => {
                        handleApprove(post._id, true)
                        handleCloseOptions()
                      }}
                    >
                      Approve
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleApprove(post._id, false)
                        handleCloseOptions()
                      }}
                    >
                      Disapprove
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDeleteReaction(post._id)
                        handleCloseOptions()
                      }}
                    >
                      Delete Reaction
                    </MenuItem>
                  </Menu>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    paddingTop: '0px !important',
                    ...(ability.can('read', 'member-page') ? { cursor: 'pointer' } : {})
                  }}
                >
                  {renderContent(post.content)}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    paddingTop: '7px !important',
                    ...(ability.can('read', 'member-page') ? { cursor: 'pointer' } : {})
                  }}
                >
                  {post.postImage ? (
                    <Box
                      sx={{
                        width: 'fit-content'
                      }}
                    >
                      <CardMedia
                        sx={{
                          width: '100%',
                          maxHeight: '430px',
                          objectFit: 'contain',
                          objectPosition: 'left top',
                          borderRadius: 1
                        }}
                        onClick={() => window.open(post.postImage, '_blank')}
                        component='img'
                        image={post.postImage}
                        alt='post image'
                      />
                    </Box>
                  ) : null}
                </Grid>
                {ability.can('read', 'member-page') && (
                  <Grid item sx={{ paddingLeft: '0px !important' }}>
                    <RenderButtonReaction
                      isLiked={post.userReaction.some(reaction => reaction.userId._id === idUser)}
                      post={post}
                    />
                    <Button
                      onClick={() => openCommentModalPost && openCommentModalPost(post)}
                      color='inherit'
                      sx={{ borderRadius: '40%' }}
                      startIcon={<Icon icon='teenyicons:chat-outline' />}
                    >
                      {post.commentCount}
                    </Button>
                  </Grid>
                )}
                {ability.can('approve', 'post') && <ButtonApprove isApproved={post.isApproved} _id={post._id} />}
                {children}
              </Grid>
            </Grid>
          </Grid>
          <Divider />
        </Fragment>
      ))}
    </Card>
  )
}

export default PostsPage
