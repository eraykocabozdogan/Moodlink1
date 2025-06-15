"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "auto" | "night" | "nature" | "sunset" | "white" | "nirvana" | "ocean"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  getAutoTheme: () => Theme
}

const initialState: ThemeProviderState = {
  theme: "white",
  setTheme: () => null,
  getAutoTheme: () => "white",
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Mood-based theme selection algorithm with balanced distribution
function selectThemeBasedOnMood(): Theme {
  try {
    // Get mood data from localStorage (from mood report)
    const moodDataStr = localStorage.getItem('recent-mood-data')
    if (!moodDataStr) return "white" // Default fallback

    const moodData = JSON.parse(moodDataStr)

    // Calculate average mood scores
    const avgMoods = {
      happiness: 0, sadness: 0, anger: 0, anxiety: 0,
      stress: 0, peace: 0, energy: 0, excitement: 0,
      loneliness: 0, humor: 0
    }

    if (moodData.length > 0) {
      moodData.forEach((item: any) => {
        Object.keys(avgMoods).forEach(mood => {
          if (item.moods && typeof item.moods[mood] === 'number') {
            avgMoods[mood as keyof typeof avgMoods] += item.moods[mood]
          }
        })
      })

      Object.keys(avgMoods).forEach(mood => {
        avgMoods[mood as keyof typeof avgMoods] /= moodData.length
      })
    }

    // Available themes (excluding auto)
    const availableThemes: Theme[] = ["night", "nature", "sunset", "white", "nirvana", "ocean"]

    // Calculate theme scores based on mood data
    const themeScores: Record<string, number> = {
      night: (avgMoods.sadness * 0.3) + (avgMoods.loneliness * 0.3) + (avgMoods.peace * 0.2) + (10 - avgMoods.energy) * 0.2,
      nature: (avgMoods.happiness * 0.25) + (avgMoods.peace * 0.35) + (10 - avgMoods.stress) * 0.25 + (avgMoods.humor * 0.15),
      sunset: (avgMoods.happiness * 0.3) + (avgMoods.energy * 0.3) + (avgMoods.excitement * 0.25) + (avgMoods.humor * 0.15),
      white: (10 - avgMoods.anger) * 0.3 + (10 - avgMoods.anxiety) * 0.3 + (avgMoods.peace * 0.2) + (5) * 0.2, // Base score for neutrality
      nirvana: (avgMoods.peace * 0.4) + (10 - avgMoods.stress) * 0.3 + (10 - avgMoods.anxiety) * 0.2 + (avgMoods.happiness * 0.1),
      ocean: (avgMoods.energy * 0.3) + (avgMoods.excitement * 0.25) + (avgMoods.happiness * 0.25) + (10 - avgMoods.sadness) * 0.2
    }

    // Add randomness to ensure all themes have a chance (15% random factor)
    Object.keys(themeScores).forEach(theme => {
      const randomFactor = (Math.random() - 0.5) * 3 // -1.5 to +1.5
      themeScores[theme] += randomFactor
    })

    // Find theme with highest score
    let selectedTheme: Theme = "white"
    let highestScore = -1

    availableThemes.forEach(theme => {
      if (themeScores[theme] > highestScore) {
        highestScore = themeScores[theme]
        selectedTheme = theme
      }
    })

    // Store the selected theme for display
    localStorage.setItem('auto-selected-theme', selectedTheme)

    return selectedTheme

  } catch (error) {
    console.error('Error selecting auto theme:', error)
    return "white"
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "white",
  storageKey = "moodlink-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [actualTheme, setActualTheme] = useState<Theme>(defaultTheme)

  // Get auto theme based on mood data
  const getAutoTheme = (): Theme => {
    return selectThemeBasedOnMood()
  }

  useEffect(() => {
    const root = window.document.documentElement
    // Remove all theme classes
    root.classList.remove(
      "theme-auto", "theme-night", "theme-nature", "theme-sunset",
      "theme-white", "theme-nirvana", "theme-ocean"
    )

    // Determine actual theme to apply
    const themeToApply = theme === "auto" ? getAutoTheme() : theme
    setActualTheme(themeToApply)
    root.classList.add(`theme-${themeToApply}`)
  }, [theme])

  const value = {
    theme: theme, // Return the selected theme (not actualTheme)
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
    getAutoTheme,
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme
    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [storageKey])

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
