import axiosAuth from 'src/configs/axios'
import authConfig from 'src/configs/auth'
import { LoginParams, RegisterParams, ForgotPassParams, ResetPassParams } from 'src/context/types'

const authenticateService = {
  login: async (params: LoginParams) => {
    return axiosAuth.post(authConfig.loginEndpoint, params)
  },
  register: async (params: RegisterParams) => {
    return axiosAuth.post(authConfig.registerEndpoint, params)
  },
  forgotPassword: async (params: ForgotPassParams) => {
    return axiosAuth.post(authConfig.forgotPasswordEndpoint, params)
  },
  resetPassword: async (params: ResetPassParams) => {
    return axiosAuth.post(authConfig.resetPasswordEndpoint, params)
  }
}

export default authenticateService
