"use client"

import { ArrowLeft } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useLanguage } from "../language-provider"

interface ThemeSettingsPageProps {
  onBack: () => void
}

export function ThemeSettingsPage({ onBack }: ThemeSettingsPageProps) {
  const { t } = useLanguage()
  const { theme, setTheme } = useTheme()

  const themes = [
    {
      id: "gece" as const,
      name: "Gece",
      percentage: "48%",
      colors: "from-gray-700 to-gray-900",
      description: "Koyu gri tonlar",
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
    {
      id: "dogasever" as const,
      name: "Doğasever",
      percentage: "35%",
      colors: "from-green-200 to-green-300",
      description: "Rahatlatıcı açık yeşil tonlar",
    },
    {
      id: "gokyuzu" as const,
      name: "Gökyüzü",
      percentage: "32%",
      colors: "from-blue-200 to-blue-300",
      description: "Ferahlatıcı açık mavi tonlar",
    },
    {
      id: "lavanta" as const,
      name: "Lavanta",
      percentage: "25%",
      colors: "from-purple-200 to-purple-300",
      description: "Sakinleştirici mor tonlar",
    },
    {
      id: "gunbatimi" as const,
      name: "Günbatımı",
      percentage: "27%",
      colors: "from-amber-200 to-orange-300",
      description: "Sıcak ve dinlendirici tonlar",
    },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">{t("title.theme")}</h1>
          <div className="w-10"></div> {/* Sağ tarafı dengelemek için boş alan */}
        </div>
      </div>

      <div className="p-4">
        <p className="text-muted-foreground mb-6">{t("options.theme")}:</p>
        <div className="space-y-4">
          {themes.map((themeOption) => (
            <div
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={`bg-card text-card-foreground rounded-xl p-4 shadow-sm border-2 transition-all cursor-pointer ${
                theme === themeOption.id
                  ? "border-primary shadow-lg"
                  : "border-border hover:shadow-md hover:border-border/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${themeOption.colors} rounded-full`}></div>
                  <div>
                    <span className="font-medium text-foreground">{themeOption.name}</span>
                    <p className="text-sm text-muted-foreground">{themeOption.description}</p>
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
