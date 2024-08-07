import { Box, useMediaQuery } from '@mui/material'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useTheme } from '@mui/material/styles'
import SideBar from 'src/views/chat/sideBar'
import { useUserProfileStore } from 'src/store/user'
import { useEffect, useState } from 'react'
import { useChatStore } from 'src/store/chat'
import useSWR from 'swr'
import ChatService from 'src/service/chat.service'
import ChatContent from 'src/views/chat/chatContent'
import userProfileService from 'src/service/userProfileService.service'
import { userById } from 'src/types/user'

const ChatPage = () => {
  const { setUserById, userById } = useChatStore(state => state)
  const [userChatData, setUserChatData] = useState<userById[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { settings } = useSettings()
  const { skin } = settings
  const theme = useTheme()
  const { setChats } = useChatStore(state => state)
  const { getUserProfile } = useUserProfileStore()
  const { data: chats } = useSWR('GET_ALL_CHAT', ChatService.getAllChats)

  const mdAbove = useMediaQuery(theme.breakpoints.up('md'))
  const smAbove = useMediaQuery(theme.breakpoints.up('sm'))
  const sidebarWidth = smAbove ? 360 : 300
  const userId = chats?.map(chat => chat.receiverId._id)

  useEffect(() => {
    getUserProfile()
    if (chats) {
      setChats(chats)
    }
  }, [getUserProfile, chats])

  useEffect(() => {
    setLoading(true)
    Promise.all(userId?.map(id => userProfileService.getUserProfileById(id)) ?? [])
      .then(userByIds => {
        setUserChatData(userByIds)
        setLoading(false)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

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
      <ChatContent mdAbove={mdAbove} userChatData={userChatData} />
    </Box>
  )
}

ChatPage.contentHeightFixed = true

ChatPage.acl = {
  action: 'read',
  subject: 'member-page'
}
export default ChatPage
