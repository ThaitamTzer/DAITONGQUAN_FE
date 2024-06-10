import { ProfileTabType } from 'src/types/apps/profileType'

interface DataType {
  profile: (data: any) => ProfileTabType // Update the type of the profile property
}

export const getProfileData: DataType = {
  profile: (data: any) => ({
    about: [
      { property: 'Full Name', value: (data?.firstname || '') + ' ' + (data?.lastname || ''), icon: 'tabler:user' },
      { property: 'Nickname', value: data?.nickname || null, icon: 'tabler:at' },
      { property: 'Username', value: data?.dataname || null, icon: 'tabler:at' },
      { property: 'Date of Birth', value: FormatDate(data?.dateOfBirth), icon: 'tabler:cake' },
      { property: 'Gender', value: data?.gender || null, icon: 'tabler:gender-transgender' },
      { property: 'Role', value: data?.role || null, icon: 'tabler:crown' },
      { property: 'Address', value: data?.address || null, icon: 'tabler:map-pin' },
      { property: 'description', value: data.description || null, icon: 'tabler:info-square' }
    ].filter(item => item.value !== null && item.value !== ''),
    contacts: [
      { property: 'Email', value: data?.email || null, icon: 'tabler:mail' },
      { property: 'Phone', value: data.phone || null, icon: 'tabler:phone' }

      // { property: 'Social', value: data.hyperlink, icon: 'tabler:brand-facebook' }
    ].filter(item => item.value !== null && item.value !== ''),
    overview: [
      { property: 'Posts', value: '10022', icon: 'iconoir:post' },
      { property: 'Likes', value: '151515', icon: 'iconamoon:like-light' },
      { property: 'Comments', value: '123123', icon: 'material-symbols-light:comment-outline' }
    ].filter(item => item.value !== null && item.value !== '')
  })
}

function FormatDate(dateString: string | null): string | null {
  if (dateString) {
    const dateObj = new Date(dateString) // Parse the ISO 8601 date string

    // Extract day, month, and year components
    const day = String(dateObj.getDate()).padStart(2, '0') // Ensure two digits
    const month = String(dateObj.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
    const year = dateObj.getFullYear()

    return `${day}/${month}/${year}` // Format in d/mm/yyyy
  }

  return null
}
