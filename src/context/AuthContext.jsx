import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authService } from '../services/authService.js'
import { setTokenAccessor } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  setTokenAccessor(() => localStorage.getItem('token'))

  const persistToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
    setToken(newToken)
  }

  const fetchMe = useCallback(async () => {
    const stored = localStorage.getItem('token')
    if (!stored) {
      setLoading(false)
      return
    }
    try {
      const res = await authService.getMe()
      setUser(res.data.user)
    } catch {
      persistToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    persistToken(res.data.token)
    setUser(res.data.user)
    return res.data.user
  }

  const register = async (payload) => {
    const res = await authService.register(payload)
    persistToken(res.data.token)
    setUser(res.data.user)
    return res.data.user
  }

  const logout = () => {
    persistToken(null)
    setUser(null)
  }

  const updateUser = (updated) => setUser(updated)

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee',
    login,
    register,
    logout,
    updateUser,
    refreshUser: fetchMe,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
