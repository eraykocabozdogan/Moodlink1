"use client"

import { ArrowLeft } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface ThemeSettingsPageProps {
  onBack: () => void
}

export function ThemeSettingsPage({ onBack }: ThemeSettingsPageProps) {
  const { theme, setTheme } = useTheme()

  const themes = [
    {
      id: "default" as const,
      name: "Varsayılan",
      percentage: "85%",
      colors: "from-purple-500 to-pink-500",
      description: "Klasik mor-pembe gradient",
    },
    {
      id: "rock" as const,
      name: "Rock",
      percentage: "48%",
      colors: "from-gray-600 to-black",
      description: "Koyu ve güçlü tonlar",
    },
    {
      id: "red" as const,
      name: "Red",
      percentage: "60%",
      colors: "from-red-500 to-red-700",
      description: "Ateşli kırmızı tonları",
    },
    {
      id: "white" as const,
      name: "White",
      percentage: "28%",
      colors: "from-gray-100 to-white border border-gray-300",
      description: "Temiz ve minimal",
    },
    {
      id: "love" as const,
      name: "Love",
      percentage: "60%",
      colors: "from-pink-400 to-red-400",
      description: "Romantik pembe tonları",
    },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Tema Seçimi</h1>
        </div>
      </div>

      <div className="p-4">
        <p className="text-gray-600 mb-6">Mevcut Temalar:</p>
        <div className="space-y-4">
          {themes.map((themeOption) => (
            <div
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all cursor-pointer ${
                theme === themeOption.id
                  ? "border-purple-500 shadow-lg"
                  : "border-gray-200 hover:shadow-md hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${themeOption.colors} rounded-full`}></div>
                  <div>
                    <span className="font-medium text-gray-800">{themeOption.name}</span>
                    <p className="text-sm text-gray-500">{themeOption.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {themeOption.percentage}
                  </span>
                  {theme === themeOption.id && (
                    <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
