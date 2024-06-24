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
      const access_token =
        localStorage.getItem(authConfig.storageTokenKeyName) ||
        sessionStorage.getItem(authConfig.storageTokenKeyName) ||
        ''
      config.headers['Authorization'] = `${authConfig.TOKEN_TYPE} ${access_token}`
    }

    return config
  },
  error => Promise.reject(error)
)

// axiosClient.interceptors.request.use(
//   async config => {
//     const refreshToken = localStorage.getItem(authConfig.onTokenExpiration)
//     const access_token =
//       localStorage.getItem(authConfig.storageTokenKeyName) ||
//       sessionStorage.getItem(authConfig.storageTokenKeyName) ||
//       ''

//     // Check where the token is stored
//     const isTokenInSessionStorage = sessionStorage.getItem(authConfig.storageTokenKeyName) !== null

//     // Decode the token to get the expiration time
//     const decodedToken = jwtDecode(access_token)

//     // Check if the token is close to its expiration time
//     const now = Math.floor(Date.now() / 1000) // Convert to seconds

//     if (decodedToken.exp !== undefined && decodedToken.exp - now <= 15) {
//       // 15 seconds
//       try {
//         const response = await axios.patch(
//           BASE_URL + authConfig.refreshTokenEndpoint,
//           { refreshToken },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `${authConfig.TOKEN_TYPE} ${access_token}`
//             }
//           }
//         )

//         if (response.status === 201) {
//           localStorage.setItem(authConfig.onTokenExpiration, response.data.refreshToken)
//           localStorage.setItem(authConfig.storageTokenKeyName, response.data.access_token)
//           config.headers['Authorization'] = `${authConfig.TOKEN_TYPE} ${response.data.access_token}`
//         }
//       } catch (refreshError) {
//         // If the token is in sessionStorage, clear all data from sessionStorage
//         if (isTokenInSessionStorage) {
//           sessionStorage.clear()
//         }

//         return Promise.reject(refreshError)
//       }
//     }

//     return config
//   },
//   error => Promise.reject(error)
// )

axiosClient.interceptors.response.use(
  response => response.data,
  async error => {
    const prevRequest = error.config

    if (error.response?.status === 401 && !prevRequest._retry) {
      prevRequest._retry = true
      const refreshToken = localStorage.getItem(authConfig.onTokenExpiration)

      // Check where the token is stored
      const isTokenInSessionStorage = sessionStorage.getItem(authConfig.storageTokenKeyName) !== null

      try {
        const response = await axios.patch(
          BASE_URL + authConfig.refreshTokenEndpoint,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (response.status === 201 && sessionStorage.getItem(authConfig.storageTokenKeyName) !== null) {
          localStorage.setItem(authConfig.onTokenExpiration, response.data.refreshToken)
          sessionStorage.setItem(authConfig.storageTokenKeyName, response.data.access_token)
          prevRequest.headers['Authorization'] = `${authConfig.TOKEN_TYPE} ${response.data.access_token}`

          return axiosClient(prevRequest)
        } else if (response.status === 201 && localStorage.getItem(authConfig.storageTokenKeyName) !== null) {
          localStorage.setItem(authConfig.onTokenExpiration, response.data.refreshToken)
          localStorage.setItem(authConfig.storageTokenKeyName, response.data.access_token)
          prevRequest.headers['Authorization'] = `${authConfig.TOKEN_TYPE} ${response.data.access_token}`

          return axiosClient(prevRequest)
        }
      } catch (refreshError) {
        // If the token is in sessionStorage, clear all data from sessionStorage
        if (isTokenInSessionStorage) {
          sessionStorage.clear()
          localStorage.clear()
        }

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
      const access_token =
        localStorage.getItem(authConfig.storageTokenKeyName) ||
        sessionStorage.getItem(authConfig.storageTokenKeyName) ||
        ''
      config.headers['Authorization'] = `${authConfig.TOKEN_TYPE} ${access_token}`
    }

    return config
  },
  error => Promise.reject(error)
)
