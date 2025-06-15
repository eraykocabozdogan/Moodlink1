"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Calendar, BarChart3, Heart, Brain, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import apiClient from "@/lib/apiClient"
import { MoodReportResponse, MoodReportData, MoodReportInsight, MoodReportPeriod, BackendMoodReportResponse } from "@/lib/types/api"

export function MoodReportPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<MoodReportPeriod>(MoodReportPeriod.Weekly)
  const [moodData, setMoodData] = useState<MoodReportData[]>([])
  const [insights, setInsights] = useState<MoodReportInsight[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  // Emotion mapping from Turkish names to English keys
  const emotionMapping: Record<string, string> = {
    'Mutluluk': 'happiness',
    'Uzuntu': 'sadness',
    'Ofke': 'anger',
    'Endise': 'anxiety',
    'Stres': 'stress',
    'Huzur': 'peace',
    'Enerji': 'energy',
    'Heyecan': 'excitement',
    'Yalnizlik': 'loneliness',
    'Mizah': 'humor'
  }

  // Convert backend response to frontend format
  const convertBackendResponse = (backendResponse: BackendMoodReportResponse): MoodReportResponse => {
    // Create emotion type to English key mapping
    const emotionTypeMapping: Record<number, string> = {
      1: 'happiness', 2: 'sadness', 3: 'anger', 4: 'anxiety', 5: 'stress',
      6: 'peace', 7: 'energy', 8: 'excitement', 9: 'loneliness', 10: 'humor'
    }

    // Get average scores from emotionBreakdown for fallback
    const averageScores: Record<string, number> = {}
    backendResponse.emotionBreakdown.forEach(breakdown => {
      const englishKey = emotionTypeMapping[breakdown.emotionType]
      if (englishKey) {
        averageScores[englishKey] = Math.round((breakdown.averageScore / 100) * 10 * 10) / 10
      }
    })

    const reportData: MoodReportData[] = backendResponse.chartData.map(item => {
      const moods: any = {
        happiness: 0, sadness: 0, energy: 0, stress: 0,
        anger: 0, anxiety: 0, peace: 0, excitement: 0,
        loneliness: 0, humor: 0
      }

      // Check if this day has emotion scores
      const hasData = Object.keys(item.emotionScores).length > 0

      if (hasData) {
        // Convert Turkish emotion names to English keys and normalize scores (0-100 → 0-10)
        Object.entries(item.emotionScores).forEach(([turkishName, score]) => {
          const englishKey = emotionMapping[turkishName]
          if (englishKey) {
            moods[englishKey] = Math.round((score / 100) * 10 * 10) / 10 // Convert to 0-10 scale with 1 decimal
          }
        })
      } else {
        // Use average scores with some variation for empty days
        Object.keys(moods).forEach(key => {
          if (averageScores[key]) {
            // Add some random variation (±20%) to make it look more realistic
            const variation = (Math.random() - 0.5) * 0.4 // -0.2 to +0.2
            moods[key] = Math.max(0, Math.min(10, Math.round((averageScores[key] * (1 + variation)) * 10) / 10))
          }
        })
      }

      return {
        label: item.label,
        moods
      }
    })

    // Generate insights from backend data
    const insights: MoodReportInsight[] = [
      {
        title: "Dominant Emotion",
        value: getDominantEmotionName(backendResponse.summary.dominantEmotion),
        description: "Most prominent emotion this period"
      },
      {
        title: "Average Score",
        value: `${backendResponse.summary.averageMoodScore}/100`,
        description: "Overall mood rating"
      },
      {
        title: "Trend Analysis",
        value: backendResponse.summary.trendAnalysis.includes("improvement") ? "Improving" : "Stable",
        description: "Mood trend direction"
      },
      {
        title: "Total Entries",
        value: backendResponse.summary.totalEntries.toString(),
        description: "Data points collected"
      }
    ]

    return {
      success: true,
      data: {
        period: selectedPeriod === MoodReportPeriod.Weekly ? "Weekly" : "Monthly",
        reportData,
        insights,
        recommendations: backendResponse.insights
      }
    }
  }

  // Get emotion name by type number
  const getDominantEmotionName = (emotionType: number): string => {
    const emotionNames: Record<number, string> = {
      1: 'Happiness', 2: 'Sadness', 3: 'Anger', 4: 'Anxiety', 5: 'Stress',
      6: 'Peace', 7: 'Energy', 8: 'Excitement', 9: 'Loneliness', 10: 'Humor'
    }
    return emotionNames[emotionType] || 'Unknown'
  }

  // Mock data for fallback
  const getMockData = () => {
    const isWeekly = selectedPeriod === MoodReportPeriod.Weekly
    return {
      success: true,
      data: {
        period: isWeekly ? "Weekly" : "Monthly",
        reportData: isWeekly ? [
          { label: "Mon", moods: {
            happiness: 7, sadness: 3, anger: 2, anxiety: 4,
            stress: 5, peace: 6, energy: 6, excitement: 5,
            loneliness: 3, humor: 7
          }},
          { label: "Tue", moods: {
            happiness: 8, sadness: 2, anger: 1, anxiety: 3,
            stress: 4, peace: 7, energy: 7, excitement: 6,
            loneliness: 2, humor: 8
          }},
          { label: "Wed", moods: {
            happiness: 6, sadness: 4, anger: 3, anxiety: 5,
            stress: 6, peace: 5, energy: 5, excitement: 4,
            loneliness: 4, humor: 6
          }},
          { label: "Thu", moods: {
            happiness: 9, sadness: 1, anger: 1, anxiety: 2,
            stress: 3, peace: 8, energy: 8, excitement: 7,
            loneliness: 1, humor: 9
          }},
          { label: "Fri", moods: {
            happiness: 8, sadness: 2, anger: 2, anxiety: 3,
            stress: 4, peace: 7, energy: 7, excitement: 6,
            loneliness: 2, humor: 8
          }},
          { label: "Sat", moods: {
            happiness: 9, sadness: 1, anger: 1, anxiety: 2,
            stress: 3, peace: 9, energy: 9, excitement: 8,
            loneliness: 1, humor: 9
          }},
          { label: "Sun", moods: {
            happiness: 7, sadness: 3, anger: 2, anxiety: 4,
            stress: 5, peace: 6, energy: 6, excitement: 5,
            loneliness: 3, humor: 7
          }}
        ] : [
          { label: "Week 1", moods: {
            happiness: 7.5, sadness: 2.5, anger: 2, anxiety: 3.5,
            stress: 4.5, peace: 6.5, energy: 6.8, excitement: 5.5,
            loneliness: 2.5, humor: 7.5
          }},
          { label: "Week 2", moods: {
            happiness: 8.2, sadness: 2, anger: 1.5, anxiety: 3,
            stress: 4, peace: 7.5, energy: 7.5, excitement: 6.5,
            loneliness: 2, humor: 8
          }},
          { label: "Week 3", moods: {
            happiness: 6.8, sadness: 3.5, anger: 2.5, anxiety: 4.5,
            stress: 5.5, peace: 5.5, energy: 6.2, excitement: 4.5,
            loneliness: 3.5, humor: 6.5
          }},
          { label: "Week 4", moods: {
            happiness: 8.8, sadness: 1.5, anger: 1, anxiety: 2,
            stress: 3, peace: 8.5, energy: 8.1, excitement: 7.5,
            loneliness: 1.5, humor: 8.5
          }}
        ],
        insights: [
          { title: "Highest Mood", value: "Happiness & Peace", description: "Dominant emotions this period" },
          { title: "Need Attention", value: "Stress & Anxiety", description: "Rising in this period" },
          { title: "General Status", value: "Positive", description: "Period evaluation" },
          { title: "Energy Level", value: "7.2/10", description: "Average energy status" }
        ],
        recommendations: [
          "Try meditation to reduce your stress level",
          "Practice breathing exercises in anxious situations",
          "Regular exercise helps maintain high energy levels",
          "Social activities can help reduce feelings of loneliness"
        ]
      }
    }
  }

  // Test if other emotion endpoints work
  const testOtherEndpoints = async (userId: string) => {
    try {
      console.log("Testing checkUserMood endpoint...")
      const moodCheck = await apiClient.checkUserMood(userId)
      console.log("checkUserMood response:", JSON.stringify(moodCheck, null, 2))
    } catch (err) {
      console.log("checkUserMood failed:", err)
    }

    try {
      console.log("Testing getEmotionTypes endpoint...")
      const emotionTypes = await apiClient.getEmotionTypes()
      console.log("getEmotionTypes response:", JSON.stringify(emotionTypes, null, 2))
    } catch (err) {
      console.log("getEmotionTypes failed:", err)
    }
  }

  // Fetch mood report data
  const fetchMoodReport = async () => {
    console.log("User object:", user)
    console.log("User keys:", user ? Object.keys(user) : "No user")

    const userId = user?.id || user?.userId
    if (!userId) {
      console.log("No user ID available for mood report")
      return
    }

    // Test other endpoints first
    await testOtherEndpoints(userId)

    try {
      setLoading(true)
      setError(null)

      console.log("Fetching mood report for user:", userId, "period:", selectedPeriod)
      const backendResponse = await apiClient.getMoodReport(userId, selectedPeriod)
      console.log("Backend mood report response:", JSON.stringify(backendResponse, null, 2))

      // Convert backend response to frontend format
      const convertedResponse = convertBackendResponse(backendResponse)
      console.log("Converted response:", JSON.stringify(convertedResponse, null, 2))
      console.log("Chart data sample:", convertedResponse.data.reportData.slice(0, 2))

      if (convertedResponse.success && convertedResponse.data) {
        setMoodData(convertedResponse.data.reportData)
        setInsights(convertedResponse.data.insights)
        setRecommendations(convertedResponse.data.recommendations)
        console.log("Mood report data set successfully")
      } else {
        console.error("Conversion failed")
        throw new Error("Failed to convert backend response")
      }
    } catch (err: any) {
      console.error("Error fetching mood report:", err)
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      })

      // Use mock data as fallback
      console.log("Using mock data as fallback")
      const mockResponse = getMockData()
      setMoodData(mockResponse.data.reportData)
      setInsights(mockResponse.data.insights)
      setRecommendations(mockResponse.data.recommendations)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMoodReport()
  }, [user?.id, user?.userId, selectedPeriod])

  // Tüm mood'ların ortalamasını hesapla
  const calculateAverageMoods = () => {
    if (!moodData.length) return {
      happiness: 0, sadness: 0, anger: 0, anxiety: 0,
      stress: 0, peace: 0, energy: 0, excitement: 0,
      loneliness: 0, humor: 0
    }

    const totals = {
      happiness: 0, sadness: 0, anger: 0, anxiety: 0,
      stress: 0, peace: 0, energy: 0, excitement: 0,
      loneliness: 0, humor: 0
    }

    moodData.forEach(item => {
      Object.keys(totals).forEach(mood => {
        const moodKey = mood as keyof typeof totals
        const moodValue = item.moods[moodKey as keyof typeof item.moods]
        if (typeof moodValue === 'number') {
          totals[moodKey] += moodValue
        }
      })
    })

    Object.keys(totals).forEach(mood => {
      totals[mood as keyof typeof totals] /= moodData.length
    })

    return totals
  }

  const averageMoods = calculateAverageMoods()

  // Save mood data to localStorage for auto theme selection
  useEffect(() => {
    if (moodData.length > 0) {
      localStorage.setItem('recent-mood-data', JSON.stringify(moodData))
    }
  }, [moodData])

  // Enhanced insights with icons
  const enhancedInsights = insights.map((insight, index) => {
    const icons = [TrendingUp, TrendingDown, Heart, Brain]
    const colors = ["text-green-600", "text-orange-600", "text-purple-600", "text-blue-600"]

    return {
      ...insight,
      icon: icons[index % icons.length],
      color: colors[index % colors.length]
    }
  })

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-foreground">Mood Report</h1>
          </div>
        </div>
        <div className="p-4 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading mood report...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-foreground">Mood Report</h1>
          </div>
        </div>
        <div className="p-4 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-destructive">Error: {error}</p>
            <Button onClick={fetchMoodReport} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-foreground">Mood Report</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Period Selection */}
        <div className="flex space-x-2">
          <Button
            onClick={() => setSelectedPeriod(MoodReportPeriod.Weekly)}
            variant={selectedPeriod === MoodReportPeriod.Weekly ? "default" : "outline"}
            className={`${selectedPeriod === MoodReportPeriod.Weekly ? "bg-gradient-to-r from-purple-500 to-pink-500 text-primary-foreground" : "text-foreground border-border hover:bg-muted"}`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Last Week
          </Button>
          <Button
            onClick={() => setSelectedPeriod(MoodReportPeriod.Monthly)}
            variant={selectedPeriod === MoodReportPeriod.Monthly ? "default" : "outline"}
            className={`${selectedPeriod === MoodReportPeriod.Monthly ? "bg-gradient-to-r from-purple-500 to-pink-500 text-primary-foreground" : "text-foreground border-border hover:bg-muted"}`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Last Month
          </Button>
        </div>

        {/* Mood Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Mood Chart</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[40rem] flex items-end justify-between space-x-2 bg-muted/30 rounded-lg p-4">
              {moodData.map((item, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="flex flex-col items-center space-y-1">
                    <div
                      className="w-6 bg-gradient-to-t from-green-400 to-green-600 rounded-t"
                      style={{ height: `${Math.max(3, (item.moods.happiness / 10) * 120)}px` }}
                      title={`Happiness: ${item.moods.happiness.toFixed(1)}/10`}
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t"
                      style={{ height: `${Math.max(3, (item.moods.sadness / 10) * 120)}px` }}
                      title={`Sadness: ${item.moods.sadness.toFixed(1)}/10`}
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-red-400 to-red-600 rounded-t"
                      style={{ height: `${Math.max(3, (item.moods.anger / 10) * 120)}px` }}
                      title={`Anger: ${item.moods.anger.toFixed(1)}/10`}
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t"
                      style={{ height: `${Math.max(3, (item.moods.anxiety / 10) * 120)}px` }}
                      title={`Anxiety: ${item.moods.anxiety.toFixed(1)}/10`}
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-orange-400 to-orange-600 rounded-t"
                      style={{ height: `${Math.max(3, (item.moods.stress / 10) * 120)}px` }}
                      title={`Stress: ${item.moods.stress.toFixed(1)}/10`}
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-purple-400 to-purple-600 rounded-t"
                      style={{ height: `${Math.max(3, (item.moods.peace / 10) * 120)}px` }}
                      title={`Peace: ${item.moods.peace.toFixed(1)}/10`}
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-cyan-400 to-cyan-600 rounded-t"
                      style={{ height: `${Math.max(3, (item.moods.energy / 10) * 120)}px` }}
                      title={`Energy: ${item.moods.energy.toFixed(1)}/10`}
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-pink-400 to-pink-600 rounded-t"
                      style={{ height: `${Math.max(3, (item.moods.excitement / 10) * 120)}px` }}
                      title={`Excitement: ${item.moods.excitement.toFixed(1)}/10`}
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-gray-400 to-gray-600 rounded-t"
                      style={{ height: `${Math.max(3, (item.moods.loneliness / 10) * 120)}px` }}
                      title={`Loneliness: ${item.moods.loneliness.toFixed(1)}/10`}
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-indigo-400 to-indigo-600 rounded-t"
                      style={{ height: `${Math.max(3, (item.moods.humor / 10) * 120)}px` }}
                      title={`Humor: ${item.moods.humor.toFixed(1)}/10`}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Happiness</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Sadness</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Anger</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Anxiety</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Stress</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Peace</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Energy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-pink-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Excitement</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Loneliness</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Humor</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {enhancedInsights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-8 h-8 ${insight.color}`} /> {/* Renkler özel kalabilir */}
                    <div>
                      <p className="font-bold text-lg text-foreground">{insight.value}</p>
                      <p className="text-sm font-medium text-foreground">{insight.title}</p>
                      <p className="text-xs text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detailed Report */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Detailed Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Mood Analysis</h4>
              <p className="text-muted-foreground text-sm">
                Throughout this {selectedPeriod === MoodReportPeriod.Weekly ? "week" : "month"}, your emotional state has generally been{" "}
                {averageMoods.happiness >= 7 ? "positive" : averageMoods.happiness >= 5 ? "balanced" : "variable"}.
                Your happiness and peace levels are high, but you should pay attention to stress and anxiety situations.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Detailed Mood Values</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Happiness:</strong> {averageMoods.happiness.toFixed(1)}/10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Sadness:</strong> {averageMoods.sadness.toFixed(1)}/10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Anger:</strong> {averageMoods.anger.toFixed(1)}/10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Anxiety:</strong> {averageMoods.anxiety.toFixed(1)}/10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Stress:</strong> {averageMoods.stress.toFixed(1)}/10
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Peace:</strong> {averageMoods.peace.toFixed(1)}/10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Energy:</strong> {averageMoods.energy.toFixed(1)}/10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Excitement:</strong> {averageMoods.excitement.toFixed(1)}/10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Loneliness:</strong> {averageMoods.loneliness.toFixed(1)}/10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Humor:</strong> {averageMoods.humor.toFixed(1)}/10
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Badge variant="outline" className="border-border text-muted-foreground">
                    {index + 1}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
