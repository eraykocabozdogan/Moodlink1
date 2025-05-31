"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Calendar, BarChart3, Heart, Brain } from "lucide-react"

export function MoodReportPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  // Örnek mood verileri
  const moodData = {
    week: [
      { day: "Pzt", mood: 7, energy: 6 },
      { day: "Sal", mood: 8, energy: 7 },
      { day: "Çar", mood: 6, energy: 5 },
      { day: "Per", mood: 9, energy: 8 },
      { day: "Cum", mood: 8, energy: 7 },
      { day: "Cmt", mood: 9, energy: 9 },
      { day: "Paz", mood: 7, energy: 6 },
    ],
    month: [
      { day: "1. Hafta", mood: 7.5, energy: 6.8 },
      { day: "2. Hafta", mood: 8.2, energy: 7.5 },
      { day: "3. Hafta", mood: 6.8, energy: 6.2 },
      { day: "4. Hafta", mood: 8.8, energy: 8.1 },
    ],
  }

  const currentData = moodData[selectedPeriod as keyof typeof moodData]
  const avgMood = currentData.reduce((sum, item) => sum + item.mood, 0) / currentData.length
  const avgEnergy = currentData.reduce((sum, item) => sum + item.energy, 0) / currentData.length

  const insights = [
    {
      title: "En İyi Gün",
      value: "Cumartesi",
      description: "Mood seviyeniz en yüksek",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Dikkat Gereken Gün",
      value: "Çarşamba",
      description: "Mood seviyeniz düşük",
      icon: TrendingDown,
      color: "text-orange-600",
    },
    {
      title: "Ortalama Mood",
      value: avgMood.toFixed(1) + "/10",
      description: "Bu dönem ortalamanız",
      icon: Heart,
      color: "text-purple-600",
    },
    {
      title: "Enerji Seviyesi",
      value: avgEnergy.toFixed(1) + "/10",
      description: "Ortalama enerji durumunuz",
      icon: Brain,
      color: "text-blue-600",
    },
  ]

  const recommendations = [
    "Çarşamba günleri için özel aktiviteler planlayın",
    "Hafta sonu rutininizi korumaya devam edin",
    "Düzenli uyku saatleri mood'unuzu olumlu etkiliyor",
    "Sosyal aktiviteler enerji seviyenizi artırıyor",
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-800">Ruh Hali Raporu</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Period Selection */}
        <div className="flex space-x-2">
          <Button
            onClick={() => setSelectedPeriod("week")}
            variant={selectedPeriod === "week" ? "default" : "outline"}
            className={selectedPeriod === "week" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : ""}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Son Hafta
          </Button>
          <Button
            onClick={() => setSelectedPeriod("month")}
            variant={selectedPeriod === "month" ? "default" : "outline"}
            className={selectedPeriod === "month" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : ""}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Son Ay
          </Button>
        </div>

        {/* Mood Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Mood Grafiği</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2 bg-gray-50 rounded-lg p-4">
              {currentData.map((item, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="flex flex-col items-center space-y-1">
                    {/* Energy Bar */}
                    <div
                      className="w-6 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t"
                      style={{ height: `${(item.energy / 10) * 120}px` }}
                    ></div>
                    {/* Mood Bar */}
                    <div
                      className="w-6 bg-gradient-to-t from-purple-400 to-pink-500 rounded-t"
                      style={{ height: `${(item.mood / 10) * 120}px` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded"></div>
                <span className="text-sm text-gray-600">Mood</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
                <span className="text-sm text-gray-600">Enerji</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-8 h-8 ${insight.color}`} />
                    <div>
                      <p className="font-bold text-lg">{insight.value}</p>
                      <p className="text-sm font-medium text-gray-800">{insight.title}</p>
                      <p className="text-xs text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detailed Report */}
        <Card>
          <CardHeader>
            <CardTitle>Detaylı Analiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Mood Trendleri</h4>
              <p className="text-gray-600 text-sm">
                Bu {selectedPeriod === "week" ? "hafta" : "ay"} boyunca mood seviyeniz genel olarak{" "}
                {avgMood >= 7 ? "yüksek" : avgMood >= 5 ? "orta" : "düşük"} seviyede kalmış. En yüksek mood seviyeniz
                hafta sonu günlerinde gözlemlenmiş.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Enerji Analizi</h4>
              <p className="text-gray-600 text-sm">
                Enerji seviyeniz mood seviyenizle paralel bir seyir izlemiş. Özellikle sosyal aktivitelerin yoğun olduğu
                günlerde enerji seviyenizde artış gözlemlenmiş.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Öneriler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Badge variant="outline" className="mt-0.5">
                    {index + 1}
                  </Badge>
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
