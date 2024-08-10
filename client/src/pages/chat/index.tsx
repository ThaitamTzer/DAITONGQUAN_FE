import { Box, useMediaQuery } from '@mui/material'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useTheme } from '@mui/material/styles'
import SideBar from 'src/views/chat/sideBar'
import { useUserProfileStore } from 'src/store/user'
import { useChatStore } from 'src/store/chat'
import useSWR from 'swr'
import ChatService from 'src/service/chat.service'
import ChatContent from 'src/views/chat/chatContent'

const ChatPage = () => {
  const { settings } = useSettings()
  const { skin } = settings
  const theme = useTheme()
  const { data: chats } = useSWR('GET_ALL_CHAT', ChatService.getAllChats)
  console.log(chats)

  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
  const sidebarWidth = smAbove ? 360 : 300

  return (
    <Box
      className='app-chat'
      sx={{
        width: '100%',
        display: 'flex',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'background.paper',
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
      }}
    >
      <SideBar mdAbove={mdAbove} sidebarWidth={sidebarWidth} />
      {/* <ChatContent mdAbove={mdAbove} /> */}
    </Box>
  )
}

ChatPage.contentHeightFixed = true

ChatPage.acl = {
  action: 'read',
  subject: 'member-page'
}
export default ChatPage
