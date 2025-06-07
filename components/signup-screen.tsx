"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { VerificationScreen } from "./verification-screen"
import apiClient from "@/lib/apiClient"
import type { EnhancedUserForRegisterDto } from "@/lib/types/api"

interface SignupScreenProps {
  onSignup: (userData: any) => void
  onSwitchToLogin: () => void
}

export function SignupScreen({ onSignup, onSwitchToLogin }: SignupScreenProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [password, setPassword] = useState("")
  const [showVerification, setShowVerification] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async () => {
    if (!fullName || !email || !password) {
      alert('Lütfen tüm alanları doldurun.')
      return
    }

    setIsLoading(true)
    console.log('Signup attempt started with:', { fullName, email, birthDate })

    try {
      // Split fullName into firstName and lastName
      const nameParts = fullName.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      const registerData: EnhancedUserForRegisterDto = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        userName: email, // Using email as username
        birthDate: birthDate ? new Date(birthDate).toISOString() : undefined,
        phoneNumber: undefined // Optional field
      }

      console.log('Sending register request to API...')
      const response = await apiClient.register(registerData)
      console.log('Register API Response received:', response)

      // Registration successful, show verification screen
      setShowVerification(true)
    } catch (error: any) {
      console.error('Signup error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        fullError: error
      })

      let errorMessage = 'Kayıt olurken bir hata oluştu.'

      if (error.response?.status === 400) {
        errorMessage = 'Geçersiz bilgiler. Lütfen bilgilerinizi kontrol edin.'
      } else if (error.response?.status === 409) {
        errorMessage = 'Bu email adresi zaten kullanımda.'
      } else if (error.response?.status >= 500) {
        errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.'
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMessage = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.'
      }

      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = (code: string) => {
    // Simulate verification process
    console.log("Verification code:", code)
    onSignup({ username: fullName, email, id: 1 })
  }

  const handleResendCode = () => {
    // Simulate resending verification code
    console.log("Resending verification code to:", email)
  }

  const handleGoogleSignup = () => {
    onSignup({ username: "Google User", email: "user@gmail.com", id: 1 })
  }

  if (showVerification) {
    return (
      <VerificationScreen
        email={email}
        type="signup"
        onVerify={handleVerification}
        onResendCode={handleResendCode}
        onGoBack={() => setShowVerification(false)}
      />
    )
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
            <h2 className="text-xl font-semibold text-gray-800">Create Account</h2>
            <p className="text-sm text-gray-600 mt-1">For your Mood</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
          />
          <Input
            type="date"
            placeholder="Birth Date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
          />
          <Button
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Kayıt oluşturuluyor...' : 'Sign Up'}
          </Button>
          <Button
            onClick={handleGoogleSignup}
            variant="outline"
            className="w-full h-12 border-gray-200 hover:bg-gray-50"
          >
            Sign Up with Google
          </Button>
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button onClick={onSwitchToLogin} className="text-purple-600 hover:underline">
              Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
