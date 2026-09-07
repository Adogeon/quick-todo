import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { startSync, stopSync } from '#/services/sync'
interface AuthContextType {
  sessionToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  signup: (username: string, password: string) => Promise<void>
  getToken: () => string | null
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      setSessionToken(token)
      startSync(token)
    }
    setIsLoading(false)
  }, [])

  const isAuthenticated = useMemo(() => !!sessionToken, [sessionToken])

  const getToken = () => localStorage.getItem('authToken')

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
    startSync(data.token)
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
    startSync(data.token)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setSessionToken(null)
    stopSync()
  }

  return (
    <AuthContext
      value={{
        sessionToken,
        isAuthenticated,
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
