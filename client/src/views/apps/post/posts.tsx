import { Card, Typography, CardMedia, Divider, Grid, IconButton, Button, Menu, MenuItem } from '@mui/material'
import { Box } from '@mui/system'
import Icon from 'src/@core/components/icon'
import { GetPostType, UpdatePostType } from 'src/types/apps/postTypes'
import { useReportStore } from 'src/store/apps/posts/report'
import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { usePostStore, previewImageStore } from 'src/store/apps/posts'
import { UserPostsPageProps } from 'src/types/postpage'
import { ButtonApprove, ImageDialog, renderContent, RenderUser, userAvatar } from './misc/misc'
import { debounce } from 'lodash'

const PostsPage = (props: UserPostsPageProps) => {
  const {
    posts,
    approvePost,
    reactionPost,
    deleteReactionPost,
    deletePost,
    openCommentModalPost,
    addPostToFavorite,
    updatePost,
    openEditPost
  } = props

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const { handleOpenReportModal } = useReportStore(state => state)
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({})
  const [reactionsCount, setReactionsCount] = useState<{ [key: string]: number }>({})
  const deleteFavorite = usePostStore(state => state.deleteFavoritePost)
  const { openImage, handleOpenImage, handleCloseImage } = previewImageStore()
  const rejectPost = usePostStore(state => state.rejectPost)
  const ability = useContext(AbilityContext)
  const router = useRouter()

  useEffect(() => {
    const initialLikedPosts: { [key: string]: boolean } = {}
    const initialReactionsCount: { [key: string]: number } = {}
    posts?.forEach(post => {
      initialLikedPosts[post._id] = post.userReaction.some((reaction: any) => reaction.userId === idUser)
      initialReactionsCount[post._id] = post.reactionCount
    })

    setLikedPosts(initialLikedPosts)
    setReactionsCount(initialReactionsCount)
  }, [posts])

  const RenderButtonReaction = ({ postId }: { postId: string }) => {
    const isLiked = likedPosts[postId]

    return isLiked ? (
      <Button
        onClick={() => onReactionDeleteClick(postId)}
        color='inherit'
        sx={{ borderRadius: '40%' }}
        startIcon={<Icon icon='bi:heart-fill' color='#ff0000' />}
      >
        {reactionsCount[postId]}
      </Button>
    ) : (
      <Button
        onClick={() => onReactionClick(postId, 'like')}
        color='inherit'
        sx={{ borderRadius: '40%' }}
        startIcon={<Icon icon='bi:heart' color='error' />}
      >
        {reactionsCount[postId]}
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

  const handleReaction = (_id: string, action: string) => {
    setLikedPosts(prevState => ({
      ...prevState,
      [_id]: true
    }))
    setReactionsCount(prevState => ({
      ...prevState,
      [_id]: (prevState[_id] ?? 0) + 1
    }))
    if (reactionPost) {
      reactionPost(_id, action)
    }
  }

  const handleDeleteReaction = (_id: string) => {
    setLikedPosts(prevState => ({
      ...prevState,
      [_id]: false
    }))
    setReactionsCount(prevState => ({
      ...prevState,
      [_id]: (prevState[_id] ?? 1) - 1
    }))
    if (deleteReactionPost) {
      deleteReactionPost(_id)
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleReaction = useCallback(debounce(handleReaction, 200), [])
  const debouncedHandleDeleteReaction = useCallback(debounce(handleDeleteReaction, 200), [])

  // Use the debounced function in your component
  const onReactionClick = (_id: string, action: string) => {
    debouncedHandleReaction(_id, action)
  }

  const onReactionDeleteClick = (_id: string) => {
    debouncedHandleDeleteReaction(_id)
  }

  const handleMoreOptions = (event: React.MouseEvent<HTMLElement>, postId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedPostId(postId)
  }

  const handleCloseOptions = () => {
    setAnchorEl(null)
    setSelectedPostId(null)
  }

  const handleAddPostToFavorite = async (_id: string) => {
    if (addPostToFavorite) {
      toast.promise(addPostToFavorite(_id), {
        loading: 'Adding to favorite...',
        success: 'Added to favorite!',
        error: 'Error adding to favorite'
      })
    }
  }

  const handleDeleteFavorite = async (_id: string) => {
    toast.promise(deleteFavorite(_id), {
      loading: 'Deleting from favorite...',
      success: 'Deleted from favorite!',
      error: 'Error deleting from favorite'
    })
  }

  const handleOpenEditPost = (data: GetPostType) => {
    if (openEditPost) {
      openEditPost(data)
    }
  }

  const handleHidePost = async (_id: string, data: UpdatePostType) => {
    if (updatePost) {
      toast.promise(updatePost(_id, data), {
        loading: 'Hiding post...',
        success: 'Post hidden!',
        error: 'Error hiding post'
      })
      handleCloseOptions()
    }
  }

  const handleDeletePost = async (_id: string) => {
    if (deletePost) {
      toast.promise(deletePost(_id), {
        loading: 'Deleting post...',
        success: 'Post deleted!',
        error: 'Error deleting post'
      })
      handleCloseOptions()
    }
  }

  const handleClickNavigate = (post: any) => {
    const scrollPosition = window.scrollY.toString()
    localStorage.setItem('scrollPosition', scrollPosition)
    const currentPath = router.pathname
    const newPath = `${currentPath}/${post._id}`
    router.push(newPath)
  }

  useEffect(() => {
    const handleRouteChange = () => {
      const scrollPosition = localStorage.getItem('scrollPosition')
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition, 10))
        localStorage.removeItem('scrollPosition')
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  const idUser: string = userData._id
  const currentPath = useRouter().asPath

  return (
    <Card>
      {posts?.map(post => (
        <Fragment key={post._id}>
          <Grid id={post._id} container sx={{ padding: 3 }}>
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
                marginTop: 2
              }}
            >
              {userAvatar(post.userId)}
            </Grid>
            <Grid item lg={11} md={10} xs={10} sm={11}>
              <Grid container spacing={2}>
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
                  {RenderUser(
                    post.userId,
                    post.createdAt,
                    post.isShow,
                    post.isApproved,
                    post.status,
                    post.userId?.rankID
                  )}
                  {ability.can('read', 'member-page') && (
                    <>
                      <IconButton onClick={event => handleMoreOptions(event, post._id)} size='small'>
                        <Icon icon='ri:more-fill' />
                      </IconButton>
                      <Menu
                        PaperProps={{
                          sx: { width: '200px' }
                        }}
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedPostId === post._id}
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
                        {currentPath.includes('favorite') ? (
                          <MenuItem
                            onClick={() => {
                              handleDeleteFavorite(post._id)
                              handleCloseOptions()
                            }}
                          >
                            <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                              <Typography variant='body1'>Unfavored</Typography>
                              <Icon icon='mdi:star' color='yellow' />
                            </Box>
                          </MenuItem>
                        ) : (
                          <MenuItem
                            onClick={() => {
                              handleAddPostToFavorite(post._id)
                              handleCloseOptions()
                            }}
                          >
                            <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                              <Typography variant='body1'>Favorite</Typography>
                              <Icon icon='mdi:star' color='yellow' />
                            </Box>
                          </MenuItem>
                        )}
                        {post.userId?._id !== idUser && (
                          <MenuItem
                            onClick={() => {
                              handleOpenReportModal(post._id)
                              handleCloseOptions()
                            }}
                          >
                            <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                              <Typography variant='body1'>Report</Typography>
                              <Icon icon='fxemoji:loudspeaker' />
                            </Box>
                          </MenuItem>
                        )}
                        {post.userId?._id === idUser && (
                          <>
                            <MenuItem
                              onClick={() => {
                                handleOpenEditPost(post)
                                handleCloseOptions()
                              }}
                            >
                              <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                                <Typography variant='body1'>Edit</Typography>
                                <Icon icon='eva:edit-2-fill' />
                              </Box>
                            </MenuItem>
                            {post.isShow ? (
                              <MenuItem
                                onClick={() =>
                                  handleHidePost(post._id, {
                                    isShow: false
                                  })
                                }
                              >
                                <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                                  <Typography variant='body1'>Hide Post</Typography>
                                  <Icon icon='eva:eye-off-fill' />
                                </Box>
                              </MenuItem>
                            ) : (
                              <MenuItem
                                onClick={() =>
                                  handleHidePost(post._id, {
                                    isShow: true
                                  })
                                }
                              >
                                <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                                  <Typography variant='body1'>Show Post</Typography>
                                  <Icon icon='eva:eye-fill' />
                                </Box>
                              </MenuItem>
                            )}
                            <MenuItem
                              onClick={() => {
                                handleDeletePost(post._id)
                                handleCloseOptions()
                              }}
                            >
                              <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                                <Typography variant='body1'>Delete post</Typography>
                                <Icon icon='gg:trash' color='red' />
                              </Box>
                            </MenuItem>
                          </>
                        )}
                      </Menu>
                    </>
                  )}
                </Grid>
                {ability.can('read', 'member-page') ? (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      paddingTop: '0px !important',
                      ...(ability.can('read', 'member-page') ? { cursor: 'pointer' } : {})
                    }}
                    onClick={() => handleClickNavigate(post)}
                  >
                    {renderContent(post.content)}
                  </Grid>
                ) : (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      paddingTop: '0px !important'
                    }}
                  >
                    {renderContent(post.content)}
                  </Grid>
                )}
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
                        onClick={() => handleOpenImage(post._id)}
                        component='img'
                        loading='eager'
                        image={post.postImage}
                        alt='post image'
                      />
                    </Box>
                  ) : null}
                  {ImageDialog(post, openImage, handleCloseImage)}
                </Grid>
                {ability.can('read', 'member-page') && (
                  <Grid item sx={{ paddingLeft: '0px !important' }}>
                    <RenderButtonReaction postId={post._id} />
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
                {approvePost && post.status === 'rejected' && (
                  <Grid item xs={12}>
                    <Grid container justifyContent={'right'}>
                      <Button variant='contained' startIcon={<Icon icon='fluent:text-change-reject-24-regular' />}>
                        Rejected
                      </Button>
                    </Grid>
                  </Grid>
                )}
                {post.status !== 'rejected' && (
                  <>
                    {approvePost && (
                      <Grid item container direction={'row'} justifyContent={'right'} spacing={2}>
                        <ButtonApprove
                          isApproved={post.isApproved}
                          _id={post._id}
                          handleApprove={() => handleApprove(post._id, true)}
                        />
                        {!post.isApproved && (
                          <Grid item xs={2}>
                            <Grid container justifyContent={'right'}>
                              <Button
                                variant='contained'
                                startIcon={<Icon icon='fluent:text-change-reject-24-regular' />}
                                onClick={() => rejectPost(post._id)}
                              >
                                Reject
                              </Button>
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                    )}
                  </>
                )}
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
