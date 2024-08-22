export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  account: string
  password: string
  rememberMe?: boolean
}

export type RegisterParams = {
  email: string
  password: string
  username: string
  lastname: string
  firstname: string
}

// export type UserDataType = {
//   _id: string
//   role: string
//   email: string
//   fullname: string
//   username: string
//   password: string
//   avatar?: string | null
//   address?: string | null
// }

type RankID = {
  _id: string
  rankName: string
  rankIcon: string
}

type Attendance = {
  attendanceScore: number
  dateAttendance: string | Date
}

type RankScore = {
  attendance: Attendance
  numberOfComment: number
  numberOfBlog: number
  numberOfLike: number
  _id: string
}

export type UserDataType = {
  _id: string
  firstname: string
  lastname: string
  email: string
  hyperlink: any[]
  role: string
  avatar: string
  rankID: RankID
  createdAt: string
  address: string
  dateOfBirth: string
  description: string
  dateAttendance?: string
  gender: string
  nickname: string
  phone: string
  rankScore: RankScore
}

export type ForgotPassParams = {
  email: string
}

export type ResetPassParams = {
  code: number
  newPassword: string
}

export type AuthValuesType = {
  loading: boolean
  logout: (value: string) => void
  user: UserDataType
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
  forgotPassword: (params: ForgotPassParams, errorCallback?: ErrCallbackType) => void
  resetPassword: (params: ResetPassParams, errorCallback?: ErrCallbackType) => void
}
