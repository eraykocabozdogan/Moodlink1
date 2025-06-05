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
      { day: "Pzt", moods: {
        mutluluk: 7, uzuntu: 3, ofke: 2, endise: 4, 
        stres: 5, huzur: 6, enerji: 6, heyecan: 5,
        yalnizlik: 3, mizah: 7
      }},
      { day: "Sal", moods: {
        mutluluk: 8, uzuntu: 2, ofke: 1, endise: 3,
        stres: 4, huzur: 7, enerji: 7, heyecan: 6,
        yalnizlik: 2, mizah: 8
      }},
      { day: "Çar", moods: {
        mutluluk: 6, uzuntu: 4, ofke: 3, endise: 5,
        stres: 6, huzur: 5, enerji: 5, heyecan: 4,
        yalnizlik: 4, mizah: 6
      }},
      { day: "Per", moods: {
        mutluluk: 9, uzuntu: 1, ofke: 1, endise: 2,
        stres: 3, huzur: 8, enerji: 8, heyecan: 7,
        yalnizlik: 1, mizah: 9
      }},
      { day: "Cum", moods: {
        mutluluk: 8, uzuntu: 2, ofke: 2, endise: 3,
        stres: 4, huzur: 7, enerji: 7, heyecan: 6,
        yalnizlik: 2, mizah: 8
      }},
      { day: "Cmt", moods: {
        mutluluk: 9, uzuntu: 1, ofke: 1, endise: 2,
        stres: 3, huzur: 9, enerji: 9, heyecan: 8,
        yalnizlik: 1, mizah: 9
      }},
      { day: "Paz", moods: {
        mutluluk: 7, uzuntu: 3, ofke: 2, endise: 4,
        stres: 5, huzur: 6, enerji: 6, heyecan: 5,
        yalnizlik: 3, mizah: 7
      }},
    ],
    month: [
      { day: "1. Hafta", moods: {
        mutluluk: 7.5, uzuntu: 2.5, ofke: 2, endise: 3.5,
        stres: 4.5, huzur: 6.5, enerji: 6.8, heyecan: 5.5,
        yalnizlik: 2.5, mizah: 7.5
      }},
      { day: "2. Hafta", moods: {
        mutluluk: 8.2, uzuntu: 2, ofke: 1.5, endise: 3,
        stres: 4, huzur: 7.5, enerji: 7.5, heyecan: 6.5,
        yalnizlik: 2, mizah: 8
      }},
      { day: "3. Hafta", moods: {
        mutluluk: 6.8, uzuntu: 3.5, ofke: 2.5, endise: 4.5,
        stres: 5.5, huzur: 5.5, enerji: 6.2, heyecan: 4.5,
        yalnizlik: 3.5, mizah: 6.5
      }},
      { day: "4. Hafta", moods: {
        mutluluk: 8.8, uzuntu: 1.5, ofke: 1, endise: 2,
        stres: 3, huzur: 8.5, enerji: 8.1, heyecan: 7.5,
        yalnizlik: 1.5, mizah: 8.5
      }},
    ],
  }

  const currentData = moodData[selectedPeriod as keyof typeof moodData]
  
  // Tüm mood'ların ortalamasını hesapla
  const calculateAverageMoods = () => {
    const totals = {
      mutluluk: 0, uzuntu: 0, ofke: 0, endise: 0,
      stres: 0, huzur: 0, enerji: 0, heyecan: 0,
      yalnizlik: 0, mizah: 0
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
      title: "En Yüksek Mood",
      value: "Mutluluk & Huzur",
      description: "Bu dönemde en yüksek",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Dikkat Edilmeli",
      value: "Stres & Endişe",
      description: "Bu dönemde yükselişte",
      icon: TrendingDown,
      color: "text-orange-600",
    },
    {
      title: "Genel Durum",
      value: (averageMoods.mutluluk + averageMoods.huzur) / 2 > 7 ? "Pozitif" : "Nötr",
      description: "Dönem değerlendirmesi",
      icon: Heart,
      color: "text-purple-600",
    },
    {
      title: "Enerji Seviyesi",
      value: averageMoods.enerji.toFixed(1) + "/10",
      description: "Ortalama enerji durumu",
      icon: Brain,
      color: "text-blue-600",
    },
  ]

  const recommendations = [
    "Stres seviyenizi düşürmek için meditasyon yapabilirsiniz",
    "Endişe durumlarında nefes egzersizleri deneyin",
    "Enerji seviyenizi yüksek tutmak için düzenli egzersiz yapın",
    "Sosyal aktiviteler yalnızlık hissini azaltmaya yardımcı olabilir",
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-foreground">Ruh Hali Raporu</h1>
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
            Son Hafta
          </Button>
          <Button
            onClick={() => setSelectedPeriod("month")}
            variant={selectedPeriod === "month" ? "default" : "outline"}
            className={`${selectedPeriod === "month" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-primary-foreground" : "text-foreground border-border hover:bg-muted"}`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Son Ay
          </Button>
        </div>

        {/* Mood Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Mood Grafiği</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[32rem] flex items-end justify-between space-x-2 bg-muted/30 rounded-lg p-4">
              {currentData.map((item, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="flex flex-col items-center space-y-1">
                    <div
                      className="w-6 bg-gradient-to-t from-green-400 to-green-600 rounded-t"
                      style={{ height: `${(item.moods.mutluluk / 10) * 60}px` }}
                      title="Mutluluk"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t"
                      style={{ height: `${(item.moods.uzuntu / 10) * 60}px` }}
                      title="Üzüntü"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-red-400 to-red-600 rounded-t"
                      style={{ height: `${(item.moods.ofke / 10) * 60}px` }}
                      title="Öfke"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t"
                      style={{ height: `${(item.moods.endise / 10) * 60}px` }}
                      title="Endişe"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-orange-400 to-orange-600 rounded-t"
                      style={{ height: `${(item.moods.stres / 10) * 60}px` }}
                      title="Stres"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-purple-400 to-purple-600 rounded-t"
                      style={{ height: `${(item.moods.huzur / 10) * 60}px` }}
                      title="Huzur"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-cyan-400 to-cyan-600 rounded-t"
                      style={{ height: `${(item.moods.enerji / 10) * 60}px` }}
                      title="Enerji"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-pink-400 to-pink-600 rounded-t"
                      style={{ height: `${(item.moods.heyecan / 10) * 60}px` }}
                      title="Heyecan"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-gray-400 to-gray-600 rounded-t"
                      style={{ height: `${(item.moods.yalnizlik / 10) * 60}px` }}
                      title="Yalnızlık"
                    ></div>
                    <div
                      className="w-6 bg-gradient-to-t from-indigo-400 to-indigo-600 rounded-t"
                      style={{ height: `${(item.moods.mizah / 10) * 60}px` }}
                      title="Mizah"
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{item.day}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Mutluluk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Üzüntü</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Öfke</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Endişe</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-orange-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Stres</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Huzur</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Enerji</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-pink-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Heyecan</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Yalnızlık</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded"></div>
                <span className="text-sm text-muted-foreground">Mizah</span>
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
            <CardTitle className="text-foreground">Detaylı Analiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Mood Analizi</h4>
              <p className="text-muted-foreground text-sm">
                Bu {selectedPeriod === "week" ? "hafta" : "ay"} boyunca duygusal durumunuz genel olarak{" "}
                {averageMoods.mutluluk >= 7 ? "pozitif" : averageMoods.mutluluk >= 5 ? "dengeli" : "değişken"} seyretti. 
                Mutluluk ve huzur seviyeleriniz yüksek, ancak stres ve endişe durumlarına dikkat etmelisiniz.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-2">Detaylı Mood Değerleri</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Mutluluk:</strong> {averageMoods.mutluluk.toFixed(1)}/10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Üzüntü:</strong> {averageMoods.uzuntu.toFixed(1)}/10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Öfke:</strong> {averageMoods.ofke.toFixed(1)}/10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Endişe:</strong> {averageMoods.endise.toFixed(1)}/10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Stres:</strong> {averageMoods.stres.toFixed(1)}/10
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Huzur:</strong> {averageMoods.huzur.toFixed(1)}/10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Enerji:</strong> {averageMoods.enerji.toFixed(1)}/10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Heyecan:</strong> {averageMoods.heyecan.toFixed(1)}/10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Yalnızlık:</strong> {averageMoods.yalnizlik.toFixed(1)}/10
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Mizah:</strong> {averageMoods.mizah.toFixed(1)}/10
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Öneriler</CardTitle>
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
