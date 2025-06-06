"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, MapPin, Users, Plus, X } from "lucide-react"
import apiClient from "@/lib/apiClient"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"

// Backend'den gelen Activity tipini tanımlayalım
interface Activity {
  id: number | string;
  name: string;
  description?: string;
  eventTime: string;
  location: string;
  createdByUserId: string;
  category: string;
  targetMoodDescription?: string;
  // Bu alanlar API'den gelmeyebilir, gerekirse kaldırılır veya ayarlanır
  participants?: number; 
  status?: 'upcoming' | 'completed' | string;
}

export function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [filter, setFilter] = useState("all")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [joinedActivities, setJoinedActivities] = useState<number[]>([])

  const [newActivity, setNewActivity] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
    category: "sports",
    targetMoodDescription: "Excited",
  })
  
  const { toast } = useToast()
  const { user: authUser } = useAuth() // Get authenticated user from context

  const fetchActivities = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<{ items: Activity[] }>('/api/Activities')
      // API'dan gelen veriyi, frontend'de kullanacağımız formata dönüştürüyoruz.
      const formattedActivities = response.items.map(act => ({
          ...act,
          status: new Date(act.eventTime) > new Date() ? 'upcoming' : 'completed',
          participants: Math.floor(Math.random() * 20) + 5 // Katılımcı sayısı API'de yoksa, geçici olarak rastgele oluştur
      }));
      setActivities(formattedActivities)
    } catch (err) {
      console.error("Failed to fetch activities:", err)
      setError("Aktiviteler yüklenirken bir hata oluştu.")
      toast({ variant: "destructive", title: "Hata", description: "Aktiviteler alınamadı." })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  const handleCreateActivity = async () => {
    if (!newActivity.name || !newActivity.date || !newActivity.time || !newActivity.location) {
        toast({ variant: "destructive", title: "Eksik Bilgi", description: "Lütfen tüm zorunlu alanları doldurun."})
        return
    }

    if (!authUser) {
        toast({ variant: "destructive", title: "Hata", description: "Aktivite oluşturmak için giriş yapmalısınız."})
        return
    }

    // Tarih ve zamanı birleştirip ISO formatına çevir
    const eventTime = new Date(`${newActivity.date}T${newActivity.time}`).toISOString()

    const activityData = {
        name: newActivity.name,
        description: newActivity.description,
        eventTime: eventTime,
        location: newActivity.location,
        category: newActivity.category,
        targetMoodDescription: newActivity.targetMoodDescription,
        createdByUserId: authUser.id, // Use the authenticated user's ID
    }

    try {
        await apiClient.post('/api/Activities', activityData)
        toast({ title: "Başarılı!", description: "Yeni aktivite oluşturuldu."})
        
        setShowCreateForm(false)
        setNewActivity({ name: "", date: "", time: "", location: "", description: "", category: "sports", targetMoodDescription: "Excited" })
        fetchActivities() // Listeyi yenile
    } catch (err) {
        console.error("Failed to create activity:", err);
        toast({ variant: "destructive", title: "Hata", description: "Aktivite oluşturulamadı."})
    }
  }
  
  const handleJoinActivity = (activityId: number) => {
    // TODO: Bu fonksiyonu /api/ActivityParticipations endpoint'ine bağla
    if (joinedActivities.includes(activityId)) {
      setJoinedActivities(joinedActivities.filter((id) => id !== activityId))
    } else {
      setJoinedActivities([...joinedActivities, activityId])
    }
    // Bu kısım şimdilik simülasyon olarak kalabilir.
  }

  const filteredActivities = activities.filter((activity) => {
    if (filter === "all") return true
    if (filter === "upcoming") return activity.status === "upcoming"
    if (filter === "completed") return activity.status === "completed"
    return activity.category === filter
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="w-[120px]"></div>
          <h1 className="text-xl font-bold text-foreground">Aktiviteler</h1>
          <Button onClick={() => setShowCreateForm(true)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Aktivite Oluştur
          </Button>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2">
            {["all", "upcoming", "completed", "sports", "culture", "entertainment"].map((f) => (
                <Button key={f} onClick={() => setFilter(f)} variant={filter === f ? "default" : "outline"} size="sm" className={`capitalize ${filter === f ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : ""}`}>{f}</Button>
            ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {showCreateForm && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Yeni Aktivite Oluştur</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowCreateForm(false)}><X className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Aktivite adı" value={newActivity.name} onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <Input type="date" value={newActivity.date} onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })} />
                <Input type="time" value={newActivity.time} onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })} />
              </div>
              <Input placeholder="Konum" value={newActivity.location} onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })} />
              <Textarea placeholder="Açıklama (opsiyonel)" value={newActivity.description} onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })} />
              <Button onClick={handleCreateActivity} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">Oluştur</Button>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
            <div className="space-y-4">
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
            </div>
        ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
        ) : filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
                <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{activity.name}</CardTitle>
                            <Badge variant={activity.status === "upcoming" ? "default" : "secondary"}>{activity.status}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(activity.eventTime).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{new Date(activity.eventTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{activity.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="flex items-center gap-1 text-sm text-muted-foreground"><Users className="w-4 h-4" />{activity.participants} katılımcı</span>
                                {activity.targetMoodDescription && <Badge variant="outline">{activity.targetMoodDescription}</Badge>}
                            </div>
                            <Button onClick={() => handleJoinActivity(activity.id as number)} variant={joinedActivities.includes(activity.id as number) ? "secondary" : "default"} size="sm">{joinedActivities.includes(activity.id as number) ? "Ayrıl" : "Katıl"}</Button>
                        </div>
                    </CardContent>
                </Card>
            ))
        ) : (
            <div className="text-center py-8"><p className="text-muted-foreground">Bu kategoride aktivite bulunamadı.</p></div>
        )}
      </div>
    </div>
  )
}