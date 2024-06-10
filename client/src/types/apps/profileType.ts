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
  streetName: string | ''
  description: string | ''
  lastname: string
  email: string
  dateOfBirth: Date | undefined
  address: string
  gender: string
  firstname: string
  phone: string | null
  nickname: string | null
}
