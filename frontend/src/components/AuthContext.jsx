import { createContext, useContext, useState, useEffect } from 'react'
import { getUser, isAuthenticated, getAuthToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    if (isAuthenticated()) {
      const storedUser = getUser()
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  // Compute authentication status based on current state
  const authStatus = user !== null || isAuthenticated()

  const value = {
    user,
    setUser,
    isAuthenticated: authStatus,
    token: getAuthToken(),
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

