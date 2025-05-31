"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/login-screen"
import { SignupScreen } from "@/components/signup-screen"
import { ForgotPasswordScreen } from "@/components/forgot-password-screen"
import { MainApp } from "@/components/main-app"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "signup" | "forgot-password" | "app">("login")
  const [user, setUser] = useState<any>(null)

  const handleLogin = (userData: any) => {
    setUser(userData)
    setCurrentScreen("app")
  }

  const handleSignup = (userData: any) => {
    setUser(userData)
    setCurrentScreen("app")
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentScreen("login")
  }

  const handleForgotPassword = () => {
    setCurrentScreen("forgot-password")
  }

  const handleResetComplete = () => {
    setCurrentScreen("login")
  }

  if (currentScreen === "login") {
    return (
      <LoginScreen 
        onLogin={handleLogin} 
        onSwitchToSignup={() => setCurrentScreen("signup")}
        onForgotPassword={handleForgotPassword}
      />
    )
  }

  if (currentScreen === "signup") {
    return (
      <SignupScreen 
        onSignup={handleSignup} 
        onSwitchToLogin={() => setCurrentScreen("login")} 
      />
    )
  }

  if (currentScreen === "forgot-password") {
    return (
      <ForgotPasswordScreen
        onResetComplete={handleResetComplete}
        onBackToLogin={() => setCurrentScreen("login")}
      />
    )
  }

  return <MainApp user={user} onLogout={handleLogout} />
}
