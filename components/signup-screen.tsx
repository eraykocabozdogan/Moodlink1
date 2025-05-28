"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart } from "lucide-react"

interface SignupScreenProps {
  onSignup: (userData: any) => void
  onSwitchToLogin: () => void
}

export function SignupScreen({ onSignup, onSwitchToLogin }: SignupScreenProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = () => {
    if (fullName && email && password) {
      onSignup({ username: fullName, email, id: 1 })
    }
  }

  const handleGoogleSignup = () => {
    onSignup({ username: "Google User", email: "user@gmail.com", id: 1 })
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
            <h2 className="text-xl font-semibold text-gray-800">Hesap Oluştur</h2>
            <p className="text-sm text-gray-600 mt-1">For your Mood</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Adınız Soyadınız"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
          />
          <Input
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
          />
          <Input
            type="date"
            placeholder="Doğum Tarihi"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
          />
          <Input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
          />
          <Button
            onClick={handleSignup}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
          >
            Kayıt Ol
          </Button>
          <Button
            onClick={handleGoogleSignup}
            variant="outline"
            className="w-full h-12 border-gray-200 hover:bg-gray-50"
          >
            Google ile Kayıt Ol
          </Button>
          <div className="text-center text-sm text-gray-600">
            Zaten bir hesabın var mı?{" "}
            <button onClick={onSwitchToLogin} className="text-purple-600 hover:underline">
              Giriş Yap
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
