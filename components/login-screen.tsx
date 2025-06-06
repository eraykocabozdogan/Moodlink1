"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart } from "lucide-react"

interface LoginScreenProps {
  onLogin: (userData: any) => void
  onSwitchToSignup: () => void
  onForgotPassword: () => void
}

export function LoginScreen({ onLogin, onSwitchToSignup, onForgotPassword }: LoginScreenProps) {
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
            <h2 className="text-xl font-semibold text-white">Login to MoodLink</h2>
            <p className="text-sm text-white mt-1">For your Mood</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-12 border-gray-300 focus:border-white focus:ring-white text-white placeholder:text-gray-300 bg-transparent"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 border-gray-300 focus:border-white focus:ring-white text-white placeholder:text-gray-300 bg-transparent"
          />
          <Button
            onClick={handleLogin}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium"
          >
            Login
          </Button>
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full h-12 border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500/10 hover:text-blue-600"
          >
            Login with Google
          </Button>
          <div className="text-center text-sm text-white space-x-2">
            <button 
              onClick={onForgotPassword}
              className="hover:underline"
            >
              Forgot Password?
            </button>
            <span>|</span>
            <button onClick={onSwitchToSignup} className="hover:underline">
              Create New Account
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
