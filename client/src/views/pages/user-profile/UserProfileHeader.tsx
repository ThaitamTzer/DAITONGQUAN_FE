// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components
import UpdateUserProfile from './UpdateUserProfile'

// ** Third Party Imports
import axios from 'axios'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ProfileHeaderType } from 'src/@fake-db/types'
import { useAuth } from 'src/hooks/useAuth'

// const ProfilePicture = styled('img')(({ theme }) => ({
//   width: 108,
//   height: 108,
//   borderRadius: theme.shape.borderRadius,
//   border: `4px solid ${theme.palette.common.white}`,
//   [theme.breakpoints.down('md')]: {
//     marginBottom: theme.spacing(4)
//   }
// }))

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 108,
  height: 108,
  borderRadius: theme.shape.borderRadius,
  border: `4px solid ${theme.palette.common.white}`,
  animation: 'rgbBoxShadowAnimation 3s ease-in-out infinite', // Apply the new animation

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
    '100%': { boxShadow: '0 0 10px 2px violet' },
  }
}));

const UserProfileHeader = () => {
  // ** State
  const [data, setData] = useState<ProfileHeaderType | null>(null)
  const auth = useAuth()

  useEffect(() => {
    axios.get('/pages/profile-header').then(response => {
      setData(response.data)
    })
  }, [])

  const designationIcon = data?.designationIcon || 'tabler:briefcase'

  const handleAvatar = () => {
    if (auth.user?.avatar) {
      return auth.user.avatar
    } else {
      return 'https://thumbs.dreamstime.com/b/default-profile-picture-avatar-photo-placeholder-vector-illustration-default-profile-picture-avatar-photo-placeholder-vector-189495158.jpg'
    }
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
        <ProfilePicture src={handleAvatar()} alt='profile-picture' />
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
              {auth.user?.username ? ` (${auth.user?.username})` : ''}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: ['center', 'flex-start']
              }}
            >
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon={designationIcon} />
                {/* icon rank here */}
                <Typography sx={{ color: 'text.secondary' }}>{data.designation}</Typography>
                {/* name rank here */}
              </Box>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon='tabler:map-pin' />
                <Typography sx={{ color: 'text.secondary' }}>{auth.user?.address}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'text.secondary' } }}>
                <Icon fontSize='1.25rem' icon='tabler:calendar' />
                <Typography sx={{ color: 'text.secondary' }}>Joined {data.joiningDate}</Typography>
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
