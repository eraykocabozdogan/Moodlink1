"use client"

import { useState, useEffect } from 'react'
import apiClient from '@/lib/apiClient'
import { UUID } from '@/lib/types/api'

interface User {
  id: UUID
  firstName?: string
  lastName?: string
  userName?: string
  email?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem('authToken')
        if (!token) {
          setLoading(false)
          return
        }

        // Set the token in the API client
        apiClient.setAuthToken(token)

        // Fetch user data
        const userData = await apiClient.getUserFromAuth()
        setUser(userData)
      } catch (err: any) {
        console.error('Failed to fetch user:', err)
        setError(err.message || 'Failed to fetch user data')
        // Clear invalid token
        localStorage.removeItem('authToken')
        apiClient.clearAuthToken()
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const login = (token: string, userData: User) => {
    localStorage.setItem('authToken', token)
    apiClient.setAuthToken(token)
    setUser(userData)
    setError(null)
  }

  const logout = () => {
    console.log('useAuth logout called - clearing all user data')

    // Clear ALL user-related data from localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('token') // Legacy token key
    localStorage.removeItem('user') // User data if stored
    localStorage.removeItem('userData') // Alternative user data key
    localStorage.removeItem('currentUser') // Another possible key

    // Clear any other app-specific data that might contain user info
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith('user') || key.startsWith('auth') || key.startsWith('token'))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => {
      console.log('Removing localStorage key:', key)
      localStorage.removeItem(key)
    })

    // Clear API client
    apiClient.clearAuthToken()

    // Reset state
    setUser(null)
    setError(null)

    console.log('useAuth logout completed')
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  }
}
