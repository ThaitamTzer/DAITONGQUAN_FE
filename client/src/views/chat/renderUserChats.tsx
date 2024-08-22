import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import ChatService from 'src/service/chat.service'
import chat from 'src/store/apps/chat'
import userProfileService from 'src/service/userProfileService.service'
import { userById } from 'src/types/user'
import { useChatStore } from 'src/store/chat'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const RenderUserBeenChats = () => {
  const { chats, handleOpenChat } = useChatStore(state => state)
  const [userChatData, setUserChatData] = React.useState<userById[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const userId = chats?.map(chat => chat.receiverId._id)
  console.log(chats)

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
    // eslint-disable-next-line
  }, [])

  console.log(userChatData)

  if (loading) {
    return (
      <ListItem>
        <Typography>Loading...</Typography>
      </ListItem>
    )
  }

  if (chats && chats.length === 0) {
    return (
      <ListItem>
        <Typography sx={{ color: 'text.secondary' }}>No Chats Found</Typography>
      </ListItem>
    )
  }

  const activeCondition = chats?.find(chat => userChatData.map(user => user.data._id).includes(chat._id))
  const lastChatContent = chats
    ?.filter(chat => userChatData.map(user => user.data._id).includes(chat.receiverId._id))
    ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    ?.map(chat => chat.content)[0]

  return (
    <>
      {userChatData.map(user => (
        <ListItem key={user.data._id}>
          <ListItemButton
            disableRipple
            onClick={() => handleOpenChat(user.data._id)}
            sx={{
              py: 2,
              px: 3,
              width: '100%',
              borderRadius: 1,
              alignItems: 'flex-start',
              '&.MuiListItemButton-root:hover': { backgroundColor: 'action.hover' },
              ...(activeCondition && {
                background: theme =>
                  `linear-gradient(72.47deg, ${theme.palette.primary.main} 22.16%, ${hexToRGBA(
                    theme.palette.primary.main,
                    0.7
                  )} 76.47%) !important`
              })
            }}
          >
            <ListItemAvatar sx={{ m: 0, alignSelf: 'center' }}>
              <Avatar
                src={user.data.avatar}
                alt={user.data.avatar}
                sx={{
                  width: 38,
                  height: 38,
                  outline: theme => `2px solid ${activeCondition ? theme.palette.common.white : 'transparent'}`
                }}
              />
            </ListItemAvatar>
            <ListItemText
              sx={{
                my: 0,
                ml: 3,
                mr: 1.5,
                '& .MuiTypography-root': { ...(activeCondition && { color: 'common.white' }) }
              }}
              primary={
                <Typography noWrap variant='h6'>
                  {user.data?.firstname + ' ' + user.data?.lastname}
                </Typography>
              }
              secondary={
                <Typography noWrap sx={{ ...(!activeCondition && { color: 'text.secondary' }) }}>
                  {lastChatContent}
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  )
}

export default RenderUserBeenChats
