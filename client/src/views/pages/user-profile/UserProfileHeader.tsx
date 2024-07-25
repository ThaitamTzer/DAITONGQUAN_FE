// ** React Imports
import { useState, useEffect, MouseEvent, forwardRef, Ref, ReactElement } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import MuiMenu, { MenuProps } from '@mui/material/Menu'
import MuiMenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

// ** Custom Components
import UpdateUserProfile from './UpdateUserProfile'
import ChangeAvatarDialog from './UpdateAvatar'

// ** Third Party Imports
import axios from 'axios'
import { useFormatter } from 'next-intl'
import { useTranslation } from 'react-i18next'
import 'cropperjs/dist/cropper.css'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ProfileHeaderType } from 'src/@fake-db/types'
import { useAuth } from 'src/hooks/useAuth'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import Fade, { FadeProps } from '@mui/material/Fade'
import user from 'src/store/apps/user'

const Menu = styled(MuiMenu)<MenuProps>(({ theme }) => ({
  '& .MuiMenu-paper': {
    border: `1px solid ${theme.palette.divider}`
  }
}))

// Styled MenuItem component
const MenuItem = styled(MuiMenuItem)<MenuItemProps>(({ theme }) => ({
  margin: 0,
  borderRadius: 0,
  '&:not(.Mui-focusVisible):hover': {
    backgroundColor: theme.palette.action.hover
  },
  '&.Mui-selected': {
    backgroundColor: hexToRGBA(theme.palette.primary.main, 0.08)
  },
  '&.Mui-focusVisible': {
    backgroundColor: theme.palette.primary.main,
    '& .MuiListItemIcon-root, & .MuiTypography-root': {
      color: theme.palette.common.white
    }
  }
}))

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 108,
  height: 108,
  borderRadius: theme.shape.borderRadius,
  border: `4px solid ${theme.palette.common.white}`,
  animation: 'rgbBoxShadowAnimation 3s ease-in-out infinite', // Apply the new animation

  ':hover': {
    cursor: 'pointer'
  },

  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },

  // Keyframes for the RGB Color Transition
  '@keyframes rgbBoxShadowAnimation': {
    '0%': { boxShadow: '0 0 10px 2px red' },
    '16.67%': { boxShadow: '0 0 10px 2px orange' },
    '33.33%': { boxShadow: '0 0 10px 2px yellow' },
    '50%': { boxShadow: '0 0 10px 2px green' },
    '66.67%': { boxShadow: '0 0 10px 2px blue' },
    '83.33%': { boxShadow: '0 0 10px 2px indigo' },
    '100%': { boxShadow: '0 0 10px 2px violet' }
  }
}))

const UserProfileHeader = () => {
  // ** State
  const [data, setData] = useState<ProfileHeaderType | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [action, setAction] = useState<'view' | 'change' | null>(null)
  const auth = useAuth()
  const { setUser, user } = useAuth()
  const formatter = useFormatter()
  const { t } = useTranslation()
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    axios.get('/pages/profile-header').then(response => {
      setData(response.data)
    })
  }, [])

  console.log('user: ' + auth.user)

  useEffect(() => {
    auth.user && setUser({ ...auth.user, avatar: handleAvatar() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user?.avatar])

  const RankIcon = ({ rankIcon }: { rankIcon: string }) => {
    if (!rankIcon) return null

    return (
      <CardMedia
        component='img'
        alt='rank-icon'
        image={rankIcon}
        sx={{
          width: 24,
          height: 24,
          mr: 1
        }}
      />
    )
  }

  const handleAvatar = () => {
    if (auth.user?.avatar) {
      return auth.user.avatar
    } else {
      return 'https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg'
    }
  }

  const handleLastValue = (str: string) => {
    const values = str.split(',')

    return values[values.length - 1].trim()
  }

  const handleJoiningDate = (date: string) => {
    const dateISO = new Date(date)

    return formatter.dateTime(dateISO, { month: 'numeric', day: 'numeric', year: 'numeric' })
  }

  const handleAvatarClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = (selectedAction: 'view' | 'change') => {
    setAction(selectedAction)
    setOpenDialog(true)
    setAnchorEl(null)
  }

  return data !== null ? (
    <Card>
      <CardMedia
        component='img'
        alt='profile-header'
        image={data.coverImg}
        sx={{
          height: { xs: 150, md: 250 }
        }}
      />
      <CardContent
        sx={{
          pt: 0,
          mt: -8,
          display: 'flex',
          alignItems: 'flex-end',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          justifyContent: { xs: 'center', md: 'flex-start' }
        }}
      >
        <div>
          <ProfilePicture
            aria-haspopup='true'
            onClick={handleAvatarClick} // Use the new handler
            src={handleAvatar()}
            alt='profile-picture'
          />
          <Menu
            keepMounted
            anchorEl={anchorEl}
            onClose={handleClose}
            open={Boolean(anchorEl)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            {/* Your MenuItems for actions */}
            <MenuItem onClick={() => handleMenuItemClick('view')}>{t('Xem ảnh đại diện')}</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('change')}>{t('Thay đổi ảnh đại diện')}</MenuItem>
            {/* Add more options as needed */}
          </Menu>
        </div>
        {action === 'view' && (
          <AvatarDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            avatarUrl={handleAvatar()}
            Transition={Transition}
          />
        )}

        {action === 'change' && (
          <ChangeAvatarDialog open={openDialog} onClose={() => setOpenDialog(false)} avatarUrl={handleAvatar()} />
        )}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            ml: { xs: 0, md: 6 },
            alignItems: 'flex-end',
            flexWrap: ['wrap', 'nowrap'],
            justifyContent: ['center', 'space-between']
          }}
        >
          <Box sx={{ mb: [6, 0], display: 'flex', flexDirection: 'column', alignItems: ['center', 'flex-start'] }}>
            <Typography variant='h5' sx={{ mb: 2.5 }}>
              {`${auth.user?.firstname} ${auth.user?.lastname}`}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: ['center', 'flex-start']
              }}
            >
              {user?.rankID && (
                <Box
                  sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}
                >
                  <RankIcon rankIcon={user.rankID?.rankIcon ?? ''} />
                  {/* icon rank here */}
                  {user.rankID?.rankName && (
                    <Typography sx={{ color: 'text.secondary' }}>{user.rankID.rankName}</Typography>
                  )}
                </Box>
              )}

              {auth.user?.address && (
                <Box
                  sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}
                >
                  <Icon fontSize='1.25rem' icon='tabler:map-pin' />
                  <Typography sx={{ color: 'text.secondary' }}>{handleLastValue(auth.user?.address || '')}</Typography>
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon='tabler:calendar' />
                <Typography sx={{ color: 'text.secondary' }}>
                  Joined {handleJoiningDate(auth.user?.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
          <UpdateUserProfile />
        </Box>
      </CardContent>
    </Card>
  ) : null
}

export default UserProfileHeader

interface AvatarDialogProps {
  open: boolean
  onClose: () => void
  avatarUrl: string
  Transition: typeof Transition
}

const DialogContentStyle = styled(DialogContent)(() => ({
  padding: '1px !important'
}))

const AvatarDialog: React.FC<AvatarDialogProps> = ({ open, onClose, avatarUrl, Transition }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogContentStyle>
        <img src={avatarUrl} alt='Profile Picture' style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
      </DialogContentStyle>
    </Dialog>
  )
}
