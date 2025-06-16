"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ThemeBackground } from "@/components/ui/theme-background"
import { Heart } from "lucide-react"
import { VerificationScreen } from "./verification-screen"
import apiClient from "@/lib/apiClient"
import type { EnhancedUserForRegisterDto } from "@/lib/types/api"

interface SignupScreenProps {
  onSignup: (userData: any) => void
  onSwitchToLogin: () => void
}

export function SignupScreen({ onSignup, onSwitchToLogin }: SignupScreenProps) {
  // State'leri ad ve soyad için ayırdık
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [password, setPassword] = useState("")
  const [showVerification, setShowVerification] = useState(false)

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && firstName && lastName && userName && email && password) {
      handleSignup()
    }
  }
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async () => {
    // Validasyonu ad, soyad ve username için güncelledik
    if (!firstName || !lastName || !userName || !email || !password) {
      alert('Lütfen tüm zorunlu alanları doldurun.')
      return
    }

    setIsLoading(true)

    try {
      const registerData: EnhancedUserForRegisterDto = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        userName: userName, // Artık gerçek username kullanılıyor
        birthDate: birthDate ? new Date(birthDate).toISOString() : undefined,
        phoneNumber: undefined // Opsiyonel alan
      }

      console.log('=== REGISTER REQUEST DATA ===')
      console.log('First Name:', registerData.firstName)
      console.log('Last Name:', registerData.lastName)
      console.log('Email:', registerData.email)
      console.log('User Name:', registerData.userName)
      console.log('Birth Date:', registerData.birthDate)
      console.log('Phone Number:', registerData.phoneNumber)
      console.log('Password Length:', registerData.password?.length)
      const response = await apiClient.register(registerData)
      console.log('Register API Response received:', response)

      // Kayıt başarılı, email doğrulama kodu gönder
      try {
        console.log('Sending email validation code to:', email)
        const emailValidationResponse = await apiClient.sendEmailValidation({ email: email })
        console.log('Email validation code sent successfully:', emailValidationResponse)

        // Email gönderim başarılı mesajı göster
        if (emailValidationResponse?.isSuccess) {
          console.log('Email validation code will expire at:', emailValidationResponse.expireDate)
        }
      } catch (emailError: any) {
        // Email gönderimi başarısız olsa bile doğrulama ekranını göster
        // Kullanıcı "Resend Code" butonunu kullanabilir
        alert('Kayıt başarılı! Ancak email doğrulama kodu gönderilemedi. Doğrulama ekranında "Resend Code" butonunu kullanabilirsiniz.')
      }

      // Doğrulama ekranını göster
      setShowVerification(true)
    } catch (error: any) {

      let errorMessage = 'Kayıt olurken bir hata oluştu.'

      // Check response data for specific error messages
      const responseData = error.response?.data
      const errorDetail = responseData?.detail || responseData?.message || ''

      if (error.response?.status === 400) {
        errorMessage = 'Geçersiz bilgiler. Lütfen bilgilerinizi ve şifre kurallarını kontrol edin.'
      } else if (error.response?.status === 409) {
        errorMessage = 'Bu email adresi zaten kullanımda.'
      } else if (error.response?.status === 500) {
        // Check if it's actually a validation error disguised as 500
        if (errorDetail.toLowerCase().includes('validation failed')) {
          // Parse validation errors from the detail message
          const validationErrors = []

          if (errorDetail.includes('Password')) {
            if (errorDetail.includes('at least 6 characters')) {
              validationErrors.push('• Şifre en az 6 karakter olmalı')
            }
            if (errorDetail.includes('uppercase letter') || errorDetail.includes('lowercase letter') ||
                errorDetail.includes('number') || errorDetail.includes('special character')) {
              validationErrors.push('• Şifre büyük harf, küçük harf, rakam ve özel karakter içermeli')
            }
          }

          if (errorDetail.includes('Email')) {
            validationErrors.push('• Geçerli bir email adresi girin')
          }

          if (errorDetail.includes('FirstName') || errorDetail.includes('LastName')) {
            validationErrors.push('• Ad ve soyad alanları zorunlu')
          }

          if (errorDetail.includes('UserName')) {
            validationErrors.push('• Kullanıcı adı zorunlu')
          }

          if (validationErrors.length > 0) {
            errorMessage = 'Lütfen aşağıdaki hataları düzeltin:\n\n' + validationErrors.join('\n')
          } else {
            errorMessage = 'Lütfen bilgilerinizi kontrol edin:\n\n• Şifre: min 6 karakter, büyük/küçük harf, rakam, özel karakter\n• Tüm alanlar zorunlu'
          }
        } else {
          errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.'
        }
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMessage = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.'
      }

      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = (code: string) => {
    console.log("Verification code:", code)
    // Doğrulama sonrası otomatik login yerine login ekranına yönlendirmek daha doğru bir akış olabilir.
    // Şimdilik mevcut akışı koruyoruz.
    onSignup({ username: userName, email, id: 1 })
  }

  const handleResendCode = async () => {
    try {
      console.log("Resending verification code to:", email)
      await apiClient.sendEmailValidation({ email: email })
      console.log("Verification code resent successfully")
      alert("Doğrulama kodu tekrar gönderildi. Lütfen email kutunuzu kontrol edin.")
    } catch (error: any) {
      console.error("Failed to resend verification code:", error)
      alert("Doğrulama kodu gönderilemedi. Lütfen daha sonra tekrar deneyin.")
    }
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
    <ThemeBackground>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-card/90 backdrop-blur-sm">
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
          {/* Ad ve Soyad için iki ayrı input */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2">
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
            />
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
            />
          </div>
          <Input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
          />
          <Input
            type="date"
            placeholder="Birth Date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
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
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button onClick={onSwitchToLogin} className="text-primary hover:underline">
              Login
            </button>
          </div>
          </CardContent>
        </Card>
      </div>
    </ThemeBackground>
  )
}