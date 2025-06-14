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

  console.log('useAuth hook called, current user:', user)

  useEffect(() => {
    console.log('useAuth useEffect called')
    const fetchUser = async () => {
      console.log('fetchUser function called')
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem('authToken')
        console.log('Token from localStorage:', token ? 'exists' : 'not found')
        if (!token) {
          console.log('No token found, creating mock user for testing')
          // Geçici mock user for testing (backend'den gelen gerçek ID ile)
          const mockUser: User = {
            id: "fddf0bae-469e-46d6-8de9-7b87c079e48d",
            firstName: "Test",
            lastName: "User",
            userName: "testuser",
            email: "test@example.com"
          }
          setUser(mockUser)
          setLoading(false)
          return
        }

        // Set the token in the API client
        apiClient.setAuthToken(token)
        console.log('Token set in API client')

        // Fetch user data
        console.log('Fetching user data...')
        const userData = await apiClient.getUserFromAuth()
        console.log('User data fetched:', userData)
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
