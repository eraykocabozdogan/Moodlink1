"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart } from "lucide-react"
import apiClient from "@/lib/apiClient"
import type { UserForLoginDto } from "@/lib/types/api"

interface LoginScreenProps {
  onLogin: (userData: any) => void
  onSwitchToSignup: () => void
  onForgotPassword: () => void
}

export function LoginScreen({ onLogin, onSwitchToSignup, onForgotPassword }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && username && password) {
      handleLogin()
    }
  }

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please fill in email and password fields.')
      return
    }

    setIsLoading(true)
    console.log('=== LOGIN ATTEMPT ===')
    console.log('Email:', username)
    console.log('Password Length:', password.length)

    try {
      const loginData: UserForLoginDto = {
        email: username,
        password: password
      }

      console.log('=== LOGIN REQUEST ===')
      console.log('Email:', loginData.email)
      console.log('Password Length:', loginData.password?.length)

      const response = await apiClient.login(loginData)

      console.log('=== LOGIN RESPONSE ===')
      console.log('Response:', JSON.stringify(response, null, 2))
      console.log('Response type:', typeof response)
      console.log('Response keys:', Object.keys(response || {}))

      // Set auth token in apiClient
      const token = response.accessToken?.token
      if (token) {
        console.log('Token found in response, setting auth token...')
        apiClient.setAuthToken(token)

        // Save token to localStorage
        localStorage.setItem('authToken', token)
        console.log('Token saved to localStorage')

        // Fetch real user data from backend
        try {
          const userData = await apiClient.getUserFromAuth()
          console.log('Real user data fetched:', userData)
          onLogin(userData)
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          // Fallback to basic user data
          onLogin({ username: username })
        }
      } else {
        console.error('No token found in response:', response)
        alert('Login failed: Could not retrieve token.')
      }
    } catch (error: any) {
      console.error('=== LOGIN ERROR ===')
      console.error('Error Message:', error.message)
      console.error('Status Code:', error.response?.status)
      console.error('Status Text:', error.response?.statusText)
      console.error('Response Data:', JSON.stringify(error.response?.data, null, 2))
      console.error('Request URL:', error.config?.url)
      console.error('Request Method:', error.config?.method)

      let errorMessage = 'An error occurred during login.'

      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password.'
      } else if (error.response?.status === 404) {
        errorMessage = 'API endpoint not found.'
      } else if (error.response?.status >= 500) {
        // Check for database connection issues
        const responseData = error.response?.data
        if (responseData?.detail?.includes('database operations') ||
            responseData?.detail?.includes('NpgsqlRetryingExecutionStrategy')) {
          errorMessage = `🔧 Backend Database Issue

Backend server is running but database connection is broken.

Temporary Solutions:
1. Use "Login with Google" button (for testing)
2. Report database issue to backend team
3. Try again in a few minutes

Technical Detail: PostgreSQL connection error`
        } else {
          errorMessage = 'Server error. Please try again later.'
        }
      } else if (error.isNetworkError || error.isCorsError || error.code === 'ERR_NETWORK' ||
                 error.message === 'Network Error' || error.message.includes('CORS') ||
                 error.message.includes('access control') || !error.response) {
        errorMessage = 'Network error. Please check your internet connection and try again.'
        console.error('Network/CORS error detected during login')
      }

      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    onLogin({ username: "Google User", id: 1 })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              MoodLink
            </h1>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-600">Login to MoodLink</h2>
            <p className="text-sm text-blue-500 mt-1">For your Mood</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black placeholder:text-gray-300 bg-transparent"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-black placeholder:text-gray-300 bg-transparent"
          />
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full h-12 border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500/10 hover:text-blue-600"
          >
            Login with Google
          </Button>
          <div className="text-center text-sm text-black space-x-2">
            <button
              onClick={onForgotPassword}
              className="hover:underline hover:text-gray-700"
            >
              Forgot Password?
            </button>
            <span>|</span>
            <button onClick={onSwitchToSignup} className="hover:underline hover:text-gray-700">
              Create New Account
            </button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
