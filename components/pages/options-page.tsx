"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

interface OptionsPageProps {
  onLogout: () => void
  onThemeSettings: () => void
}

export function OptionsPage({ onLogout, onThemeSettings }: OptionsPageProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-800">Seçenekler (Ayarlar)</h1>
      </div>

      <div className="bg-white">
        <div className="divide-y divide-gray-200">
          <div className="p-4 hover:bg-gray-50 cursor-pointer">
            <span className="text-gray-800 font-medium">Diller</span>
          </div>

          <div className="p-4 hover:bg-gray-50 cursor-pointer" onClick={onThemeSettings}>
            <span className="text-gray-800 font-medium">Tema</span>
          </div>

          <div className="p-4 flex justify-between items-center">
            <span className="text-gray-800 font-medium">Bildirimler</span>
            <Switch defaultChecked />
          </div>

          <div className="p-4 hover:bg-gray-50 cursor-pointer">
            <span className="text-gray-800 font-medium">Şifre Değiştir</span>
          </div>

          <div className="p-4">
            <Button
              onClick={onLogout}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
