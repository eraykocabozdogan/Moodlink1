"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart, KeyRound } from "lucide-react"
import { VerificationScreen } from "./verification-screen"
import apiClient from "@/lib/apiClient"

interface ForgotPasswordScreenProps {
  onResetComplete: () => void
  onBackToLogin: () => void
}

export function ForgotPasswordScreen({ onResetComplete, onBackToLogin }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentStep, setCurrentStep] = useState<"email" | "verification" | "newPassword">("email")
  const [isLoading, setIsLoading] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")

  const handleSendCode = async () => {
    if (!email) {
      alert('Lütfen email adresinizi girin.')
      return
    }

    setIsLoading(true)
    console.log('=== PASSWORD RESET REQUEST ===')
    console.log('Email:', email)

    try {
      console.log('Sending password reset code to:', email)
      const response = await apiClient.sendPasswordResetCode({ email: email })
      console.log('Password reset code sent successfully:', response)

      // Email gönderim başarılı, doğrulama ekranına geç
      setCurrentStep("verification")
      alert('Şifre sıfırlama kodu email adresinize gönderildi.')
    } catch (error: any) {
      console.error('=== PASSWORD RESET ERROR ===')
      console.error('Error Message:', error.message)
      console.error('Status Code:', error.response?.status)
      console.error('Response Data:', JSON.stringify(error.response?.data, null, 2))

      let errorMessage = 'Şifre sıfırlama kodu gönderilemedi.'

      if (error.response?.status === 404) {
        errorMessage = 'Bu email adresi ile kayıtlı kullanıcı bulunamadı.'
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
    // Store the verification code for password reset
    console.log("Verification code:", code)
    setVerificationCode(code)
    setCurrentStep("newPassword")
  }

  const handleResendCode = async () => {
    try {
      console.log("Resending password reset code to:", email)
      await apiClient.sendPasswordResetCode({ email: email })
      console.log("Password reset code resent successfully")
      alert("Şifre sıfırlama kodu tekrar gönderildi. Lütfen email kutunuzu kontrol edin.")
    } catch (error: any) {
      console.error("Failed to resend password reset code:", error)
      alert("Şifre sıfırlama kodu gönderilemedi. Lütfen daha sonra tekrar deneyin.")
    }
  }

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      alert('Lütfen tüm alanları doldurun.')
      return
    }

    if (newPassword !== confirmPassword) {
      alert('Şifreler eşleşmiyor.')
      return
    }

    if (!verificationCode) {
      alert('Doğrulama kodu bulunamadı. Lütfen tekrar deneyin.')
      return
    }

    setIsLoading(true)
    console.log('=== PASSWORD RESET ===')
    console.log('Email:', email)
    console.log('Verification Code:', verificationCode)
    console.log('New Password Length:', newPassword.length)

    try {
      const resetData = {
        email: email,
        code: verificationCode,
        newPassword: newPassword
      }

      console.log('Sending reset password request to API...')
      const response = await apiClient.resetPassword(resetData)
      console.log('Reset password API Response:', response)

      alert('Şifreniz başarıyla güncellendi!')
      onResetComplete()
    } catch (error: any) {
      console.error('=== PASSWORD RESET ERROR ===')
      console.error('Error Message:', error.message)
      console.error('Status Code:', error.response?.status)
      console.error('Response Data:', JSON.stringify(error.response?.data, null, 2))

      let errorMessage = 'Şifre güncellenirken bir hata oluştu.'

      if (error.response?.status === 400) {
        errorMessage = 'Geçersiz şifre formatı. Lütfen daha güçlü bir şifre seçin.'
      } else if (error.response?.status === 404) {
        errorMessage = 'Doğrulama kodu bulunamadı veya süresi dolmuş.'
      } else if (error.response?.status >= 500) {
        errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.'
      }

      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (currentStep === "verification") {
    return (
      <VerificationScreen
        email={email}
        type="password-reset"
        onVerify={handleVerification}
        onResendCode={handleResendCode}
        onGoBack={() => setCurrentStep("email")}
      />
    )
  }

  if (currentStep === "newPassword") {
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
            
            <div className="space-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
                <KeyRound className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Set New Password</h2>
              <p className="text-sm text-gray-600">
                Create a new password for your account.
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
            />
            <Button
              onClick={handlePasswordReset}
              disabled={!newPassword || newPassword !== confirmPassword || isLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium disabled:opacity-50"
            >
              {isLoading ? 'Güncelleniyor...' : 'Update Password'}
            </Button>
            <div className="text-center">
              <button 
                onClick={() => setCurrentStep("verification")}
                className="text-sm text-gray-500 hover:text-purple-600 hover:underline"
              >
                ← Go back
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
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
          
          <div className="space-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
              <KeyRound className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Forgot Password?</h2>
            <p className="text-sm text-gray-600">
              Enter your email address and we'll send you a password reset code.
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
          />
          <Button
            onClick={handleSendCode}
            disabled={!email || isLoading}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium disabled:opacity-50"
          >
            {isLoading ? 'Gönderiliyor...' : 'Send Verification Code'}
          </Button>
          <div className="text-center">
            <button 
              onClick={onBackToLogin}
              className="text-sm text-gray-500 hover:text-purple-600 hover:underline"
            >
              ← Return to login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
