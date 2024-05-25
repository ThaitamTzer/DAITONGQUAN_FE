import { ThemeColor } from 'src/@core/layouts/types'

export type ProfileTabType = {
  about: ProfileTabCommonType[]
  contacts: ProfileTabCommonType[]
  overview: ProfileTabCommonType[]
}

export interface ProfileTabCommonType {
  icon: string
  value: string
  property: string
}

export type ProfileTeamsType = ProfileTabCommonType & { color: ThemeColor }
export type ProfileConnectionsType = {
  name: string
  avatar: string
  isFriend: boolean
  connections: string
}

export type ProfileAboutType = {
  firstname: string
  avatar: string | null
  lastname: string
  email: string
  role: string
  dateOfBirth: string
  address: string
  gender: string
  phone: string | null
  nickname: string | null
  description: string | null
  hyperlink: string[]
  data: string[]
}
