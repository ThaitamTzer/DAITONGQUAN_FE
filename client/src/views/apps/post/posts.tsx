// pages/posts.js
import { Card, Typography, CardMedia, CardContent, Divider, Grid, IconButton, Button, ButtonGroup } from '@mui/material'
import { Box } from '@mui/system'
import { Fragment, useEffect } from 'react'
import Avatar from 'src/@core/components/mui/avatar'
import { usePostStore } from 'src/store/apps/posts' // Adjust the path to your store file
import Icon from 'src/@core/components/icon'

const PostsPage = () => {
  // Use the Zustand store
  const { getAllUserPosts, posts } = usePostStore(state => state)

  // Get all user posts
  useEffect(() => {
    getAllUserPosts()
  }, [])

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
    return <>{!isShow ? <Icon icon='ic:outline-lock' color='GrayText' /> : null}</>
  }
  const renderIsApproved = (isApproved: boolean) => {
    return <>{!isApproved ? <Icon icon='iconamoon:clock-thin' color='#ffcc00' /> : null}</>
  }

  const renderUser = (userId: any, updatedAt: Date | string, isShow: boolean) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='subtitle1' color='white' marginRight={2}>
          {userId.firstname} {userId.lastname}
        </Typography>
        <Typography variant='subtitle1' color='GrayText' marginRight={2}>
          {renderRelativeTime(updatedAt)}
        </Typography>
        {renderHidePost(isShow)}
        {renderIsApproved(userId.isApproved)}
      </Box>
    )
  }

  const userAvatar = (userId: any) => {
    return <Avatar src={userId.avatar} alt={userId.firstname + ' ' + userId.lastname} />
  }

  const renderContent = (content: string) => {
    return (
      <>
        {content ? (
          <Typography
            variant='body1'
            color='white'
            sx={{
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              minWidth: '100%'
            }}
          >
            {content}
          </Typography>
        ) : null}
      </>
    )
  }

  return (
    <>
      <Card>
        {posts.map(post => (
          <>
            <Grid container sx={{ padding: 3 }} key={post._id}>
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
                  marginTop: 1
                }}
              >
                {userAvatar(post.userId)}
              </Grid>
              <Grid item lg={11} md={10} xs={10} sm={11}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '-6px' }}>
                    {renderUser(post.userId, post.updatedAt, post.isShow)}
                    <IconButton size='small'>
                      <Icon icon='ri:more-fill' />
                    </IconButton>
                  </Grid>
                  <Grid item xs={11} sx={{ paddingTop: '0px !important' }}>
                    {renderContent(post.content)}
                  </Grid>
                  <Grid item xs={12} sx={{ paddingTop: '7px !important' }}>
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
                          component='img'
                          image={post.postImage}
                          alt='post image'
                        />
                      </Box>
                    ) : null}
                  </Grid>
                  <Grid item sx={{ paddingLeft: '0px !important' }}>
                    <Button color='inherit' sx={{ borderRadius: '40%' }} startIcon={<Icon icon='ph:heart' />}>
                      {post.reactionCount}
                    </Button>
                    <Button
                      color='inherit'
                      sx={{ borderRadius: '40%' }}
                      startIcon={<Icon icon='teenyicons:chat-outline' />}
                    >
                      {post.commentCount}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Divider />
          </>
        ))}
      </Card>
    </>
  )
}

export default PostsPage
