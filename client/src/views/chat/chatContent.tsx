// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Badge from '@mui/material/Badge'
import MuiAvatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Import
// import ChatLog from './ChatLog'
import SendMsgForm from 'src/views/apps/chat/SendMsgForm'
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import UserProfileRight from 'src/views/apps/chat/UserProfileRight'
import Avatar from '@mui/material/Avatar'
import { userById } from 'src/types/user'

import { useChatStore } from 'src/store/chat'

// ** Styled Components
const ChatWrapperStartChat = styled(Box)<BoxProps>(({ theme }) => ({
  flexGrow: 1,
  height: '100%',
  display: 'flex',
  borderRadius: 1,
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundColor: theme.palette.action.hover
}))

interface ChatContentProps {
  mdAbove: boolean
  userChatData: userById[]
}
const ChatContent = (props: ChatContentProps) => {
  const { reciverId, openChat, handleCloseChat, chats } = useChatStore(state => state)
  const { mdAbove, userChatData } = props

  console.log(reciverId)

  console.log(userChatData)

  const NoteChat = () => {
    return (
      <ChatWrapperStartChat
        sx={{
          ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {})
        }}
      >
        <Avatar
          sx={{
            mb: 6,
            pt: 8,
            pb: 7,
            px: 7.5,
            width: 110,
            height: 110,
            boxShadow: 3,
            backgroundColor: 'background.paper'
          }}
        >
          <Icon icon='tabler:message' fontSize='3.125rem' />
        </Avatar>
        <Box
          sx={{
            py: 2,
            px: 6,
            boxShadow: 3,
            borderRadius: 5,
            backgroundColor: 'background.paper',
            cursor: mdAbove ? 'default' : 'pointer'

            // onClick={handleStartConversation}
          }}
        >
          <Typography sx={{ fontWeight: 500, fontSize: '1.125rem', lineHeight: 'normal' }}>
            Start Conversation
          </Typography>
        </Box>
      </ChatWrapperStartChat>
    )
  }

  return (
    <Box
      sx={{
        width: 0,
        flexGrow: 1,
        height: '100%',
        backgroundColor: 'action.hover'
      }}
    >
      <Box
        sx={{
          px: 5,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'background.paper',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {mdAbove ? null : (
            <IconButton sx={{ mr: 2 }}>
              <Icon icon='tabler:menu-2' />
            </IconButton>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Avatar src='' />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ChatContent
