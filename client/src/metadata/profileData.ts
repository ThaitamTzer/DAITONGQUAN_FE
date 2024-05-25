import { ProfileTabType } from 'src/types/apps/profileType'

interface DataType {
  profile: (user: any) => ProfileTabType // Update the type of the profile property
}

export const getProfileData: DataType = {
  profile: (user: any) => ({
    about: [
      { property: 'Full Name', value: (user?.firstname || '') + ' ' + (user?.lastname || ''), icon: 'tabler:user' },
      { property: 'Nickname', value: user?.nickname || null, icon: 'tabler:at' },
      { property: 'Username', value: user?.username || null, icon: 'tabler:at' },
      { property: 'Date of Birth', value: formatDate(user?.dateOfBirth), icon: 'tabler:cake' },
      { property: 'Gender', value: user?.gender || null, icon: 'tabler:gender-transgender' },
      { property: 'Role', value: user?.role || null, icon: 'tabler:crown' },
      { property: 'Address', value: user?.address || null, icon: 'tabler:map-pin' },
      { property: 'description', value: user.description || null, icon: 'tabler:info-square' }
    ].filter(item => item.value !== null && item.value !== ''),
    contacts: [
      { property: 'Email', value: user?.email || null, icon: 'tabler:mail' },
      { property: 'Phone', value: user.phone, icon: 'tabler:phone' }

      // { property: 'Social', value: user.hyperlink, icon: 'tabler:brand-facebook' }
    ].filter(item => item.value !== null && item.value !== ''),
    overview: [
      { property: 'Posts', value: '10022', icon: 'iconoir:post' },
      { property: 'Likes', value: '151515', icon: 'iconamoon:like-light' },
      { property: 'Comments', value: '123123', icon: 'material-symbols-light:comment-outline' }
    ].filter(item => item.value !== null && item.value !== '')
  })
}

function formatDate(dateString: string | null): string | null {
  if (dateString) {
    const dateObj = new Date(dateString) // Parse the ISO 8601 date string

    if (!isNaN(dateObj.getTime())) {
      // Check if the date is valid
      const day = String(dateObj.getDate()).padStart(2, '0')
      const month = String(dateObj.getMonth() + 1).padStart(2, '0') // Month is zero-based
      const year = dateObj.getFullYear()

      return `${day}/${month}/${year}`
    }
  }

  return null
}
