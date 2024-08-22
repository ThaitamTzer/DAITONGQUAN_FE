import { Avatar, Box, Drawer, IconButton, InputAdornment, List, Typography, useMediaQuery } from '@mui/material'
import { useSideBarStore } from 'src/store/chat'
import { useTheme } from '@mui/material/styles'
import { useUserProfileStore } from 'src/store/user'
import CustomTextField from 'src/@core/components/mui/text-field'
import Icon from 'src/@core/components/icon'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { ReactNode } from 'react'
import RenderUserBeenChats from './renderUserChats'

interface SideBarProps {
  mdAbove: boolean
  sidebarWidth: number
}
const SideBar = (props: SideBarProps) => {
  const { mdAbove, sidebarWidth } = props

  const showSidebar = useSideBarStore(state => state.showSidebar)
  const handleCloseSidebar = useSideBarStore(state => state.handleCloseSidebar)

  const { user } = useUserProfileStore()

  const ScrollWrapper = ({ children }: { children: ReactNode }) => {
    return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
  }

  return (
    <Drawer
      open={!showSidebar}
      variant='permanent'
      ModalProps={{
        disablePortal: true,
        keepMounted: true // Better open performance on mobile.
      }}
      sx={{
        zIndex: 7,
        height: '100%',
        display: 'block',
        position: mdAbove ? 'static' : 'absolute',
        '& .MuiDrawer-paper': {
          boxShadow: 'none',
          width: sidebarWidth,
          position: mdAbove ? 'static' : 'absolute',
          borderTopLeftRadius: theme => theme.shape.borderRadius,
          borderBottomLeftRadius: theme => theme.shape.borderRadius
        },
        '& > .MuiBackdrop-root': {
          borderRadius: 1,
          position: 'absolute',
          zIndex: theme => theme.zIndex.drawer - 1
        }
      }}
    >
      <Box
        sx={{
          py: 3,
          px: 5,
          display: 'flex',
          alignItems: 'center',
          borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Avatar
          src={user.data?.avatar}
          alt='user photo'
          sx={{ width: '2.375rem', height: '2.375rem', cursor: 'pointer' }}
        />
        <CustomTextField
          fullWidth
          placeholder='Search for contact...'
          sx={{ '& .MuiInputBase-root': { borderRadius: '30px !important' }, ml: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start' sx={{ color: 'text.secondary' }}>
                <Icon fontSize='1.25rem' icon='tabler:search' />
              </InputAdornment>
            )
          }}
        />
        {!mdAbove ? (
          <IconButton sx={{ p: 1, ml: 1 }} onClick={handleCloseSidebar}>
            <Icon icon='tabler:x' />
          </IconButton>
        ) : null}
      </Box>
      <Box sx={{ height: `calc(100% - 4.0625rem)` }}>
        <ScrollWrapper>
          <Box sx={{ p: theme => theme.spacing(5, 3, 3) }}>
            <Typography variant='h5' sx={{ ml: 3, mb: 3.5, color: 'primary.main' }}>
              Chats
            </Typography>
            <List sx={{ mb: 5, p: 0 }}>
              <RenderUserBeenChats />
            </List>
            <Typography variant='h5' sx={{ ml: 3, mb: 3.5, color: 'primary.main' }}>
              Contacts
            </Typography>
            <List sx={{ p: 0 }}></List>
          </Box>
        </ScrollWrapper>
      </Box>
    </Drawer>
  )
}

export default SideBar
