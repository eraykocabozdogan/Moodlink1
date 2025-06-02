"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Check, X } from "lucide-react"
import { useLanguage, Language } from "@/components/language-provider"

interface OptionsPageProps {
  onLogout: () => void
  onThemeSettings: () => void
}

export function OptionsPage({ onLogout, onThemeSettings }: OptionsPageProps) {
  const { language, setLanguage, t } = useLanguage()
  const [showLanguages, setShowLanguages] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language)
  const [notifications, setNotifications] = useState(true)

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Dil değişikliklerini takip et
  useEffect(() => {
    setSelectedLanguage(language)
  }, [language])

  const languages = [
    { code: "tr" as Language, name: "Türkçe", flag: "🇹🇷" },
    { code: "en" as Language, name: "English", flag: "🇺🇸" },
    { code: "de" as Language, name: "Deutsch", flag: "🇩🇪" },
    { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
    { code: "es" as Language, name: "Español", flag: "🇪🇸" },
  ]

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Yeni şifreler eşleşmiyor!")
      return
    }
    if (passwordForm.newPassword.length < 6) {
      alert("Şifre en az 6 karakter olmalıdır!")
      return
    }

    // Şifre değiştirme işlemi
    alert("Şifreniz başarıyla değiştirildi!")
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setShowPasswordChange(false)
  }

  const handleLanguageSelect = (langCode: Language) => {
    setSelectedLanguage(langCode)
    setLanguage(langCode)
    setShowLanguages(false)
  }

  if (showLanguages) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setShowLanguages(false)} className="p-2 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">{t("title.language")}</h1>
            <div className="w-10"></div> {/* Sağ tarafı dengelemek için boş alan */}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {languages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedLanguage === lang.code ? "border-purple-500 bg-purple-50" : "border-border hover:bg-muted"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium text-foreground">{lang.name}</span>
                </div>
                {selectedLanguage === lang.code && (
                  <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (showPasswordChange) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setShowPasswordChange(false)} className="p-2 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">{t("title.password")}</h1>
            <div className="w-10"></div> {/* Sağ tarafı dengelemek için boş alan */}
          </div>
        </div>

        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("title.password")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">{t("options.currentPassword")}</label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder={t("options.currentPassword")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t("options.newPassword")}</label>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder={t("options.newPassword")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">{t("options.confirmPassword")}</label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder={t("options.confirmPassword")}
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handlePasswordChange}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {t("options.save")}
                </Button>
                <Button variant="outline" onClick={() => setShowPasswordChange(false)}>
                  <X className="w-4 h-4 mr-2" />
                  {t("options.cancel")}
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
          <h1 className="text-xl font-bold text-foreground">{t("title.options")}</h1>
        </div>
      </div>

      <div className="bg-card">
        <div className="divide-y divide-border">
          <div className="p-4 hover:bg-muted cursor-pointer" onClick={() => setShowLanguages(true)}>
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">{t("options.languages")}</span>
              <span className="text-muted-foreground text-sm">
                {languages.find((l) => l.code === selectedLanguage)?.name}
              </span>
            </div>
          </div>

          <div className="p-4 hover:bg-muted cursor-pointer" onClick={onThemeSettings}>
            <span className="text-foreground font-medium">{t("options.theme")}</span>
          </div>

          <div className="p-4 flex justify-between items-center">
            <span className="text-foreground font-medium">{t("options.notifications")}</span>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <div className="p-4 hover:bg-muted cursor-pointer" onClick={() => setShowPasswordChange(true)}>
            <span className="text-foreground font-medium">{t("options.changePassword")}</span>
          </div>

          <div className="p-4">
            <Button
              onClick={onLogout}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              {t("options.logout")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
