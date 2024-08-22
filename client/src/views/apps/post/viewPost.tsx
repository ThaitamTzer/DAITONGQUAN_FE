import {
  Avatar,
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Menu,
  Typography,
  MenuItem
} from '@mui/material'
import { Box } from '@mui/system'
import { CommentType, GetPostType, UpdatePostType } from 'src/types/apps/postTypes'
import Icon from 'src/@core/components/icon'
import { useContext, useState, useCallback, useEffect } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import AllComment from './AllComment'
import { commentPostState, usePostStore } from 'src/store/apps/posts'
import CommentPost from './CommentPost'
import { useReportStore } from 'src/store/apps/posts/report'
import { editPostState } from 'src/store/apps/posts'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { renderContent } from './misc/misc'
import { debounce } from 'lodash'

type PostProps = {
  post: GetPostType | undefined
  updateUserPost?: (_id: string, data: UpdatePostType) => Promise<void>
  closeEditPost?: () => void
  postId: string
  comments: CommentType[] | undefined
}

const ViewPost = (props: PostProps) => {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  const idUser: string = userData._id
  const { post, comments } = props
  const [openImage, setOpenImage] = useState<string | null>(null)
  const [selectedPostId, setSelectedPostId] = useState<string | undefined>(undefined)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [localLiked, setLocalLiked] = useState(post?.userReaction?.some(reaction => reaction.userId?._id === idUser))
  const [localReactionCount, setLocalReactionCount] = useState(post?.reactionCount || 0)

  useEffect(() => {
    setLocalLiked(post?.userReaction?.some(reaction => reaction.userId?._id === idUser))
    setLocalReactionCount(post?.reactionCount || 0)
  }, [post])

  const reactionPost = usePostStore(state => state.reactionPost)
  const deleteReactionPost = usePostStore(state => state.deleteReactionPost)
  const updatePost = usePostStore(state => state.updateUserPost)
  const openEditPost = editPostState(state => state).openEditPost
  const deletePost = usePostStore(state => state.deletePost)
  const { openCommentModalPost, closeCommentModalPost, commentPost, openCommentModal } = commentPostState(
    state => state
  )
  const addPostToFavorite = usePostStore(state => state.addPostToFavorite)
  const { handleOpenReportModal } = useReportStore(state => state)
  const ability = useContext(AbilityContext)
  const router = useRouter()

  const handleOpenImage = (id: string) => {
    setOpenImage(id)
  }

  const handleCloseImage = () => {
    setOpenImage(null)
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
      router.back()
    }
  }

  // Immediate UI update and background API request for liking a post
  const handleReaction = (_id: string, action: string) => {
    setLocalLiked(true)
    setLocalReactionCount(localReactionCount + 1)
    debouncedReactionPost(_id, action)
  }

  // Immediate UI update and background API request for unliking a post
  const handleDeleteReaction = (_id: string) => {
    setLocalLiked(false)
    setLocalReactionCount(localReactionCount - 1)
    debouncedDeleteReactionPost(_id)
  }

  // Debounced handlers to limit the rate of sending requests
  const debouncedReactionPost = useCallback(debounce(reactionPost, 200), [])
  const debouncedDeleteReactionPost = useCallback(debounce(deleteReactionPost, 200), [])

  const RenderButtonReaction = () => {
    return localLiked ? (
      <Button
        onClick={() => handleDeleteReaction(post?._id || '')}
        color='inherit'
        sx={{ borderRadius: '40%' }}
        startIcon={<Icon icon='bi:heart-fill' color='#ff0000' />}
      >
        {localReactionCount}
      </Button>
    ) : (
      <Button
        onClick={() => handleReaction(post?._id || '', 'like')}
        color='inherit'
        sx={{ borderRadius: '40%' }}
        startIcon={<Icon icon='bi:heart' color='error' />}
      >
        {localReactionCount}
      </Button>
    )
  }

  const handleMoreOptions = (event: React.MouseEvent<HTMLElement>, postId: string | undefined) => {
    setAnchorEl(event.currentTarget)
    setSelectedPostId(postId)
  }

  const handleCloseOptions = () => {
    setAnchorEl(null)
    setSelectedPostId(undefined)
  }

  const renderRelativeTime = (date: any) => {
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

  const ImageDialog = (post: GetPostType | undefined) => {
    return (
      <Dialog fullScreen key={post?._id} open={openImage === post?._id} onClose={handleCloseImage}>
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
            image={post?.postImage}
            alt='post image'
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Card id={post?._id}>
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
            ...(ability.can('read', 'member-page') ? { cursor: 'pointer' } : {})
          }}
        >
          <Avatar src={post?.userId?.avatar} alt={post?.userId?.firstname} />
        </Grid>
        <Grid item lg={11} md={10} xs={10} sm={11}>
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
                <Typography variant='subtitle1' fontWeight={'bold'} marginRight={1}>
                  {post?.userId?.firstname} {post?.userId?.lastname}
                </Typography>
                {post?.userId?.rankID?.rankIcon && (
                  <CardMedia
                    component={'img'}
                    image={post?.userId.rankID.rankIcon}
                    alt={post?.userId.rankID.rankIcon}
                    sx={{ width: '20px', height: '20px', objectFit: 'contain', borderRadius: '50%', mr: 1 }}
                    loading='lazy'
                  />
                )}
                <Typography fontSize={'14px'} color='GrayText' marginRight={2} mt={0.6}>
                  {renderRelativeTime(post?.createdAt)}
                </Typography>
              </Box>
              {ability.can('read', 'member-page') && (
                <>
                  <IconButton onClick={event => handleMoreOptions(event, post?._id)} size='small'>
                    <Icon icon='ri:more-fill' />
                  </IconButton>
                  <Menu
                    PaperProps={{
                      sx: { width: '200px' }
                    }}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedPostId === post?._id}
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
                    <MenuItem
                      onClick={() => {
                        addPostToFavorite(post?._id)
                        handleCloseOptions()
                      }}
                    >
                      <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                        <Typography variant='body1'>Favorite</Typography>
                        <Icon icon='mdi:star' color='yellow' />
                      </Box>
                    </MenuItem>
                    {post?.userId?._id !== idUser && (
                      <MenuItem
                        onClick={() => {
                          handleOpenReportModal(post?._id)
                          handleCloseOptions()
                        }}
                      >
                        <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                          <Typography variant='body1'>Report</Typography>
                          <Icon icon='fxemoji:loudspeaker' />
                        </Box>
                      </MenuItem>
                    )}
                    {post?.userId?._id === idUser && (
                      <>
                        <MenuItem
                          onClick={() => {
                            openEditPost && openEditPost(post)
                            handleCloseOptions()
                          }}
                        >
                          <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                            <Typography variant='body1'>Edit</Typography>
                            <Icon icon='eva:edit-2-fill' />
                          </Box>
                        </MenuItem>
                        {post?.isShow ? (
                          <MenuItem
                            onClick={() => {
                              handleHidePost(post?._id, {
                                isShow: false
                              })
                            }}
                          >
                            <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                              <Typography variant='body1'>Hide Post</Typography>
                              <Icon icon='eva:eye-off-fill' />
                            </Box>
                          </MenuItem>
                        ) : (
                          <MenuItem
                            onClick={() => {
                              handleHidePost(post?._id, {
                                isShow: true
                              })
                            }}
                          >
                            <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                              <Typography variant='body1'>Show Post</Typography>
                              <Icon icon='eva:eye-fill' />
                            </Box>
                          </MenuItem>
                        )}
                        <MenuItem
                          onClick={() => {
                            handleDeletePost(post?._id)
                          }}
                        >
                          <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                            <Typography variant='body1'>Delete Post</Typography>
                            <Icon icon='gg:trash' color='red' />
                          </Box>
                        </MenuItem>
                      </>
                    )}
                  </Menu>
                </>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                paddingTop: '0px !important',
                ...(ability.can('read', 'member-page') ? { cursor: 'pointer' } : {})
              }}
            >
              {renderContent(post?.content)}
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                paddingTop: '7px !important',
                ...(ability.can('read', 'member-page') ? { cursor: 'pointer' } : {})
              }}
            >
              {post?.postImage ? (
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
                    onClick={() => handleOpenImage(post?._id)}
                    component='img'
                    image={post?.postImage}
                    alt='post image'
                  />
                </Box>
              ) : null}
              {ImageDialog(post)}
            </Grid>
            {ability.can('read', 'member-page') && (
              <Grid item sx={{ paddingLeft: '0px !important' }}>
                <RenderButtonReaction />
                <Button
                  onClick={() => openCommentModalPost && openCommentModalPost(post)}
                  color='inherit'
                  sx={{ borderRadius: '40%' }}
                  startIcon={<Icon icon='teenyicons:chat-outline' />}
                >
                  {post?.commentCount}
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='body2'>Comments</Typography>
        </Grid>
        <Grid item xs={12}>
          <AllComment comments={comments} />
        </Grid>
      </Grid>
      <CommentPost
        post={post}
        closeCommentModalPost={closeCommentModalPost}
        openCommentModal={openCommentModal}
        commentPost={commentPost}
      />
    </Card>
  )
}

export default ViewPost
