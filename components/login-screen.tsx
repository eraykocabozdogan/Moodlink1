"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart } from "lucide-react"

interface LoginScreenProps {
  onLogin: (userData: any) => void
  onSwitchToSignup: () => void
}

export function LoginScreen({ onLogin, onSwitchToSignup }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    if (username && password) {
      onLogin({ username, id: 1 })
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
            <h2 className="text-xl font-semibold text-gray-800">MoodLink'e Giriş Yap</h2>
            <p className="text-sm text-gray-600 mt-1">For your Mood</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            onClick={handleLogin}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
          >
            Giriş Yap
          </Button>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full h-12 border-gray-200 hover:bg-gray-50"
          >
            Google ile Giriş Yap
          </Button>
          <div className="text-center text-sm text-gray-600 space-x-2">
            <button className="text-purple-600 hover:underline">Şifreni mi unuttun?</button>
            <span>|</span>
            <button onClick={onSwitchToSignup} className="text-purple-600 hover:underline">
              Yeni Hesap Oluştur
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
