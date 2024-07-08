import {
  Avatar,
  CardMedia,
  Dialog,
  DialogContent,
  Grid,
  useMediaQuery,
  Divider,
  TextField,
  Typography,
  DialogActions,
  Button,
  IconButton,
  DialogTitle
} from '@mui/material'
import { CommentPostState } from 'src/store/apps/posts'
import { renderContent, RenderUser } from './posts'
import Icon from 'src/@core/components/icon'
import { Box } from '@mui/system'
import React from 'react'
import { useTheme } from '@mui/material/styles'
import EmojiPicker from 'emoji-picker-react'
import { EmojiStyle } from 'emoji-picker-react'
import { SuggestionMode } from 'emoji-picker-react'
import { EmojiClickData } from 'emoji-picker-react'
import { Theme } from 'emoji-picker-react'
import themeConfig from 'src/configs/themeConfig'
import { useSettings } from 'src/@core/hooks/useSettings'
import useDebounce from 'src/utils/debounce'
import toast from 'react-hot-toast'

const CommentPost = (props: CommentPostState) => {
  const { post, openCommentModal, closeCommentModalPost, scroll, commentPost } = props
  const [open, setOpen] = React.useState<boolean>(false)
  const [comment, setComment] = React.useState('')
  const debouncedComment = useDebounce(comment, 500)

  const { settings } = useSettings()
  const handleClickOpen = () => {
    if (open && openCommentModal) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  const handleCloseModal = () => {
    closeCommentModalPost()
    setOpen(false)
    setComment('')
  }

  const handleTheme = () => {
    if (themeConfig.mode === 'dark' && settings.mode === 'dark') {
      return Theme.DARK
    }
    if (settings.mode === 'light') {
      return Theme.LIGHT
    }
  }

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setComment(value)
  }

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setComment(comment + emojiObject.emoji)
  }

  const data = {
    postId: post._id,
    content: debouncedComment as string
  }

  const commentPostHandler = async () => {
    if (commentPost) {
      toast.promise(commentPost(data), {
        loading: 'Commenting...',
        success: 'Commented!',
        error: 'Error commenting post'
      })
    }

    handleCloseModal()
  }

  return (
    <Grid item xs={12}>
      <Dialog
        scroll={scroll}
        fullScreen={fullScreen}
        fullWidth
        maxWidth='sm'
        open={openCommentModal}
        onClose={closeCommentModalPost}
        PaperProps={{ sx: { borderRadius: 2 } }}
        sx={{
          '.MuiDialog-paper': {
            borderRadius: 2,
            boxShadow: 0,
            overflow: 'visible'
          }
        }}
      >
        {fullScreen ? (
          <DialogTitle>
            <Grid container>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='h6' fontWeight={'bold'}>
                  Comment Post
                </Typography>
                <IconButton onClick={handleCloseModal}>
                  <Icon icon='eva:close-fill' />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>
          </DialogTitle>
        ) : null}
        <DialogContent>
          <Grid container spacing={3}>
            <Grid
              item
              lg={1}
              md={1.5}
              xs={2}
              sm={1}
              sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            >
              <Grid
                item
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  alignContent: 'space-between',
                  marginTop: 1
                }}
              >
                <Avatar src={post.userId?.avatar} alt='user avatar' sx={{ mr: 2 }} />
              </Grid>
              <Grid item xs={12} lg={12}>
                <Divider orientation='vertical' sx={{ mr: 2, mt: 2, borderWidth: '1.5px' }} />
              </Grid>
            </Grid>
            <Grid item lg={11} md={10} xs={10} sm={11}>
              <Grid container spacing={3}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '-6px' }}>
                  {RenderUser(post.userId, post.updatedAt, post.isShow, post.isApproved)}
                </Grid>
                <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
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
                <Grid item sx={{ paddingLeft: '0px !important' }}></Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid
              item
              lg={1}
              md={1.5}
              xs={2}
              sm={1}
              sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            >
              <Grid
                item
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  alignContent: 'space-between',
                  marginTop: 1
                }}
              >
                <Avatar src={post.userId?.avatar} alt='user avatar' sx={{ mr: 2 }} />
              </Grid>
              <Grid item xs={12} lg={12}>
                <Divider orientation='vertical' sx={{ mr: 2, mt: 2, borderWidth: '1.5px' }} />
              </Grid>
            </Grid>
            <Grid item lg={11} md={10} xs={10} sm={11}>
              <Grid container spacing={3}>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '-6px' }}>
                  {/* {RenderUser(post.userId, post.updatedAt, post.isShow, post.isApproved)} */}
                  <Typography variant='subtitle1' fontWeight={'bold'} marginRight={2}>
                    {post.userId?.firstname} {post.userId?.lastname}
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                  <TextField
                    id='comment'
                    placeholder={`Comment for ${post.userId?.firstname} ${post.userId?.lastname}...`}
                    value={comment}
                    onChange={onChange}
                    multiline
                    fullWidth
                    sx={{
                      fontSize: '14px',
                      fontWeight: '400',
                      color: 'text.primary',
                      padding: '0px !important',
                      borderWidth: '0px !important',
                      '.MuiOutlinedInput-notchedOutline': {
                        borderWidth: '0px !important'
                      },

                      '.Mui-focused': {
                        outline: 'none !important',
                        boxShadow: 'none !important'
                      },
                      '.MuiOutlinedInput-input': {
                        padding: '0px !important'
                      },
                      '.MuiInputBase-multiline': {
                        padding: '0px !important'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ pt: '0px !important', pl: '0px !important' }}>
                  <IconButton onClick={() => handleClickOpen()}>
                    <Icon icon='iconoir:emoji' />
                  </IconButton>
                </Grid>
                <Grid item xs={12}>
                  <EmojiPicker
                    style={{ boxShadow: ` ${theme.shadows[3]}` }}
                    open={open}
                    width={'100%'}
                    emojiStyle={EmojiStyle.NATIVE}
                    skinTonesDisabled={true}
                    lazyLoadEmojis={true}
                    theme={handleTheme()}
                    onEmojiClick={handleEmojiClick}
                    suggestedEmojisMode={SuggestionMode.RECENT}
                    previewConfig={{
                      defaultCaption: 'Recent',
                      showPreview: false
                    }}
                  />
                </Grid>
                {/* <Grid item xs={12} sx={{ paddingTop: '7px !important' }}>
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
                </Grid> */}
                {/* <Grid item sx={{ paddingLeft: '0px !important' }}></Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
          <Button variant='contained' onClick={() => commentPostHandler()}>
            Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default CommentPost
