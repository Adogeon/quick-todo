import { createContext, useContext, useEffect, useState, useMemo } from 'react'

interface AuthContextType {
  sessionToken: string | null
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionToken, setSessionToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) setSessionToken(token)
  }, [])

  const isAuthenticated = useMemo(() => !!sessionToken, [sessionToken])
  return (
    <AuthContext value={{ sessionToken, isAuthenticated }}>
      {children}
    </AuthContext>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
