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
  actualTheme: Theme
  refreshAutoTheme: () => void
}

const initialState: ThemeProviderState = {
  theme: "white",
  setTheme: () => null,
  getAutoTheme: () => "white",
  actualTheme: "white",
  refreshAutoTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Mood-based theme selection algorithm with balanced distribution
function selectThemeBasedOnMood(): Theme {
  try {
    // Check if we already have a stable auto-selected theme
    const existingAutoTheme = localStorage.getItem('auto-selected-theme')
    const existingCompatibility = localStorage.getItem('auto-theme-compatibility')

    // If we have both theme and compatibility, use the existing selection
    if (existingAutoTheme && existingCompatibility) {
      return existingAutoTheme as Theme
    }

    // Get mood data from localStorage (from mood report)
    const moodDataStr = localStorage.getItem('recent-mood-data')

    // Available themes (excluding auto)
    const availableThemes: Theme[] = ["night", "nature", "sunset", "white", "nirvana", "ocean"]

    if (!moodDataStr) {
      // If no mood data, select randomly with equal probability
      const randomIndex = Math.floor(Math.random() * availableThemes.length)
      const selectedTheme = availableThemes[randomIndex]
      localStorage.setItem('auto-selected-theme', selectedTheme)
      localStorage.setItem('auto-theme-compatibility', (60 + Math.floor(Math.random() * 25)).toString()) // 60-85% when no mood data
      return selectedTheme
    }

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

    // Calculate theme scores based on mood data with equal base chances
    const baseScore = 5 // Equal base score for all themes
    const themeScores: Record<string, number> = {
      night: baseScore + (avgMoods.sadness * 0.2) + (avgMoods.loneliness * 0.2) + (avgMoods.peace * 0.1),
      nature: baseScore + (avgMoods.happiness * 0.15) + (avgMoods.peace * 0.2) + ((10 - avgMoods.stress) * 0.15),
      sunset: baseScore + (avgMoods.happiness * 0.2) + (avgMoods.energy * 0.2) + (avgMoods.excitement * 0.1),
      white: baseScore + ((10 - avgMoods.anger) * 0.15) + ((10 - avgMoods.anxiety) * 0.15) + (avgMoods.peace * 0.1),
      nirvana: baseScore + (avgMoods.peace * 0.25) + ((10 - avgMoods.stress) * 0.15) + ((10 - avgMoods.anxiety) * 0.1),
      ocean: baseScore + (avgMoods.energy * 0.2) + (avgMoods.excitement * 0.15) + (avgMoods.happiness * 0.15)
    }

    // Store original mood-based scores before adding randomness
    const originalMoodScores = { ...themeScores }

    // Add significant randomness to ensure all themes have equal chances
    Object.keys(themeScores).forEach(theme => {
      const randomFactor = Math.random() * 8 // 0 to 8 for high randomness
      themeScores[theme] += randomFactor
    })

    // Find theme with highest score (after randomness)
    let selectedTheme: Theme = "white"
    let highestScore = -1

    availableThemes.forEach(theme => {
      if (themeScores[theme] > highestScore) {
        highestScore = themeScores[theme]
        selectedTheme = theme
      }
    })

    // Calculate compatibility based on the ACTUALLY SELECTED theme's mood alignment
    const selectedThemeMoodScore = originalMoodScores[selectedTheme]
    const maxPossibleMoodScore = baseScore + (10 * 0.5) // base + max mood contribution
    const minPossibleMoodScore = baseScore // minimum is just the base score

    // Normalize the selected theme's mood score to a percentage (60-95% range)
    const moodContribution = Math.max(0, Math.min(1, (selectedThemeMoodScore - minPossibleMoodScore) / (maxPossibleMoodScore - minPossibleMoodScore)))

    // Add some randomness to the percentage itself for more realistic variation (±5%)
    const basePercentage = 60 + (moodContribution * 35) // 60-95% range
    const randomVariation = (Math.random() - 0.5) * 10 // ±5% variation
    const compatibilityPercentage = Math.round(Math.max(55, Math.min(95, basePercentage + randomVariation)))

    // Store the selected theme and compatibility for display
    localStorage.setItem('auto-selected-theme', selectedTheme)
    localStorage.setItem('auto-theme-compatibility', compatibilityPercentage.toString())

    return selectedTheme

  } catch (error) {
    console.error('Error selecting auto theme:', error)
    // Fallback to random selection
    const availableThemes: Theme[] = ["night", "nature", "sunset", "white", "nirvana", "ocean"]
    const randomIndex = Math.floor(Math.random() * availableThemes.length)
    const selectedTheme = availableThemes[randomIndex]
    localStorage.setItem('auto-selected-theme', selectedTheme)
    localStorage.setItem('auto-theme-compatibility', (55 + Math.floor(Math.random() * 25)).toString()) // 55-80% on error
    return selectedTheme
  }
}

export function ThemeProvider({
  children,
  defaultTheme = "white",
  storageKey = "moodlink-theme",
  ...props
}: ThemeProviderProps) {
  // Initialize with proper theme from the start
  const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return defaultTheme

    const storedTheme = localStorage.getItem(storageKey) as Theme
    if (!storedTheme) return defaultTheme

    // If stored theme is auto, get the actual theme immediately
    if (storedTheme === "auto") {
      return selectThemeBasedOnMood()
    }

    return storedTheme
  }

  const getInitialSelectedTheme = (): Theme => {
    if (typeof window === 'undefined') return defaultTheme
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme
  }

  const [theme, setTheme] = useState<Theme>(getInitialSelectedTheme)
  const [actualTheme, setActualTheme] = useState<Theme>(getInitialTheme)

  // Get auto theme based on mood data
  const getAutoTheme = (): Theme => {
    return selectThemeBasedOnMood()
  }

  // Refresh auto theme selection (clears cache and selects new theme)
  const refreshAutoTheme = (): void => {
    localStorage.removeItem('auto-selected-theme')
    localStorage.removeItem('auto-theme-compatibility')
    if (theme === "auto") {
      const newAutoTheme = selectThemeBasedOnMood()
      setActualTheme(newAutoTheme)
      const root = window.document.documentElement
      root.classList.remove(
        "theme-auto", "theme-night", "theme-nature", "theme-sunset",
        "theme-white", "theme-nirvana", "theme-ocean"
      )
      root.classList.add(`theme-${newAutoTheme}`)
    }
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
    actualTheme,
    refreshAutoTheme,
  }



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
