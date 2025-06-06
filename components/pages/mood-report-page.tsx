"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Calendar, BarChart3, Heart, Brain } from "lucide-react"

export function MoodReportPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  // Example mood data
  const moodData = {
    week: [
      { day: "Mon", moods: {
        happiness: 7, sadness: 3, anger: 2, anxiety: 4, 
        stress: 5, peace: 6, energy: 6, excitement: 5,
        loneliness: 3, humor: 7
      }},
      { day: "Tue", moods: {
        happiness: 8, sadness: 2, anger: 1, anxiety: 3,
        stress: 4, peace: 7, energy: 7, excitement: 6,
        loneliness: 2, humor: 8
      }},
      { day: "Wed", moods: {
        happiness: 6, sadness: 4, anger: 3, anxiety: 5,
        stress: 6, peace: 5, energy: 5, excitement: 4,
        loneliness: 4, humor: 6
      }},
      { day: "Thu", moods: {
        happiness: 9, sadness: 1, anger: 1, anxiety: 2,
        stress: 3, peace: 8, energy: 8, excitement: 7,
        loneliness: 1, humor: 9
      }},
      { day: "Fri", moods: {
        happiness: 8, sadness: 2, anger: 2, anxiety: 3,
        stress: 4, peace: 7, energy: 7, excitement: 6,
        loneliness: 2, humor: 8
      }},
      { day: "Sat", moods: {
        happiness: 9, sadness: 1, anger: 1, anxiety: 2,
        stress: 3, peace: 9, energy: 9, excitement: 8,
        loneliness: 1, humor: 9
      }},
      { day: "Sun", moods: {
        happiness: 7, sadness: 3, anger: 2, anxiety: 4,
        stress: 5, peace: 6, energy: 6, excitement: 5,
        loneliness: 3, humor: 7
      }},
    ],
    month: [
      { day: "Week 1", moods: {
        happiness: 7.5, sadness: 2.5, anger: 2, anxiety: 3.5,
        stress: 4.5, peace: 6.5, energy: 6.8, excitement: 5.5,
        loneliness: 2.5, humor: 7.5
      }},
      { day: "Week 2", moods: {
        happiness: 8.2, sadness: 2, anger: 1.5, anxiety: 3,
        stress: 4, peace: 7.5, energy: 7.5, excitement: 6.5,
        loneliness: 2, humor: 8
      }},
      { day: "Week 3", moods: {
        happiness: 6.8, sadness: 3.5, anger: 2.5, anxiety: 4.5,
        stress: 5.5, peace: 5.5, energy: 6.2, excitement: 4.5,
        loneliness: 3.5, humor: 6.5
      }},
      { day: "Week 4", moods: {
        happiness: 8.8, sadness: 1.5, anger: 1, anxiety: 2,
        stress: 3, peace: 8.5, energy: 8.1, excitement: 7.5,
        loneliness: 1.5, humor: 8.5
      }},
    ],
  }

  const currentData = moodData[selectedPeriod as keyof typeof moodData]
  
  // Tüm mood'ların ortalamasını hesapla
  const calculateAverageMoods = () => {
    const totals = {
      happiness: 0, sadness: 0, anger: 0, anxiety: 0,
      stress: 0, peace: 0, energy: 0, excitement: 0,
      loneliness: 0, humor: 0
    }
    
    currentData.forEach(item => {
      Object.keys(totals).forEach(mood => {
        totals[mood as keyof typeof totals] += item.moods[mood as keyof typeof item.moods]
      })
    })
    
    Object.keys(totals).forEach(mood => {
      totals[mood as keyof typeof totals] /= currentData.length
    })
    
    return totals
  }

  const averageMoods = calculateAverageMoods()

  const insights = [
    {
      title: "Highest Mood",
      value: "Happiness & Peace",
      description: "Highest during this period",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Need Attention",
      value: "Stress & Anxiety",
      description: "Rising in this period",
      icon: TrendingDown,
      color: "text-orange-600",
    },
    {
      title: "General Status",
      value: (averageMoods.happiness + averageMoods.peace) / 2 > 7 ? "Positive" : "Neutral",
      description: "Period evaluation",
      icon: Heart,
      color: "text-purple-600",
    },
    {
      title: "Energy Level",
      value: averageMoods.energy.toFixed(1) + "/10",
      description: "Average energy status",
      icon: Brain,
      color: "text-blue-600",
    },
  ]

  const recommendations = [
    "Try meditation to reduce your stress level",
    "Practice breathing exercises in anxious situations",
    "Regular exercise helps maintain high energy levels",
    "Social activities can help reduce feelings of loneliness",
  ]

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
            onClick={() => setSelectedPeriod("week")}
            variant={selectedPeriod === "week" ? "default" : "outline"}
            className={`${selectedPeriod === "week" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-primary-foreground" : "text-foreground border-border hover:bg-muted"}`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Last Week
          </Button>
          <Button
            onClick={() => setSelectedPeriod("month")}
            variant={selectedPeriod === "month" ? "default" : "outline"}
            className={`${selectedPeriod === "month" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-primary-foreground" : "text-foreground border-border hover:bg-muted"}`}
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
            <div className="h-[32rem] flex items-end justify-between space-x-2 bg-muted/30 rounded-lg p-4">
              {currentData.map((item, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="flex flex-col items-center space-y-1">
                    <div
                      className="w-6 bg-gradient-to-t from-green-400 to-green-600 rounded-t"
                      style={{ height: `${(item.moods.happiness / 10) * 60}px` }}
                      title="Happiness"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t"
                      style={{ height: `${(item.moods.sadness / 10) * 60}px` }}
                      title="Sadness"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-red-400 to-red-600 rounded-t"
                      style={{ height: `${(item.moods.anger / 10) * 60}px` }}
                      title="Anger"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t"
                      style={{ height: `${(item.moods.anxiety / 10) * 60}px` }}
                      title="Anxiety"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-orange-400 to-orange-600 rounded-t"
                      style={{ height: `${(item.moods.stress / 10) * 60}px` }}
                      title="Stress"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-purple-400 to-purple-600 rounded-t"
                      style={{ height: `${(item.moods.peace / 10) * 60}px` }}
                      title="Peace"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-cyan-400 to-cyan-600 rounded-t"
                      style={{ height: `${(item.moods.energy / 10) * 60}px` }}
                      title="Energy"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-pink-400 to-pink-600 rounded-t"
                      style={{ height: `${(item.moods.excitement / 10) * 60}px` }}
                      title="Excitement"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-gray-400 to-gray-600 rounded-t"
                      style={{ height: `${(item.moods.loneliness / 10) * 60}px` }}
                      title="Loneliness"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-indigo-400 to-indigo-600 rounded-t"
                      style={{ height: `${(item.moods.humor / 10) * 60}px` }}
                      title="Humor"
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{item.day}</span>
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
          {insights.map((insight, index) => {
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
                Throughout this {selectedPeriod === "week" ? "week" : "month"}, your emotional state has generally been{" "}
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
