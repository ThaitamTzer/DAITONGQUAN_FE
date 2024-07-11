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
import { renderContent } from './posts'
import Icon from 'src/@core/components/icon'
import { useContext, useState } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import AllComment from './AllComment'
import { commentPostState, usePostStore } from 'src/store/apps/posts'
import CommentPost from './CommentPost'

type PostProps = {
  post: GetPostType | any
  updateUserPost?: (_id: string, data: UpdatePostType) => Promise<void>
  closeEditPost?: () => void
  postId: string
  comments: CommentType[]
}

const ViewPost = (props: PostProps) => {
  const { post, comments } = props
  const [openImage, setOpenImage] = useState<string | null>(null)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const reactionPost = usePostStore(state => state.reactionPost)
  const deleteReactionPost = usePostStore(state => state.deleteReactionPost)
  const { openCommentModalPost, closeCommentModalPost, commentPost, setScroll, scroll, openCommentModal } =
    commentPostState(state => state)
  const addPostToFavorite = usePostStore(state => state.addPostToFavorite)

  const ability = useContext(AbilityContext)

  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  const idUser: string = userData._id

  const handleOpenImage = (id: string) => {
    setOpenImage(id)
  }

  const handleCloseImage = () => {
    setOpenImage(null)
  }

  const RenderButtonReaction = ({ isLiked, post }: { isLiked: boolean; post: any }) => {
    return isLiked ? (
      <Button
        onClick={() => deleteReactionPost(post._id)}
        color='inherit'
        sx={{ borderRadius: '40%' }}
        startIcon={<Icon icon='bi:heart-fill' color='#ff0000' />}
      >
        {post.reactionCount}
      </Button>
    ) : (
      <Button
        onClick={() => reactionPost(post._id, 'like')}
        color='inherit'
        sx={{ borderRadius: '40%' }}
        startIcon={<Icon icon='bi:heart' color='error' />}
      >
        {post.reactionCount}
      </Button>
    )
  }

  const handleMoreOptions = (event: React.MouseEvent<HTMLElement>, postId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedPostId(postId)
  }
  const handleCloseOptions = () => {
    setAnchorEl(null)
    setSelectedPostId(null)
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

  const ImageDialog = (post: any) => {
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

  return (
    <Card>
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
          <Avatar src={post.userId?.avatar} alt={post.userId?.firstname} />
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
                <Typography variant='subtitle1' fontWeight={'bold'} marginRight={2}>
                  {post.userId?.firstname} {post.userId?.lastname}
                </Typography>
                <Typography fontSize={'14px'} color='GrayText' marginRight={2} mt={0.6}>
                  {renderRelativeTime(post.createdAt)}
                </Typography>
                {/* {renderHidePost(isShow)}
                {renderIsApproved(isApproved)} */}
              </Box>
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
                  <MenuItem
                    onClick={() => {
                      addPostToFavorite(post._id)
                      handleCloseOptions()
                    }}
                  >
                    <Box width={'100%'} display='flex' justifyContent='space-between' alignItems={'center'}>
                      <Typography variant='body1'>Favorite</Typography>
                      <Icon icon='mdi:star' color='yellow' />
                    </Box>
                  </MenuItem>
                </Menu>
              </>
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
                    onClick={() => handleOpenImage(post._id)}
                    component='img'
                    image={post.postImage}
                    alt='post image'
                  />
                </Box>
              ) : null}
              {ImageDialog(post)}
            </Grid>
            <Grid item sx={{ paddingLeft: '0px !important' }}>
              <RenderButtonReaction
                isLiked={post.userReaction?.some((reaction: any) => reaction.userId === idUser)}
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
        scroll={scroll}
        setScroll={setScroll}
        closeCommentModalPost={closeCommentModalPost}
        openCommentModal={openCommentModal}
        commentPost={commentPost}
      />
    </Card>
  )
}

export default ViewPost
