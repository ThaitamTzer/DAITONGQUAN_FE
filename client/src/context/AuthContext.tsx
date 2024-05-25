// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import {
  AuthValuesType,
  LoginParams,
  RegisterParams,
  ForgotPassParams,
  ErrCallbackType,
  UserDataType,
  ResetPassParams
} from './types'

// ** Authentication Service
import axiosClient, { axiosAuth } from 'src/lib/axios'
import { jwtDecode } from 'jwt-decode'
import { JwtPayload } from 'jsonwebtoken' // Import JwtPayload from 'jsonwebtoken'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  forgotPassword: () => Promise.resolve(),
  resetPassword: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      setLoading(true)

      try {
        // Check if the user role is available in local storage
        const storedUserDataString = window.localStorage.getItem('access_token')

        // console.log('storedUserDataString: ', storedUserDataString)

        if (storedUserDataString) {
          const decodeStoredUserDataString = jwtDecode(storedUserDataString) as JwtPayload // Add 'as JwtPayload' to cast the decoded data as JwtPayload
          // console.log('decodeStoredUserDataString: ', decodeStoredUserDataString)

          const storedUserData = decodeStoredUserDataString as UserDataType // Cast storedUserData as UserDataType

          const isRoleArray = Array.isArray(storedUserData.role)
          if (isRoleArray) {
            setUser(storedUserData)
            setLoading(false)

            return // Exit early if admin user info is already in local storage
          }
        }

        // If not admin or user info not in storage, fetch user info from API
        const response = await axiosClient.get(authConfig.getUserInfoEndpoint)

        setLoading(false)
        setUser({ ...response.data })

        // window.localStorage.setItem('userData', JSON.stringify({ ...response.data }))
      } catch (error) {
        localStorage.removeItem('userData')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('access_token')
        setUser(null)
        setLoading(false)
        router.replace('/login')
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // create handleLogin have remember me
  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axiosClient
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        params.rememberMe && window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.access_token)
        const returnUrl = router.query.returnUrl

        const userData = response.data.user
        const role = userData.role

        if (Array.isArray(role)) {
          // Role is an array (admin): use storedUserData from useEffect
          const storedUserDataString = window.localStorage.getItem('access_token')
          const decodeStoredUserDataString = storedUserDataString
            ? (jwtDecode(storedUserDataString) as JwtPayload)
            : null
          const storedUserData = decodeStoredUserDataString as UserDataType
          const adminData = storedUserData.fullname
          console.log('storedUserData: ', adminData)

          window.localStorage.setItem('userData', JSON.stringify(adminData))

          setUser(storedUserData) // Assuming you have storedUserData available
        } else if (typeof role === 'string') {
          // Role is a string (regular user): store userData in localStorage
          setUser(userData)
          window.localStorage.setItem('userData', JSON.stringify(userData))
        } else {
          // Handle unexpected role types (if necessary)
          console.error('Unexpected role type:', role)

          // You might want to throw an error or handle it gracefully
        }

        window.localStorage.setItem('refreshToken', response.data.refreshToken)
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL as string)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = (refreshToken: string, errorCallback?: ErrCallbackType) => {
    try {
      refreshToken = refreshToken || window.localStorage.getItem('refreshToken') || ''
      axiosAuth
        .patch(authConfig.logoutEndpoint, { refreshToken }, {})
        .then(() => {
          router.push('/login')
          localStorage.removeItem('userData')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('access_token')
          setUser(null)
        })
        .catch(err => {
          if (errorCallback) errorCallback(err)
        })
    } catch (error) {
      // console.error(error)
      throw error
    }
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axiosClient
      .post(authConfig.registerEndpoint, params)
      .then(() => {
        // console.log('response register: ', response)
        router.push('/login')
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleForgotPassword = (params: ForgotPassParams, errorCallback?: ErrCallbackType) => {
    axiosClient
      .post(authConfig.forgotPasswordEndpoint, params)
      .then(() => {
        router.push('/reset-password')
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleResetPassword = (params: ResetPassParams, errorCallback?: ErrCallbackType) => {
    try {
      axiosClient
        .put(authConfig.resetPasswordEndpoint, params)
        .then(() => {
          router.push('/login')
        })
        .catch(error => {
          if (errorCallback) errorCallback(error)
        })
    } catch (error) {
      throw error
    }
  }

  const values: AuthValuesType = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout, // Update the type of the logout property
    register: handleRegister,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
