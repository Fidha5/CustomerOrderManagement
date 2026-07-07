import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types'
import apiClient from '../services/api'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Debug: Log user state changes
  useEffect(() => {
    console.log('AuthContext - user state changed:', user)
    console.log('AuthContext - token state changed:', token)
  }, [user, token])

  useEffect(() => {
    // Check for existing token in localStorage
    const storedToken = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')

    console.log('AuthContext - Initializing, storedToken:', !!storedToken, 'storedUser:', !!storedUser)

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      console.log('AuthContext - Restored user from localStorage')
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    try {
      console.log('AuthContext.login - Attempting login with:', { email, password })
      const response = await apiClient.post('/auth/login', { email, password })
      console.log('AuthContext.login - Login successful:', response.data)

      const { access_token, user } = response.data

      console.log('AuthContext.login - Setting token and user in state')
      setToken(access_token)
      setUser(user)

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(user))

      console.log('AuthContext.login - Stored in localStorage, returning user:', user)
      return user
    } catch (error: any) {
      console.error('AuthContext.login - Login error:', error)
      console.error('AuthContext.login - Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.'
      throw new Error(errorMessage)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}