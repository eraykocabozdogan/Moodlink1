"use client"

import { ArrowLeft } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useEffect, useState } from "react"

interface ThemeSettingsPageProps {
  onBack: () => void
}

export function ThemeSettingsPage({ onBack }: ThemeSettingsPageProps) {
  const { theme, setTheme, getAutoTheme } = useTheme()
  const [autoSelectedTheme, setAutoSelectedTheme] = useState<string>("")
  const [autoCompatibility, setAutoCompatibility] = useState<string>("")

  // Map theme IDs to display names
  const getThemeDisplayName = (themeId: string) => {
    const themeNameMap: Record<string, string> = {
      'white': 'Daylight',
      'nature': 'Forest',
      'ocean': 'Lake',
      'night': 'Night',
      'sunset': 'Sunset',
      'nirvana': 'Nirvana'
    }
    return themeNameMap[themeId] || themeId
  }

  // Get the auto-selected theme from localStorage and trigger auto selection if needed
  useEffect(() => {
    if (theme === "auto") {
      // Trigger auto theme selection to get fresh data
      getAutoTheme()
    }

    const selectedTheme = localStorage.getItem('auto-selected-theme')
    const compatibility = localStorage.getItem('auto-theme-compatibility')

    if (selectedTheme) {
      setAutoSelectedTheme(selectedTheme)
    }
    if (compatibility) {
      setAutoCompatibility(compatibility)
    }
  }, [theme, getAutoTheme])

  // Also listen for localStorage changes to update immediately
  useEffect(() => {
    const handleStorageChange = () => {
      const selectedTheme = localStorage.getItem('auto-selected-theme')
      const compatibility = localStorage.getItem('auto-theme-compatibility')

      if (selectedTheme) {
        setAutoSelectedTheme(selectedTheme)
      }
      if (compatibility) {
        setAutoCompatibility(compatibility)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const themes = [
    {
      id: "auto" as const,
      name: "Auto",
      percentage: autoSelectedTheme
        ? `→ ${getThemeDisplayName(autoSelectedTheme)} (${autoCompatibility}%)`
        : "Smart",
      colors: "from-purple-400 via-blue-400 to-green-400",
      description: autoSelectedTheme
        ? `Currently using ${getThemeDisplayName(autoSelectedTheme)} theme with ${autoCompatibility}% compatibility based on your mood data`
        : "Adapts based on your mood data",
      preview: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=200&fit=crop&crop=center&auto=format&q=80"
    },
    {
      id: "night" as const,
      name: "Night",
      percentage: "Dark",
      colors: "from-gray-700 to-gray-900",
      description: "For introspective moments",
      preview: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=200&fit=crop&crop=center&auto=format&q=80"
    },
    {
      id: "white" as const,
      name: "Daylight",
      percentage: "Clean",
      colors: "from-gray-100 to-white border border-gray-300",
      description: "Clean and minimal",
      preview: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=200&fit=crop&crop=center&auto=format&q=80"
    },
    {
      id: "nature" as const,
      name: "Forest",
      percentage: "Harmony",
      colors: "from-green-300 to-emerald-400",
      description: "For balanced, peaceful moods",
      preview: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=200&fit=crop&crop=center&auto=format&q=80"
    },
    {
      id: "sunset" as const,
      name: "Sunset",
      percentage: "Energy",
      colors: "from-orange-300 to-amber-400",
      description: "For energetic, happy moments",
      preview: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&h=200&fit=crop&crop=center&auto=format&q=80"
    },

    {
      id: "nirvana" as const,
      name: "Nirvana",
      percentage: "Peace",
      colors: "from-purple-300 to-violet-400",
      description: "For deep calm and meditation",
      preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&crop=center&auto=format&q=80"
    },
    {
      id: "ocean" as const,
      name: "Lake",
      percentage: "Dynamic",
      colors: "from-cyan-300 to-blue-400",
      description: "For dynamic, flowing energy",
      preview: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=200&fit=crop&crop=center&auto=format&q=80"
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
          <h1 className="text-xl font-bold text-foreground">Theme Selection</h1>
          <div className="w-10"></div> {/* Empty space to balance the right side */}
        </div>
      </div>

      <div className="p-4">
        <p className="text-muted-foreground mb-6">Available Themes:</p>
        <div className="space-y-6">
          {themes.map((themeOption) => (
            <div
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={`bg-card text-card-foreground rounded-xl overflow-hidden shadow-sm border-2 transition-all cursor-pointer ${
                theme === themeOption.id
                  ? "border-primary shadow-lg"
                  : "border-border hover:shadow-md hover:border-border/80"
              }`}
            >
              {/* Preview Image */}
              <div className="h-32 bg-cover bg-center relative" style={{ backgroundImage: themeOption.preview ? `url(${themeOption.preview})` : 'none' }}>
                <div className={`absolute inset-0 bg-gradient-to-r ${themeOption.colors} opacity-60`}></div>
                <div className="absolute top-2 right-2">
                  {theme === themeOption.id && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 bg-gradient-to-r ${themeOption.colors} rounded-full`}></div>
                    <div>
                      <span className="font-medium text-foreground">{themeOption.name}</span>
                      <p className="text-sm text-muted-foreground">{themeOption.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {themeOption.percentage}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
