// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'
import { jwtDecode } from 'jwt-decode'
import { JwtPayload } from 'jsonwebtoken'
import { UserDataType } from 'src/context/types'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    const storedAccessToken = window.localStorage.getItem('access_token')

    if ((!storedAccessToken && auth.user === null) || !window.localStorage.getItem('userData')) {
      // Check both conditions
      if (router.asPath !== '/') {
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath }
        })
      } else {
        router.replace('/login')
      }
    } else {
      // Access token exists, check the role
      const decodedToken = jwtDecode(storedAccessToken ?? '') as JwtPayload
      const storedUserData = decodedToken as UserDataType
      const isRoleArray = Array.isArray(storedUserData.role)

      if (isRoleArray) {
        // Admin user: allow access
        auth.setUser(storedUserData)
      } else if (window.localStorage.getItem('userData')) {
        // Regular user: check if userData is in localStorage
        const userData = JSON.parse(window.localStorage.getItem('userData') || '')
        auth.setUser(userData)
      } else {
        // Neither admin nor regular user: redirect to login
        router.replace('/login')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Include auth in dependency array

  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
