"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Calendar, BarChart3, Heart, Brain } from "lucide-react"
import { useLanguage } from "../language-provider"

export function MoodReportPage() {
  const { t } = useLanguage()
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
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-foreground">{t("title.moodReport")}</h1>
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
            {t("activities.upcoming")}
          </Button>
          <Button
            onClick={() => setSelectedPeriod("month")}
            variant={selectedPeriod === "month" ? "default" : "outline"}
            className={`${selectedPeriod === "month" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-primary-foreground" : "text-foreground border-border hover:bg-muted"}`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {t("activities.all")}
          </Button>
        </div>

        {/* Mood Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>{t("profile.mood")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2 bg-muted/30 rounded-lg p-4">
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
                  <span className="text-xs font-medium text-muted-foreground">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded"></div>
                <span className="text-sm text-muted-foreground">{t("profile.mood")}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
                <span className="text-sm text-muted-foreground">{t("profile.mood")}</span>
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
                    <Icon className={`w-8 h-8 ${insight.color}`} />
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
            <CardTitle className="text-foreground">{t("profile.mood")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">{t("profile.mood")}</h4>
              <p className="text-muted-foreground text-sm">
                Bu {selectedPeriod === "week" ? "hafta" : "ay"} boyunca mood seviyeniz genel olarak{" "}
                {avgMood >= 7 ? "yüksek" : avgMood >= 5 ? "orta" : "düşük"} seviyede kalmış. En yüksek mood seviyeniz
                hafta sonu günlerinde gözlemlenmiş.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">{t("profile.mood")}</h4>
              <p className="text-muted-foreground text-sm">
                Enerji seviyeniz mood seviyenizle paralel bir seyir izlemiş. Özellikle sosyal aktivitelerin yoğun olduğu
                günlerde enerji seviyenizde artış gözlemlenmiş.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{t("profile.mood")}</CardTitle>
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
