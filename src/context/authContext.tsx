import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { startSync, stopSync } from '#/services/sync/scheduler'
import { syncWithServer } from '#/services/sync/organizer'
import { taskDb } from '#/services/localdb'
interface AuthContextType {
  sessionToken: string
  isLogin: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  signup: (username: string, password: string) => Promise<void>
  getToken: () => string | null
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionToken, setSessionToken] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLogin, setIsLogin] = useState<boolean>(false)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    console.log(token)
    if (token) {
      verifyToken(token)
        .then((value) => {
          localStorage.setItem('authToken', value)
          setSessionToken(value)
          startSync(value)
          setIsLogin(true)
        })
        .catch((err) => {
          console.error(err)
          setIsLogin(false)
        })
    }
  }, [])

  const getToken = () => localStorage.getItem('authToken')

  const verifyToken = async (token: string) => {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Verify token failed')
    }

    const data = await response.json()
    localStorage.setItem('authToken', data.newToken)
    setSessionToken(data.newToken)
    return data.newToken as string
  }

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const data = await response.json()
    localStorage.setItem('authToken', data.token)
    setSessionToken(data.token)
    await taskDb.deleteAll()
    await syncWithServer(data.token)
    setIsLogin(true)
  }

  const signup = async (username: string, password: string) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Signup failed')
    }
    const data = await response.json()
    localStorage.setItem('authToken', data.token)
    setSessionToken(data.token)
    await taskDb.deleteAll()
    await syncWithServer(data.token)
    setIsLogin(true)
    startSync(data.token)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setSessionToken('')
    setIsLogin(false)
    stopSync()
  }

  return (
    <AuthContext
      value={{
        sessionToken,
        isLogin,
        isLoading,
        getToken,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
