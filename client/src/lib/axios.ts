import axios from 'axios'
import authConfig from 'src/configs/auth'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosClient.interceptors.request.use(
  config => {
    if (!config.headers['Authorization']) {
      const access_token = localStorage.getItem(authConfig.storageTokenKeyName) || ''
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

    if (error.response?.status === 401 && !prevRequest._retry) {
      prevRequest._retry = true
      const refreshToken = localStorage.getItem(authConfig.onTokenExpiration)
      const access_token = localStorage.getItem(authConfig.storageTokenKeyName)
      console.log('refreshToken', refreshToken)

      try {
        const response = await axios.patch(
          BASE_URL + authConfig.refreshTokenEndpoint,
          { refreshToken: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${authConfig.TOKEN_TYPE} ${access_token}`
            }
          }
        )

        if (response.status === 201) {
          localStorage.setItem(authConfig.onTokenExpiration, response.data.refreshToken)
          localStorage.setItem(authConfig.storageTokenKeyName, response.data.access_token)
          prevRequest.headers['Authorization'] = `${authConfig.TOKEN_TYPE} ${response.data.access_token}`

          return axiosClient(prevRequest)
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

export const axiosUpload = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'multipart/form-data' }
})

axiosUpload.interceptors.request.use(
  config => {
    if (!config.headers['Authorization']) {
      const access_token = localStorage.getItem(authConfig.storageTokenKeyName) || ''
      config.headers['Authorization'] = `${authConfig.TOKEN_TYPE} ${access_token}`
    }

    return config
  },
  error => Promise.reject(error)
)
