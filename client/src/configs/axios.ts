import axios from 'axios'
import { BaseURL } from 'src/@core/utils/sgod'

const axiosAuth = axios.create({
  baseURL: BaseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosAuth.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default axiosAuth
