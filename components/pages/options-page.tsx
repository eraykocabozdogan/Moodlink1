"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, X } from "lucide-react"
import apiClient from "@/lib/apiClient"

interface OptionsPageProps {
  onLogout: () => void
  onThemeSettings: () => void
}

export function OptionsPage({ onLogout, onThemeSettings }: OptionsPageProps) {
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handlePasswordChange = async () => {
    // Validation
    if (!passwordForm.currentPassword) {
      alert("Please enter your current password!")
      return
    }
    if (!passwordForm.newPassword) {
      alert("Please enter a new password!")
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match!")
      return
    }
    if (passwordForm.newPassword.length < 6) {
      alert("Password must be at least 6 characters!")
      return
    }

    setIsChangingPassword(true)
    try {
      console.log('Attempting to change password...')
      console.log('Request data:', {
        password: '***hidden***',
        newPassword: '***hidden***'
      })

      // Debug: Check token
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]))
          console.log('Token payload:', tokenPayload)
          console.log('Token claims:', Object.keys(tokenPayload))
        } catch (e) {
          console.log('Could not decode token')
        }
      }

      // Call backend API to change password
      await apiClient.changePassword(passwordForm.currentPassword, passwordForm.newPassword)

      alert("Your password has been successfully changed!")
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setShowPasswordChange(false)
    } catch (error: any) {
      console.error('Failed to change password:', error)
      console.error('Error response data:', error.response?.data)
      console.error('Error status:', error.response?.status)
      console.error('Error statusText:', error.response?.statusText)

      let errorMessage = 'Failed to change password. Please try again.'

      if (error.response?.status === 400) {
        errorMessage = 'Invalid current password or new password format.'
        if (error.response?.data?.message) {
          errorMessage += ` Details: ${error.response.data.message}`
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Current password is incorrect.'
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to change password.'
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.'
        if (error.response?.data?.message) {
          errorMessage += ` Details: ${error.response.data.message}`
        }
      }

      alert(errorMessage)
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (showPasswordChange) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setShowPasswordChange(false)} className="p-2 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Change Password</h1>
            <div className="w-10"></div> {/* Empty space to balance the right side */}
          </div>
        </div>

        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Enter your current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Enter your new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter your new password"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {isChangingPassword ? 'Changing...' : 'Change Password'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordChange(false)}
                  disabled={isChangingPassword}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-foreground">Options (Settings)</h1>
        </div>
      </div>

      <div className="bg-card">
        <div className="divide-y divide-border">
          <div className="p-4 hover:bg-muted cursor-pointer" onClick={onThemeSettings}>
            <span className="text-foreground font-medium">Theme</span>
          </div>

          <div className="p-4 flex justify-between items-center">
            <span className="text-foreground font-medium">Notifications</span>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <div className="p-4 hover:bg-muted cursor-pointer" onClick={() => setShowPasswordChange(true)}>
            <span className="text-foreground font-medium">Change Password</span>
          </div>

          <div className="p-4">
            <Button
              onClick={onLogout}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
