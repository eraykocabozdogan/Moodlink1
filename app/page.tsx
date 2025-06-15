"use client"

import { useState, useEffect } from "react"
import { LoginScreen } from "@/components/login-screen"
import { SignupScreen } from "@/components/signup-screen"
import { ForgotPasswordScreen } from "@/components/forgot-password-screen"
import { MainApp } from "@/components/main-app"
import apiClient from "@/lib/apiClient"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"loading" | "login" | "signup" | "forgot-password" | "app">("loading")
  const [user, setUser] = useState<any>(null)

  // Check for existing token on component mount
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('authToken')

      if (token) {
        // Set token in API client
        apiClient.setAuthToken(token)

        try {
          console.log('Found token in localStorage, validating...')

          // Add a timeout to prevent hanging on network issues
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), 10000) // 10 second timeout
          })

          const userDataPromise = apiClient.getUserFromAuth()

          const userData = await Promise.race([userDataPromise, timeoutPromise])
          console.log('User data fetched successfully:', userData)

          // Set user and navigate to app
          setUser(userData)
          setCurrentScreen('app')
        } catch (error: any) {
          console.error('Failed to fetch user data with stored token:', error)

          // Check if it's a network/CORS error
          if (error.isNetworkError || error.isCorsError || error.code === 'ERR_NETWORK' ||
              error.message === 'Network Error' || error.message === 'Request timeout' ||
              error.message.includes('CORS') || error.message.includes('access control')) {
            console.log('Network/CORS error detected, clearing token and redirecting to login')
          } else {
            console.log('Token validation failed, clearing token')
          }

          // Clear invalid token and redirect to login
          localStorage.removeItem('authToken')
          apiClient.clearAuthToken()
          setCurrentScreen('login')
        }
      } else {
        // No token found, navigate to login screen
        setCurrentScreen('login')
      }
    }

    validateToken()
  }, [])

  const handleLogin = (userData: any) => {
    setUser(userData)
    setCurrentScreen("app")
  }

  const handleSignup = (userData: any) => {
    setUser(userData)
    setCurrentScreen("app")
  }

  const handleLogout = () => {
    console.log('Logging out user...')

    // Clear ALL user-related data from localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('token') // Legacy token key
    localStorage.removeItem('user') // User data if stored
    localStorage.removeItem('userData') // Alternative user data key
    localStorage.removeItem('currentUser') // Another possible key

    // Clear any other app-specific data
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith('user') || key.startsWith('auth') || key.startsWith('token'))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))

    // Clear API client token
    apiClient.clearAuthToken()

    // Reset app state
    setUser(null)
    setCurrentScreen("login")

    console.log('Logout completed - all user data cleared')
  }

  const handleForgotPassword = () => {
    setCurrentScreen("forgot-password")
  }

  const handleResetComplete = () => {
    setCurrentScreen("login")
  }

  if (currentScreen === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (currentScreen === "login") {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onSwitchToSignup={() => setCurrentScreen("signup")}
        onForgotPassword={handleForgotPassword}
      />
    )
  }

  if (currentScreen === "signup") {
    return (
      <SignupScreen 
        onSignup={handleSignup} 
        onSwitchToLogin={() => setCurrentScreen("login")} 
      />
    )
  }

  if (currentScreen === "forgot-password") {
    return (
      <ForgotPasswordScreen
        onResetComplete={handleResetComplete}
        onBackToLogin={() => setCurrentScreen("login")}
      />
    )
  }

  return <MainApp user={user} onLogout={handleLogout} />
}
