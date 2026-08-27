import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  sessionToken: string | null
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessionToken, setSessionToken] = useState<string | null>(null)

  useEffect(() => {
    const sessionToken = localStorage.getItem('authToken')
  }, [])
  return (
    <AuthContext value={{ sessionToken, isAuthenticated: !!sessionToken }}>
      {children}
    </AuthContext>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
