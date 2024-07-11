import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogProps,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { repliesCommentState } from 'src/store/apps/posts'
import { CommentType, ReplyComment } from 'src/types/apps/postTypes'
import DialogWithCustomCloseButton from 'src/views/components/dialog/customDialog'
import { renderRelativeTime } from './AllComment'
import React from 'react'
import Icon from 'src/@core/components/icon'
import { useSettings } from 'src/@core/hooks/useSettings'
import themeConfig from 'src/configs/themeConfig'
import { useTheme } from '@mui/material/styles'
import EmojiPicker, { EmojiClickData, EmojiStyle, SuggestionMode, Theme } from 'emoji-picker-react'
import toast from 'react-hot-toast'

type RepliesCommentProps = {
  handleCloseReplies: () => void
  handleReplyComment: (_id: string, comment: string) => Promise<void>
  openReplies: boolean
  comment: CommentType
}

const ReplyCommentModal = (props: RepliesCommentProps) => {
  const { openReplies, handleCloseReplies, handleReplyComment, comment } = props
  const [scroll] = React.useState<DialogProps['scroll']>('paper')
  const [open, setOpen] = React.useState<boolean>(false)
  const [replyComment, setReplyComment] = React.useState('')

  const theme = useTheme()
  const { settings } = useSettings()
  const handleClickOpen = () => {
    if (open && openReplies) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }

  const handleCloseModal = () => {
    handleCloseReplies()
    setOpen(false)
    setReplyComment('')
  }

  const handleTheme = () => {
    if (themeConfig.mode === 'dark' && settings.mode === 'dark') {
      return Theme.DARK
    }
    if (settings.mode === 'light') {
      return Theme.LIGHT
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setReplyComment(value)
  }

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setReplyComment(replyComment + emojiObject.emoji)
  }

  const handleSubmit = (_id: string, content: string) => {
    toast.promise(handleReplyComment(_id, content), {
      loading: 'Replying...',
      success: 'Reply Success',
      error: 'Reply Failed'
    })
    handleCloseReplies()
    setReplyComment('')
    setOpen(false)
  }

  return (
    <Dialog
      scroll={scroll}
      fullWidth
      maxWidth='sm'
      open={openReplies}
      onClose={handleCloseModal}
      sx={{
        '.MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: 0,
          overflow: 'visible'
        }
      }}
    >
      <DialogWithCustomCloseButton handleClose={handleCloseReplies}>
        <Grid container spacing={3} mb={7}>
          <Grid container xs={1}>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            >
              <Grid item>
                <Avatar src={comment.userId?.avatar} />
              </Grid>
              <Grid item xs={11}>
                <Divider orientation='vertical' sx={{ mt: 2, borderWidth: '1.5px' }} />
              </Grid>
            </Grid>
          </Grid>
          <Grid container xs={11}>
            <Grid item xs={11} sx={{ display: 'flex', flexDirection: 'row' }}>
              <Typography variant='subtitle1' mr={2}>
                {comment.userId?.firstname + ' ' + comment.userId?.lastname + ' '}
              </Typography>
              <Typography variant='subtitle1' color='GrayText'>
                {renderRelativeTime(comment.createdAt)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box width='100%' display='flex' flexWrap={'wrap'}>
                <Typography
                  variant='subtitle1'
                  sx={{
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    minWidth: '100%'
                  }}
                >
                  {comment.content}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid
            container
            xs={1}
            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          >
            <Grid item xs={12}>
              <Avatar src={comment.userId?.avatar} />
            </Grid>
          </Grid>
          <Grid container xs={11}>
            <Grid item xs={11} sx={{ display: 'flex', flexDirection: 'row' }}>
              <Typography variant='subtitle1' mr={2}>
                {comment.userId?.firstname + ' ' + comment.userId?.lastname + ' '}
              </Typography>
              <Typography variant='subtitle1' color='GrayText'>
                {renderRelativeTime(comment.createdAt)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box width='100%' display='flex' flexWrap={'wrap'}>
                <TextField
                  id='comment'
                  placeholder={`Comment for ${comment.userId?.firstname} ${comment.userId?.lastname}...`}
                  value={replyComment}
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
              </Box>
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
      </DialogWithCustomCloseButton>
      <DialogActions>
        <Button onClick={handleCloseModal}>Cancel</Button>
        <Button onClick={() => handleSubmit(comment._id, replyComment)}>Reply</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReplyCommentModal
