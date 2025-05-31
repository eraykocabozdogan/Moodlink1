"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Plus } from "lucide-react"

export function ActivitiesPage() {
  const [filter, setFilter] = useState("all")

  const activities = [
    {
      id: 1,
      title: "Fenerbahçe - Galatasaray Maçı İzleme",
      date: "2024-01-15",
      time: "20:00",
      location: "Spor Barı",
      participants: 12,
      mood: "Heyecanlı",
      category: "spor",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Kitap Kulübü Buluşması",
      date: "2024-01-18",
      time: "19:00",
      location: "Kahve Dükkanı",
      participants: 8,
      mood: "Huzurlu",
      category: "kultur",
      status: "upcoming",
    },
    {
      id: 3,
      title: "Doğa Yürüyüşü",
      date: "2024-01-20",
      time: "09:00",
      location: "Belgrad Ormanı",
      participants: 15,
      mood: "Enerjik",
      category: "spor",
      status: "upcoming",
    },
    {
      id: 4,
      title: "Film Gecesi",
      date: "2024-01-10",
      time: "21:00",
      location: "Sinema",
      participants: 6,
      mood: "Rahat",
      category: "eglence",
      status: "completed",
    },
  ]

  const filteredActivities = activities.filter((activity) => {
    if (filter === "all") return true
    if (filter === "upcoming") return activity.status === "upcoming"
    if (filter === "completed") return activity.status === "completed"
    return activity.category === filter
  })

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "Heyecanlı":
        return "bg-red-100 text-red-700"
      case "Huzurlu":
        return "bg-blue-100 text-blue-700"
      case "Enerjik":
        return "bg-green-100 text-green-700"
      case "Rahat":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Etkinlikler</h1>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Etkinlik Oluştur
          </Button>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { id: "all", label: "Tümü" },
            { id: "upcoming", label: "Yaklaşan" },
            { id: "completed", label: "Tamamlanan" },
            { id: "spor", label: "Spor" },
            { id: "kultur", label: "Kültür" },
            { id: "eglence", label: "Eğlence" },
          ].map((filterOption) => (
            <Button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              variant={filter === filterOption.id ? "default" : "outline"}
              size="sm"
              className={
                filter === filterOption.id
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "text-foreground"
              }
            >
              {filterOption.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{activity.title}</CardTitle>
                <Badge variant={activity.status === "upcoming" ? "default" : "secondary"}>
                  {activity.status === "upcoming" ? "Yaklaşan" : "Tamamlandı"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{activity.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{activity.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{activity.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{activity.participants} katılımcı</span>
                    </div>
                    <Badge className={getMoodColor(activity.mood)}>{activity.mood}</Badge>
                  </div>

                  <Button
                    variant={activity.status === "upcoming" ? "default" : "outline"}
                    size="sm"
                    className={
                      activity.status === "upcoming"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        : ""
                    }
                  >
                    {activity.status === "upcoming" ? "Katıl" : "Detaylar"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredActivities.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Bu kategoride etkinlik bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  )
}
