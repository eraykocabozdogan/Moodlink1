"use client"

import { useState, useEffect, useCallback } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import apiClient from "@/lib/apiClient"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

interface NotificationsPageProps {
  onPostClick?: (postId: string) => void
}

// Backend'den gelen bildirim verisinin tipini tanımlayalım
interface Notification {
  id: string;
  userId: string;
  type: number; // NotificationType enum: 1=Like, 2=Comment, 3=Share, 4=Follow, 5=Mention, vb.
  content: string;
  relatedEntityId: string | null; // Post ID, User ID, vb.
  relatedEntityType: string | null;
  isRead: boolean;
  createdDate?: string; // API'den geliyorsa ekleyelim
}

export function NotificationsPage({ onPostClick }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Bildirimleri backend'den çeken fonksiyon
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<{ items: Notification[] }>('/api/Notifications')
      setNotifications(response.items)
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
      setError("Bildirimler yüklenirken bir sorun oluştu.")
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Bildirimler yüklenirken bir sorun oluştu.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])
  
  // Sayfa yüklendiğinde bildirimleri çek
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Bildirim tipine göre metin oluştur
  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case 1: // Like
        return "Gönderinizi beğendi."
      case 2: // Comment
        return "Gönderinize yorum yaptı."
      case 3: // Share
        return "Gönderinizi paylaştı."
      case 4: // Follow
        return "Sizi takip etmeye başladı."
      case 5: // Mention
        return "Sizi bir gönderide etiketledi."
      default:
        return notification.content || "Yeni bildirim"
    }
  }

  // Bildirim zamanını formatla
  const formatNotificationTime = (dateString?: string) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return formatDistanceToNow(date, { addSuffix: true, locale: tr })
    } catch (error) {
      return ""
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (onPostClick && notification.relatedEntityId && notification.relatedEntityType === "Post") {
      onPostClick(notification.relatedEntityId)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-foreground">Bildirimler</h1>
        </div>
      </div>

      <div className="bg-card">
        {isLoading ? (
          // Yükleme durumunda gösterilecek iskelet (skeleton) bileşenleri
          <div className="space-y-4 p-4">
            <div className="flex space-x-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <div className="flex space-x-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ) : error ? (
          // Hata durumunda gösterilecek mesaj
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          // Bildirim yoksa gösterilecek mesaj
          <div className="p-4 text-center text-muted-foreground">Henüz bildiriminiz bulunmuyor.</div>
        ) : (
          // Bildirimler listesi
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="border-b border-border p-4 hover:bg-muted cursor-pointer transition-colors"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-foreground font-medium">{getNotificationText(notification)}</p>
                  {notification.content && (
                    <p className="text-muted-foreground text-sm mt-1 bg-muted p-2 rounded-lg">"{notification.content}"</p>
                  )}
                  <span className="text-muted-foreground text-xs">{formatNotificationTime(notification.createdDate)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
