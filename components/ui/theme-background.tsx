"use client"

import { useTheme } from "@/components/theme-provider"
import { useEffect, useState } from "react"

interface ThemeBackgroundProps {
  children: React.ReactNode
}

// Theme-specific background configurations
const themeBackgrounds = {
  night: {
    gradient: "from-gray-900 via-slate-900 to-black",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80",
    overlay: "bg-gray-900/60"
  },
  white: {
    gradient: "from-gray-50 via-white to-gray-100",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80",
    overlay: "bg-white/70"
  },
  nature: {
    gradient: "from-green-100 via-emerald-50 to-teal-100",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80",
    overlay: "bg-green-50/60"
  },
  sunset: {
    gradient: "from-orange-100 via-amber-50 to-yellow-100",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80",
    overlay: "bg-orange-50/60"
  },
  nirvana: {
    gradient: "from-purple-100 via-violet-50 to-indigo-100",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80",
    overlay: "bg-purple-50/60"
  },
  ocean: {
    gradient: "from-cyan-100 via-blue-50 to-teal-100",
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80",
    overlay: "bg-cyan-50/60"
  }
}

export function ThemeBackground({ children }: ThemeBackgroundProps) {
  const { theme } = useTheme()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Safely get theme with fallback
  const getThemeConfig = (themeName: string) => {
    // Auto theme should not have its own background, it uses the selected theme's background
    return themeBackgrounds[themeName as keyof typeof themeBackgrounds] || themeBackgrounds.white
  }

  const currentTheme = getThemeConfig(theme)

  useEffect(() => {
    // Reset states when theme changes
    setImageLoaded(false)
    setImageError(false)

    // Preload the background image if it exists
    if (currentTheme && currentTheme.image) {
      const img = new Image()
      img.onload = () => setImageLoaded(true)
      img.onerror = () => setImageError(true)
      img.src = currentTheme.image
    } else {
      setImageError(true)
    }
  }, [currentTheme?.image])

  // Fallback if no theme is available
  if (!currentTheme) {
    return (
      <div className="relative min-h-screen bg-white">
        <div className="relative z-0">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Layer */}
      <div className="fixed inset-0 -z-10">
        {/* Gradient Fallback */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient || 'from-gray-50 to-white'}`} />

        {/* Background Image */}
        {!imageError && currentTheme.image && (
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${currentTheme.image})`,
            }}
          />
        )}

        {/* Overlay */}
        <div className={`absolute inset-0 ${currentTheme.overlay || 'bg-white/70'} backdrop-blur-[1px]`} />
      </div>

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>
    </div>
  )
}
