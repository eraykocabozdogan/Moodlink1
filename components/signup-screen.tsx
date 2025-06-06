"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { VerificationScreen } from "./verification-screen"
import apiClient from "@/lib/apiClient" // API istemcisini import et
import { useToast } from "@/hooks/use-toast" // Toast hook'unu import et

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

  // Yükleme ve hata durumları için state'ler
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSignup = async () => {
    if (!fullName || !email || !password || !birthDate) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen tüm alanları doldurun.",
      })
      return
    }

    setIsLoading(true)

    try {
      // fullName'i firstName ve lastName'e ayır
      const nameParts = fullName.split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ')
      
      // email'den userName oluştur
      const userName = email.split('@')[0]

      const registrationData = {
        email,
        password,
        userName,
        firstName,
        lastName,
        dateOfBirth: birthDate,
      }

      // Backend'e kayıt isteği gönder
      await apiClient.post('/api/Auth/Register', registrationData)

      // Başarılı olursa doğrulama ekranını göster
      setShowVerification(true)

    } catch (err) {
      console.error('Signup error:', err)
      toast({
        variant: "destructive",
        title: "Kayıt Başarısız",
        description: err instanceof Error ? err.message : "Bir hata oluştu. Lütfen tekrar deneyin.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Bu fonksiyon, doğrulama başarılı olduktan sonra çağrılacak.
  // Şimdilik, sadece simüle edilmiş bir kullanıcı verisiyle onSignup'ı tetikliyor.
  // Gerçek akışta, doğrulama sonrası belki tekrar login olmak gerekebilir.
  const handleVerificationSuccess = (code: string) => {
    console.log("Verification successful with code:", code)
    // Doğrulama sonrası kullanıcıyı otomatik olarak login yapabilir veya login ekranına yönlendirebiliriz.
    // Şimdilik, başarılı bir kayıt sonrası direkt uygulamaya alıyoruz.
    onSignup({ username: fullName, email, id: Date.now() })
  }

  const handleResendCode = () => {
    // TODO: `/api/Auth/SendEmailValidation` endpoint'ini çağır
    console.log("Resending verification code to:", email)
    toast({ title: "Kod Tekrar Gönderildi", description: `Doğrulama kodu ${email} adresine tekrar gönderildi.` })
  }

  const handleGoogleSignup = () => {
    // TODO: Google ile giriş akışını backend'e bağla
    onSignup({ username: "Google User", email: "user@gmail.com", id: 1 })
  }

  if (showVerification) {
    return (
      <VerificationScreen
        email={email}
        type="signup"
        onVerify={handleVerificationSuccess} // Başarılı doğrulama sonrası çağrılacak fonksiyon
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
            disabled={isLoading}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
            disabled={isLoading}
          />
          <Input
            type="date"
            placeholder="Birth Date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
            disabled={isLoading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
            disabled={isLoading}
          />
          <Button
            onClick={handleSignup}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>
          <Button
            onClick={handleGoogleSignup}
            variant="outline"
            className="w-full h-12 border-gray-200 hover:bg-gray-50"
            disabled={isLoading}
          >
            Sign Up with Google
          </Button>
          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button onClick={onSwitchToLogin} className="text-purple-600 hover:underline" disabled={isLoading}>
              Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}