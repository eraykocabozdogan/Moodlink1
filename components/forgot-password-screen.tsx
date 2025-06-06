"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart, KeyRound } from "lucide-react"
import { VerificationScreen } from "./verification-screen"

interface ForgotPasswordScreenProps {
  onResetComplete: () => void
  onBackToLogin: () => void
}

export function ForgotPasswordScreen({ onResetComplete, onBackToLogin }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentStep, setCurrentStep] = useState<"email" | "verification" | "newPassword">("email")

  const handleSendCode = () => {
    if (email) {
      // Simulate sending verification email
      setCurrentStep("verification")
    }
  }

  const handleVerification = (code: string) => {
    // Simulate verification process
    console.log("Verification code:", code)
    setCurrentStep("newPassword")
  }

  const handleResendCode = () => {
    // Simulate resending verification code
    console.log("Resending verification code to:", email)
  }

  const handlePasswordReset = () => {
    if (newPassword && newPassword === confirmPassword) {
      // Simulate password reset
      console.log("Password reset successful")
      onResetComplete()
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
              disabled={!newPassword || newPassword !== confirmPassword}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
            >
              Update Password
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
            disabled={!email}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium"
          >
            Send Verification Code
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
