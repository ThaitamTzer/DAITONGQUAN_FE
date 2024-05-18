import axios from 'axios'
import authConfig from 'src/configs/auth'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// const token: Token = JSON.parse(window.localStorage.getItem(authConfig.storageTokenKeyName) || '')
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})
axiosClient.interceptors.request.use(
  config => {
    if (!config.headers['Authorization']) {
      const access_token: string = localStorage.getItem(authConfig.storageTokenKeyName) || ''
      config.headers['Authorization'] = `${authConfig.TOKEN_TYPE} ${access_token}`
    }

    return config
  },
  error => Promise.reject(error)
)
axiosClient.interceptors.response.use(
  response => response.data,
  async error => {
    const prevRequest = error.config
    if (error.response?.status === 401 && prevRequest.sent) {
      prevRequest.sent = true
      const refreshToken = localStorage.getItem(authConfig.onTokenExpiration)
      try {
        const response = await axios.post(
          authConfig.refreshTokenEndpoint,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `${authConfig.TOKEN_TYPE} ${refreshToken}`
            }
          }
        )
        if (response.status === 201) {
          localStorage.setItem(authConfig.onTokenExpiration, response.data.refreshToken)
          localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)

          return axios(prevRequest)
        }
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
export default axiosClient
export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})
