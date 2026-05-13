import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: number
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    })
    
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Login failed')
    }
    
    const data = await res.json()
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include'
    })
    
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Registration failed')
    }
    
    const data = await res.json()
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
  }

  const logout = () => {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}