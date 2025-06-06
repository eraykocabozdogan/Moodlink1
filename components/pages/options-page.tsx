"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, X } from "lucide-react"
import apiClient from "@/lib/apiClient"
import { useToast } from "@/hooks/use-toast"

interface OptionsPageProps {
  onLogout: () => void
  onThemeSettings: () => void
}

export function OptionsPage({ onLogout, onThemeSettings }: OptionsPageProps) {
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Yeni şifreler uyuşmuyor!",
      })
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Şifre en az 6 karakter olmalıdır!",
      })
      return
    }

    setIsLoading(true)

    try {
      // Swagger'a göre PUT /api/Users/FromAuth endpoint'i kullanılıyor.
      // Not: Bu endpoint hem profil güncelleme hem de şifre için kullanılıyor gibi görünüyor.
      const payload = {
        password: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }
      
      await apiClient.put('/api/Users/FromAuth', payload)

      toast({
        title: "Başarılı",
        description: "Şifreniz başarıyla değiştirildi.",
      })
      
      // Formu temizle ve ekranı kapat
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setShowPasswordChange(false)

    } catch (error) {
      console.error("Password change failed:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: error instanceof Error ? error.message : "Şifre değiştirilemedi. Mevcut şifrenizi kontrol edin.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (showPasswordChange) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center">
            <button onClick={() => setShowPasswordChange(false)} className="p-2 hover:bg-muted rounded-full mr-2">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Şifre Değiştir</h1>
          </div>
        </div>

        <div className="p-4">
          <Card>
            <CardHeader><CardTitle>Yeni Şifre Belirle</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Mevcut Şifre</label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Mevcut şifrenizi girin"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Yeni Şifre</label>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Yeni şifrenizi girin"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Yeni Şifre (Tekrar)</label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Yeni şifrenizi tekrar girin"
                  disabled={isLoading}
                />
              </div>
              <div className="flex space-x-3">
                <Button onClick={handlePasswordChange} disabled={isLoading}>
                  <Check className="w-4 h-4 mr-2" />
                  {isLoading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
                </Button>
                <Button variant="outline" onClick={() => setShowPasswordChange(false)} disabled={isLoading}>
                  <X className="w-4 h-4 mr-2" />
                  İptal
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
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-foreground">Seçenekler</h1>
        </div>
      </div>

      <div className="bg-card">
        <div className="divide-y divide-border">
          <div className="p-4 hover:bg-muted cursor-pointer" onClick={onThemeSettings}>
            <span className="text-foreground font-medium">Tema</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-foreground font-medium">Bildirimler</span>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <div className="p-4 hover:bg-muted cursor-pointer" onClick={() => setShowPasswordChange(true)}>
            <span className="text-foreground font-medium">Şifre Değiştir</span>
          </div>
          <div className="p-4">
            <Button onClick={onLogout} variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}