import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogProps,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { useTheme } from '@mui/material/styles'
import React, { useEffect } from 'react'
import DialogWithCustomCloseButton from 'src/views/components/dialog/customDialog'
import Icon from 'src/@core/components/icon'
import EmojiPicker, { EmojiClickData, EmojiStyle, SuggestionMode, Theme } from 'emoji-picker-react'
import themeConfig from 'src/configs/themeConfig'
import { useSettings } from 'src/@core/hooks/useSettings'
import { editCommentState } from 'src/store/apps/posts'

type EditCommentProps = {
  selectedReplyComment?: string
  openEditCommentModal: boolean
  onCloseEditCommentModal: () => void
  onSubmiteditComment?: (_id: string, selectedComment: string) => Promise<void>
  onSubmiteditReplyComment?: (commentId: string, reply: string, selectedReplyComment: string) => Promise<void>
  replyId?: string
}

const EditComment = (props: EditCommentProps) => {
  const {
    openEditCommentModal,
    onSubmiteditComment,
    onSubmiteditReplyComment,
    selectedReplyComment,
    replyId,
    onCloseEditCommentModal
  } = props
  const [scroll] = React.useState<DialogProps['scroll']>('paper')
  const [open, setOpen] = React.useState<boolean>(false)
  const commentId = editCommentState(state => state.commentId)
  const [replyComment, setReplyComment] = React.useState(selectedReplyComment)
  const { settings } = useSettings()
  const theme = useTheme()

  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  const userLocal = userData

  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setReplyComment(value)
  }

  const handleTheme = () => {
    if (themeConfig.mode === 'dark' && settings.mode === 'dark') {
      return Theme.DARK
    }
    if (settings.mode === 'light') {
      return Theme.LIGHT
    }
  }

  const handleClickOpen = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    setReplyComment(replyComment + emojiObject.emoji)
  }

  const handleCloseModal = () => {
    onCloseEditCommentModal()
    setOpen(false)
    setReplyComment('')
  }

  const handleSubmit = async () => {
    if (onSubmiteditComment && commentId && replyComment) {
      await onSubmiteditComment(commentId, replyComment)
    }
    handleCloseModal()
  }

  const handleSubmitReply = async () => {
    if (onSubmiteditReplyComment && commentId && replyId && replyComment) {
      console.log('commentId', commentId)
      console.log('replyId', replyId)
      console.log('replyComment', replyComment)

      await onSubmiteditReplyComment(commentId, replyId, replyComment)
    }
    handleCloseModal()
  }

  useEffect(() => {
    if (openEditCommentModal) {
      setReplyComment(selectedReplyComment)
    }
  }, [openEditCommentModal, selectedReplyComment])

  return (
    <Dialog
      scroll={scroll}
      fullWidth
      maxWidth='sm'
      open={openEditCommentModal}
      onClose={handleCloseModal}
      sx={{
        '.MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: 0,
          overflow: 'visible'
        }
      }}
    >
      <DialogWithCustomCloseButton handleClose={handleCloseModal}>
        <Grid container spacing={3}>
          <Grid
            container
            xs={1}
            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
          >
            <Grid item xs={12}>
              <Avatar src={userLocal.avatar} />
            </Grid>
          </Grid>
          <Grid container xs={11}>
            <Grid item xs={11} sx={{ display: 'flex', flexDirection: 'row' }}>
              <Typography variant='subtitle1' mr={2}>
                {userLocal.firstname + ' ' + userLocal.lastname + ' '}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box width='100%' display='flex' flexWrap={'wrap'}>
                <TextField
                  id='comment'
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
        {onSubmiteditComment && (
          <Button variant='contained' onClick={handleSubmit}>
            Change
          </Button>
        )}
        {onSubmiteditReplyComment && (
          <Button variant='contained' onClick={handleSubmitReply}>
            Change
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default EditComment
