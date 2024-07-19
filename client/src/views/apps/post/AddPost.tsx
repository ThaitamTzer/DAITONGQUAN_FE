import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
  CardMedia
} from '@mui/material'
import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import { Box } from '@mui/system'
import EmojiPicker, { EmojiClickData, EmojiStyle, SuggestionMode } from 'emoji-picker-react'
import { useTheme } from '@mui/material/styles'
import { Theme } from 'emoji-picker-react'
import themeConfig from 'src/configs/themeConfig'
import { useSettings } from 'src/@core/hooks/useSettings'
import styled from '@emotion/styled'
import { usePostStore } from 'src/store/apps/posts'
import toast from 'react-hot-toast'
import DialogWithCustomCloseButton from 'src/views/components/dialog/customDialog'

const AddPost = () => {
  const [openAddPostDialog, setOpenAddPostDialog] = useState<boolean>(false)
  const [openEmoji, setOpenEmoji] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [image, setImage] = useState<File | null>()
  const [addPost, setAddPost] = useState<string>('')
  const addPostHandler = usePostStore(state => state.addPost)

  const userData = localStorage.getItem('userData')
  const user = userData && JSON.parse(userData)
  const theme = useTheme()
  const { settings } = useSettings()

  const handleCloseAddPostDialog = () => {
    setOpenAddPostDialog(false)
    setOpenEmoji(false)
    setAddPost('')
    setPreviewImage('')
    setImage(null)
  }
  const handleClickOpen = () => {
    if (openEmoji) {
      setOpenEmoji(false)
    } else {
      setOpenEmoji(true)
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

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setAddPost(addPost + emojiObject.emoji)
  }

  const openAddPostDialogHandler = () => {
    setOpenAddPostDialog(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)
      setImage(file)
      setPreviewImage(imageUrl)
    }
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
  })

  const handleAddPost = async () => {
    const data = {
      content: addPost,
      file: image || undefined
    }
    toast.promise(addPostHandler(data), {
      loading: 'Posting...',
      success: 'Post added successfully',
      error: 'Error adding post'
    })
    handleCloseAddPostDialog()
  }

  return (
    <Grid container xs={12} sx={{ padding: 3 }}>
      <Grid container xs={10} sx={{ display: 'flex', alignItems: 'center' }}>
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
          <Avatar src={user?.avatar} />
        </Grid>
        <Grid item xs={10}>
          <TextField
            onClick={openAddPostDialogHandler}
            fullWidth
            placeholder='What is on your mind?'
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
              },
              ':hover': {
                cursor: 'text'
              }
            }}
          />
          <Dialog
            open={openAddPostDialog}
            sx={{
              '.MuiDialog-paper': {
                overflow: 'visible'
              }
            }}
            onClose={handleCloseAddPostDialog}
            fullWidth
          >
            <DialogWithCustomCloseButton handleClose={handleCloseAddPostDialog}>
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
                    <Avatar src={user?.avatar} alt='user avatar' sx={{ mr: 2 }} />
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <Divider orientation='vertical' sx={{ mr: 2, mt: 2, borderWidth: '1.5px' }} />
                  </Grid>
                </Grid>
                <Grid item lg={11} md={10} xs={10} sm={11}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '-6px' }}>
                      <Typography variant='subtitle1' fontWeight={'bold'} marginRight={2}>
                        {user?.firstname} {user?.lastname}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                      <TextField
                        id='add-post'
                        placeholder='Say something...'
                        value={addPost}
                        onChange={e => setAddPost(e.target.value)}
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
                    <Grid item xs={12} sx={{ paddingTop: '0px !important' }}>
                      {previewImage && (
                        <Grid item xs={12} sx={{ paddingTop: '7px !important' }}>
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
                              image={previewImage}
                              alt='Preview image'
                            />
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                    <Grid item xs={12} sx={{ pt: '0px !important', pl: '0px !important' }}>
                      <IconButton onClick={() => handleClickOpen()}>
                        <Icon icon='iconoir:emoji' />
                      </IconButton>
                      <IconButton component='label'>
                        <VisuallyHiddenInput type='file' accept='image/*' hidden onChange={handleImageChange} />
                        <Icon icon='carbon:image-copy' />
                      </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                      <EmojiPicker
                        style={{ boxShadow: ` ${theme.shadows[3]}` }}
                        open={openEmoji}
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
              </Grid>
            </DialogWithCustomCloseButton>
            <DialogActions>
              <Grid container justifyContent={'right'} spacing={2}>
                <Grid item xs={2}>
                  <Button fullWidth variant='outlined' onClick={handleCloseAddPostDialog}>
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={2}>
                  <Button fullWidth variant='contained' onClick={handleAddPost}>
                    Post
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
      <Grid
        item
        xs={2}
        sx={{
          display: 'grid',
          placeItems: 'center',
          alignContent: 'space-between',
          marginTop: 2
        }}
      >
        <Button fullWidth variant='outlined' onClick={openAddPostDialogHandler}>
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            Post
          </Typography>
        </Button>
      </Grid>
    </Grid>
  )
}

export default AddPost
