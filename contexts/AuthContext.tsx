"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import apiClient from '@/lib/apiClient'

// Define the shape of our auth state
export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  userName: string
  token: string
  // Add any other user properties you need
}

// Define the shape of the context
interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<AuthUser>) => void
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Props interface for AuthProvider
interface AuthProviderProps {
  children: ReactNode
  initialUser?: any
  onLogout?: () => void
}

export function AuthProvider({ children, initialUser, onLogout }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Initialize auth state from localStorage on mount (client-side only)
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('moodlink_auth')
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          
          // Set the auth token for API calls
          if (parsedUser.token) {
            apiClient.setAuthToken(parsedUser.token)
          }
        } else if (initialUser) {
          // If no stored user but initialUser was provided (SSR scenario)
          setUser(initialUser)
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserFromStorage()
  }, [initialUser])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      // Replace with your actual login endpoint
      const response = await apiClient.post('/api/Auth/login', { email, password })
      
      // Format the user data with token
      const userData: AuthUser = {
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        userName: response.userName,
        token: response.token,
        // Add any other properties from the response
      }

      // Save to state and localStorage
      setUser(userData)
      localStorage.setItem('moodlink_auth', JSON.stringify(userData))
      
      // Set the auth token for API calls
      apiClient.setAuthToken(userData.token)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    // Clear auth data
    setUser(null)
    localStorage.removeItem('moodlink_auth')
    apiClient.setAuthToken(null)
    
    // Call the provided onLogout callback if exists
    if (onLogout) {
      onLogout()
    }
  }

  // Update user data
  const updateUser = (userData: Partial<AuthUser>) => {
    if (!user) return

    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem('moodlink_auth', JSON.stringify(updatedUser))
  }

  // Provide the auth context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
