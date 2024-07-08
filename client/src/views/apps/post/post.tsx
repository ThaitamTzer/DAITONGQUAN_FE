import { Avatar, Button, CardMedia, Dialog, DialogContent, Grid, IconButton, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { GetPostType, UpdatePostType } from 'src/types/apps/postTypes'
import { RenderUser } from './posts'
import Icon from 'src/@core/components/icon'
import { useContext, useState } from 'react'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import EmojiPicker, { EmojiClickData, EmojiStyle, SuggestionMode, Theme } from 'emoji-picker-react'
import themeConfig from 'src/configs/themeConfig'
import { useTheme } from '@mui/material'
import { useSettings } from 'src/@core/hooks/useSettings'
import toast from 'react-hot-toast'

type PostProps = {
  post: GetPostType
  updateUserPost: (_id: string, data: UpdatePostType) => Promise<void>
  closeEditPost: () => void
}

const Post = (props: PostProps) => {
  const { post, updateUserPost, closeEditPost } = props
  const [openImage, setOpenImage] = useState<string | null>(null)
  const [content, setContent] = useState<string>(post.content)
  const [open, setOpen] = useState<boolean>(false)

  const theme = useTheme()
  const { settings } = useSettings()
  const ability = useContext(AbilityContext)

  const handleOpenImage = (id: string) => {
    setOpenImage(id)
  }

  const handleCloseImage = () => {
    setOpenImage(null)
  }

  const handleClickOpen = () => {
    if (open) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  const handleTheme = () => {
    if (themeConfig.mode === 'dark' && settings.mode === 'dark') {
      return Theme.DARK
    }
    if (settings.mode === 'light') {
      return Theme.LIGHT
    }
  }

  const onChangeContent = (e: any) => {
    const editedPost = e.target.value
    setContent(editedPost)
  }

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setContent(content + emojiObject.emoji)
  }

  const handleSubmit = async (_id: string, content: string) => {
    toast.promise(updateUserPost(_id, { content: content }), {
      loading: 'Updating post...',
      success: 'Post updated successfully',
      error: 'Error updating post'
    })
    closeEditPost()
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
        <Avatar src={post.userId.avatar} alt={post.userId.firstname} />
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
            {RenderUser(post.userId, post.createdAt, post.isShow, post.isApproved)}
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              paddingTop: '0px !important',
              ...(ability.can('read', 'member-page') ? { cursor: 'pointer' } : {})
            }}
          >
            <TextField
              id='content'
              fullWidth
              value={content}
              onChange={onChangeContent}
              placeholder='Write something here...'
              multiline
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
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button onClick={closeEditPost}>Cancel</Button>
        <Button onClick={() => handleSubmit(post._id, content)}>Save</Button>
      </Grid>
    </Grid>
  )
}

export default Post
