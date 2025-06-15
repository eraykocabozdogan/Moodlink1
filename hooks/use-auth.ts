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
    localStorage.removeItem('authToken')
    apiClient.clearAuthToken()
    setUser(null)
    setError(null)
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
