"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Heart, Mail } from "lucide-react"

interface VerificationScreenProps {
  email: string
  onVerify: (code: string) => void
  onResendCode: () => void
  onGoBack: () => void
  type?: "signup" | "password-reset"
}

export function VerificationScreen({ 
  email, 
  onVerify, 
  onResendCode, 
  onGoBack,
  type = "signup" 
}: VerificationScreenProps) {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleVerify = async () => {
    if (code.length === 6) {
      setIsLoading(true)
      try {
        await onVerify(code)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleResendCode = async () => {
    setResendCooldown(60) // 60 second cooldown
    await onResendCode()
  }

  const getTitle = () => {
    return type === "signup" ? "Email Verification" : "Password Reset"
  }

  const getDescription = () => {
    return type === "signup" 
      ? "Enter the 6-digit code sent to your email to verify your account."
      : "Enter the 6-digit code sent to your email to reset your password."
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
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{getTitle()}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {getDescription()}
            </p>
            <p className="text-sm text-purple-600 font-medium">
              {email}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
                onComplete={handleVerify}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="h-12 w-12 border-gray-200 focus:border-purple-400 text-lg font-medium" />
                  <InputOTPSlot index={1} className="h-12 w-12 border-gray-200 focus:border-purple-400 text-lg font-medium" />
                  <InputOTPSlot index={2} className="h-12 w-12 border-gray-200 focus:border-purple-400 text-lg font-medium" />
                  <InputOTPSlot index={3} className="h-12 w-12 border-gray-200 focus:border-purple-400 text-lg font-medium" />
                  <InputOTPSlot index={4} className="h-12 w-12 border-gray-200 focus:border-purple-400 text-lg font-medium" />
                  <InputOTPSlot index={5} className="h-12 w-12 border-gray-200 focus:border-purple-400 text-lg font-medium" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <Button
              onClick={handleVerify}
              disabled={code.length !== 6 || isLoading}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>

          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">
              Didn't receive the code?
            </p>
            <Button
              onClick={handleResendCode}
              disabled={resendCooldown > 0}
              variant="outline"
              className="h-10 border-gray-200 hover:bg-gray-50 text-purple-600 hover:text-purple-700"
            >
              {resendCooldown > 0 
                ? `Resend (${resendCooldown}s)` 
                : "Resend Code"
              }
            </Button>
          </div>

          <div className="text-center">
            <button 
              onClick={onGoBack}
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
