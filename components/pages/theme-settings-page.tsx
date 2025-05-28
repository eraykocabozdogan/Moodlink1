"use client"

import { ArrowLeft } from "lucide-react"

interface ThemeSettingsPageProps {
  onBack: () => void
}

export function ThemeSettingsPage({ onBack }: ThemeSettingsPageProps) {
  const themes = [
    { name: "Rock", percentage: "48%", color: "from-gray-600 to-black" },
    { name: "Red", percentage: "60%", color: "from-red-500 to-red-700" },
    { name: "White", percentage: "28%", color: "from-gray-100 to-white" },
    { name: "Love", percentage: "60%", color: "from-pink-400 to-red-400" },
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
          {themes.map((theme, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${theme.color} rounded-full`}></div>
                  <span className="font-medium text-gray-800">{theme.name}</span>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{theme.percentage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
