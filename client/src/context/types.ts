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

export type UserDataType = {
  username: string
  firstname: string
  lastname: string
  name: string
  email: string
  nickname: string | null
  status: string
  gender: string | null
  phone: string
  description: string
  rank: string
  avatar: string
  dateOfBirth: Date | undefined
  address?: string | null
  role:
    | string
    | {
        name: string
      } // Assuming it's a string here
  permissionIDs: number[]
  createdAt: string
  _id: string
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
  user: UserDataType | any
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  register: (params: RegisterParams, errorCallback?: ErrCallbackType) => void
  forgotPassword: (params: ForgotPassParams, errorCallback?: ErrCallbackType) => void
  resetPassword: (params: ResetPassParams, errorCallback?: ErrCallbackType) => void
}
