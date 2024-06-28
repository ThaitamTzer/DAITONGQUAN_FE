import { useState, SyntheticEvent, Fragment, ReactNode, useContext, useEffect } from 'react'
import { io } from 'socket.io-client'

// ** MUI Imports
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled, Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Type Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Services Imports
import spendNoteService from 'src/service/spendNote.service'
import ScheduleService from 'src/service/schedule.service'

// ** Util Import
import useSWR, { mutate } from 'swr'

interface Props {
  settings: Settings
}

// ** Styled Menu component
const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4.25),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0,
    '& .MuiMenuItem-root': {
      margin: 0,
      borderRadius: 0,
      padding: theme.spacing(4, 6),
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      }
    }
  }
}))

// ** Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  '&:not(:last-of-type)': {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))

// ** Styled PerfectScrollbar component
const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  maxHeight: 349
})

// ** Styled component for the title in MenuItems
const MenuItemTitle = styled(Typography)<TypographyProps>({
  fontWeight: 500,
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

// ** Styled component for the subtitle in MenuItems
const MenuItemSubtitle = styled(Typography)<TypographyProps>({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const ScrollWrapper = ({ children, hidden }: { children: ReactNode; hidden: boolean }) => {
  if (hidden) {
    return <Box sx={{ maxHeight: 349, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  } else {
    return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
  }
}

const NotificationDropdown = (props: Props) => {
  const { data: notifications, mutate: mutateNotifications } = useSWR(
    'GET_ALL_NOTIFICATIONS',
    spendNoteService.getNotificationOutOfMoney
  )
  const { data: eventNotifications, mutate: mutateEventNotifications } = useSWR(
    'GET_ALL_EVENT_NOTIFICATIONS',
    ScheduleService.notifySchedule
  )
  const ability = useContext(AbilityContext)

  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)

  // ** Hook
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'))

  // ** Vars
  const { direction } = settings

  // ** Socket setup
  useEffect(() => {
    const access_token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')

    const socket = io('https://daitongquan.onrender.com', {
      extraHeaders: {
        Authorization: `Bearer ${access_token}`
      }
    }) // replace with your socket server URL

    socket.on('connect', function () {
      console.log('connected')
      socket.emit('getSchedule')
    })

    socket.on('schedules', data => {
      // Update event notifications list
      console.log('Event notifications:', data)

      mutateEventNotifications()
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server')
    })

    return () => {
      socket.disconnect()
    }
  }, [mutateEventNotifications])

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const handleFormatCost = (cost: number) => {
    return cost.toLocaleString('vi', {
      style: 'currency',
      currency: 'VND'
    })
  }

  const handleUnderline = (str: string) => {
    return <Typography sx={{ textDecoration: 'underline', display: 'inline' }}>{str}</Typography>
  }

  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        {ability.cannot('manage', 'all') && notifications?.outOfBudgetCategories?.length > 0 ? (
          <Badge
            color='error'
            variant='standard'
            badgeContent={
              notifications?.outOfBudgetCategories?.length > 9 ? '9+' : notifications?.outOfBudgetCategories?.length
            }
            invisible={!notifications?.outOfBudgetCategories?.length}
            sx={{
              '& .MuiBadge-badge': {
                top: 4,
                right: 4,
                boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`
              }
            }}
          >
            <Icon fontSize='1.625rem' icon='tabler:bell' />
          </Badge>
        ) : (
          <Badge
            color='error'
            variant='standard'
            sx={{
              '& .MuiBadge-badge': {
                top: 4,
                right: 4,
                boxShadow: theme => `0 0 0 2px ${theme.palette.background.paper}`
              }
            }}
          >
            <Icon fontSize='1.625rem' icon='tabler:bell' />
          </Badge>
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{ cursor: 'default', userSelect: 'auto', backgroundColor: 'transparent !important' }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography variant='h5' sx={{ cursor: 'text' }}>
              Notifications
            </Typography>
            {ability.cannot('manage', 'all') && notifications?.outOfBudgetCategories?.length > 0 ? (
              <CustomChip
                skin='light'
                size='small'
                color='primary'
                label={`${notifications?.outOfBudgetCategories?.length} New`}
              />
            ) : (
              <CustomChip skin='light' size='small' color='primary' label={`Nothing New`} />
            )}
          </Box>
        </MenuItem>
        <ScrollWrapper hidden={hidden}>
          {ability.cannot('manage', 'all') && (
            <>
              {notifications?.outOfBudgetCategories?.map((notification: any, index: number) => (
                <MenuItem key={index} disableRipple disableTouchRipple onClick={handleDropdownClose}>
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{ mr: 4, ml: 2.5, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}
                    >
                      <MenuItemTitle variant='body1'>
                        Category {handleUnderline(notification.nameCate)} has limit{' '}
                        {handleFormatCost(notification.budget)}
                      </MenuItemTitle>
                      <MenuItemSubtitle variant='body2'>
                        {handleFormatCost(notification.budgetUsed)} has spent
                      </MenuItemSubtitle>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
              {eventNotifications?.map((notification: any, index: number) => (
                <MenuItem key={index} disableRipple disableTouchRipple onClick={handleDropdownClose}>
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{ mr: 4, ml: 2.5, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}
                    >
                      <MenuItemTitle variant='body1'>
                        Event {handleUnderline(notification.title)} is coming
                      </MenuItemTitle>
                      <MenuItemSubtitle variant='body2'>{notification.startDateTime}</MenuItemSubtitle>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </>
          )}
        </ScrollWrapper>
        <MenuItem
          disableRipple
          disableTouchRipple
          sx={{
            borderBottom: 0,
            cursor: 'default',
            userSelect: 'auto',
            backgroundColor: 'transparent !important',
            borderTop: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Button fullWidth variant='contained' onClick={handleDropdownClose}>
            Read All Notifications
          </Button>
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default NotificationDropdown
