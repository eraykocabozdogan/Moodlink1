"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { setAuthToken } from "@/lib/apiClient"

interface User {
  id: string
  userName: string
  firstName: string
  lastName: string
  email: string
  bio?: string
  profileImageUrl?: string | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Tarayıcı depolamasından kimlik doğrulama durumunu yükle
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedToken = localStorage.getItem('auth_token')
        const storedUser = localStorage.getItem('auth_user')

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setToken(storedToken)
          setUser(parsedUser)
          setAuthToken(storedToken) // API istemcisine token'ı ayarla
        }
      } catch (error) {
        console.error('Auth state yüklenirken hata:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAuthState()
  }, [])

  // Giriş işlevi
  const login = (newToken: string, userData: User) => {
    setToken(newToken)
    setUser(userData)
    setAuthToken(newToken) // API istemcisine token'ı ayarla

    // Tarayıcı depolamasına kaydet
    localStorage.setItem('auth_token', newToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
  }

  // Çıkış işlevi
  const logout = () => {
    setToken(null)
    setUser(null)
    setAuthToken(null) // API istemcisinden token'ı kaldır

    // Tarayıcı depolamasından kaldır
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  // Kullanıcı bilgilerini güncelleme işlevi
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('auth_user', JSON.stringify(updatedUser))
    }
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}