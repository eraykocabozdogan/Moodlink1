"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/login-screen"
import { SignupScreen } from "@/components/signup-screen"
import { MainApp } from "@/components/main-app"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<"login" | "signup" | "app">("login")
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

  if (currentScreen === "login") {
    return <LoginScreen onLogin={handleLogin} onSwitchToSignup={() => setCurrentScreen("signup")} />
  }

  if (currentScreen === "signup") {
    return <SignupScreen onSignup={handleSignup} onSwitchToLogin={() => setCurrentScreen("login")} />
  }

  return <MainApp user={user} onLogout={handleLogout} />
}
