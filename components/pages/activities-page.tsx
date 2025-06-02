"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Plus, X } from "lucide-react"
import { useLanguage } from "../language-provider"

export function ActivitiesPage() {
  const { t } = useLanguage()
  const [filter, setFilter] = useState("all")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [joinedActivities, setJoinedActivities] = useState<number[]>([])

  const [newActivity, setNewActivity] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    category: "spor",
    mood: "Heyecanlı",
  })

  const [activities, setActivities] = useState([
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
  ])

  const handleJoinActivity = (activityId: number) => {
    if (joinedActivities.includes(activityId)) {
      setJoinedActivities(joinedActivities.filter((id) => id !== activityId))
      setActivities(
        activities.map((activity) =>
          activity.id === activityId ? { ...activity, participants: activity.participants - 1 } : activity,
        ),
      )
    } else {
      setJoinedActivities([...joinedActivities, activityId])
      setActivities(
        activities.map((activity) =>
          activity.id === activityId ? { ...activity, participants: activity.participants + 1 } : activity,
        ),
      )
    }
  }

  const handleCreateActivity = () => {
    if (newActivity.title && newActivity.date && newActivity.time && newActivity.location) {
      const activity = {
        id: Date.now(),
        title: newActivity.title,
        date: newActivity.date,
        time: newActivity.time,
        location: newActivity.location,
        participants: 1,
        mood: newActivity.mood,
        category: newActivity.category,
        status: "upcoming" as const,
      }

      setActivities([activity, ...activities])
      setJoinedActivities([...joinedActivities, activity.id])
      setNewActivity({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        category: "spor",
        mood: "Heyecanlı",
      })
      setShowCreateForm(false)
    }
  }

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
          <div className="w-[120px]"></div>
          <h1 className="text-xl font-bold text-foreground">{t("title.activities")}</h1>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("activities.create")}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { id: "all", label: t("activities.all") },
            { id: "upcoming", label: t("activities.upcoming") },
            { id: "completed", label: t("activities.completed") },
            { id: "spor", label: t("activities.sports") },
            { id: "kultur", label: t("activities.culture") },
            { id: "eglence", label: t("activities.entertainment") },
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
        {/* Create Activity Form */}
        {showCreateForm && (
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t("activities.create")}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Etkinlik başlığı"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  value={newActivity.date}
                  onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                />
                <Input
                  type="time"
                  value={newActivity.time}
                  onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                />
              </div>
              <Input
                placeholder="Konum"
                value={newActivity.location}
                onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
              />
              <Textarea
                placeholder="Açıklama (opsiyonel)"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="p-2 border rounded-md"
                  value={newActivity.category}
                  onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                >
                  <option value="spor">Spor</option>
                  <option value="kultur">Kültür</option>
                  <option value="eglence">Eğlence</option>
                </select>
                <select
                  className="p-2 border rounded-md"
                  value={newActivity.mood}
                  onChange={(e) => setNewActivity({ ...newActivity, mood: e.target.value })}
                >
                  <option value="Heyecanlı">Heyecanlı</option>
                  <option value="Huzurlu">Huzurlu</option>
                  <option value="Enerjik">Enerjik</option>
                  <option value="Rahat">Rahat</option>
                </select>
              </div>
              <Button
                onClick={handleCreateActivity}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {t("general.create")}
              </Button>
            </CardContent>
          </Card>
        )}

        {filteredActivities.map((activity) => (
          <Card key={activity.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{activity.title}</CardTitle>
                <Badge variant={activity.status === "upcoming" ? "default" : "secondary"}>
                  {activity.status === "upcoming" ? t("activities.upcoming") : t("activities.completed")}
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
                      <span>
                        {activity.participants} {t("community.members")}
                      </span>
                    </div>
                    <Badge className={getMoodColor(activity.mood)}>{activity.mood}</Badge>
                  </div>

                  <Button
                    onClick={() => handleJoinActivity(activity.id)}
                    variant={joinedActivities.includes(activity.id) ? "outline" : "default"}
                    size="sm"
                    className={
                      !joinedActivities.includes(activity.id)
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        : "border-purple-300 text-purple-600 hover:bg-purple-50"
                    }
                  >
                    {joinedActivities.includes(activity.id) ? t("general.leave") : t("general.join")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredActivities.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{t("activities.all")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
