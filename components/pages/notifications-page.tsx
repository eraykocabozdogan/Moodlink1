"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { ProfileImage } from "@/components/ui/profile-image"
import apiClient from "@/lib/apiClient"
import { NotificationListItemDto, NotificationType } from "@/lib/types/api"

interface EnhancedNotification extends NotificationListItemDto {
  postContent?: string
  postPreview?: string
  // Profile picture fields
  senderProfilePictureFileId?: string
  senderProfileImageFileId?: string
  senderProfilePictureUrl?: string
  senderProfileImageUrl?: string
  senderUserProfileImageUrl?: string
  senderFirstName?: string
  senderLastName?: string
  senderUserName?: string
}

interface NotificationsPageProps {
  onPostClick?: (postId: string) => void
  onNavigate?: (page: string, data?: any) => void // For navigation
}

export function NotificationsPage({ onPostClick, onNavigate }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<EnhancedNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Load notifications from backend
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // Load notifications
        const notificationsResponse = await apiClient.getUserNotifications({
          PageIndex: 0,
          PageSize: 50
        })
        const rawNotifications = notificationsResponse.items || []

        // Remove duplicate notifications by ID
        const uniqueByIdNotifications = rawNotifications.filter((notification, index, array) =>
          array.findIndex(n => n.id === notification.id) === index
        )

        // Also remove duplicates by content and type (for similar notifications)
        const uniqueNotifications = uniqueByIdNotifications.filter((notification, index, array) => {
          const key = `${notification.type}-${notification.content}`
          return array.findIndex(n => `${n.type}-${n.content}` === key) === index
        })



        // Sort notifications by creation date (newest first)
        uniqueNotifications.sort((a, b) => {
          const dateA = new Date(a.createdDate).getTime()
          const dateB = new Date(b.createdDate).getTime()
          return dateB - dateA // Newest first
        })

        // Load user's posts to match with notifications
        let userPosts: any[] = []
        try {
          const postsResponse = await apiClient.getUserPosts(user.id, {
            PageIndex: 0,
            PageSize: 100 // Get more posts to increase match chances
          })
          userPosts = postsResponse.items || []
        } catch (postsError) {
          // Could not load user posts for notification enhancement
        }

        // Enhance notifications with post content and user info
        const enhancedNotifications: EnhancedNotification[] = await Promise.all(
          uniqueNotifications.map(async (notification) => {
            const enhanced: EnhancedNotification = { ...notification }

            // Try to get sender user info if senderUserId exists
            if (notification.senderUserId) {
              try {
                const senderUser = await apiClient.getUserById(notification.senderUserId)
                enhanced.senderProfilePictureFileId = senderUser.profilePictureFileId
                enhanced.senderProfileImageFileId = senderUser.profileImageFileId
                enhanced.senderProfilePictureUrl = senderUser.profilePictureUrl
                enhanced.senderProfileImageUrl = senderUser.profileImageUrl
                enhanced.senderFirstName = senderUser.firstName
                enhanced.senderLastName = senderUser.lastName
                enhanced.senderUserName = senderUser.userName
              } catch (error) {
                // Could not load sender user info
              }
            }

            // Check if this is a post-related notification
            const isPostRelated = notification.type === 1 || notification.type === 2 ||
                                 notification.content?.includes('gönderinizi') ||
                                 notification.content?.includes('post')

            if (isPostRelated && userPosts.length > 0) {
              // Try to find the related post
              // Since relatedEntityId is null, we'll use heuristics
              // For now, we'll just take the most recent post as an example
              const recentPost = userPosts[0] // Most recent post
              if (recentPost) {
                enhanced.postContent = recentPost.contentText || ''
                enhanced.postPreview = recentPost.contentText
                  ? (recentPost.contentText.length > 50
                     ? recentPost.contentText.substring(0, 50) + '...'
                     : recentPost.contentText)
                  : 'Post content not available'
              }
            }

            return enhanced
          })
        )

        setNotifications(enhancedNotifications)
      } catch (error: any) {
        setError('Failed to load notifications')
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [user])

  const handleNotificationClick = async (notification: EnhancedNotification) => {
    // Mark notification as read if it's unread
    if (!notification.isRead) {
      try {
        await apiClient.markNotificationAsRead(notification)

        // Update local state to reflect the change
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
        )
      } catch (error) {
        // Don't show error to user, just log it
      }
    }
  }

  // Helper function to format notification text
  const formatNotificationText = (notification: NotificationListItemDto) => {
    return notification.content || 'New notification'
  }

  // Helper function to format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    return `${Math.floor(diffInSeconds / 86400)}d`
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading notifications...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        </div>
      </div>

      <div className="bg-card">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`border-b border-border p-4 hover:bg-muted cursor-pointer transition-colors ${
                !notification.isRead ? 'bg-accent/30 border-l-4 border-l-primary' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex space-x-3">
                <ProfileImage
                  src={notification.senderProfilePictureFileId ||
                       notification.senderProfileImageFileId ||
                       notification.senderProfilePictureUrl ||
                       notification.senderProfileImageUrl ||
                       notification.senderUserProfileImageUrl ||
                       null}
                  alt={notification.senderUserName || notification.senderFirstName || 'User'}
                  size="sm"
                  fallbackText={notification.senderFirstName || notification.senderUserName || 'N'}
                  className="w-8 h-8 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className={`font-medium ${
                    !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {formatNotificationText(notification)}
                  </p>

                  {/* Show post preview if available */}
                  {notification.postPreview && (
                    <div className="mt-2 p-2 bg-muted/50 rounded-lg border-l-2 border-primary">
                      <p className="text-sm text-muted-foreground italic">
                        "{notification.postPreview}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center mt-2">
                    <span className="text-muted-foreground text-xs">
                      {formatTime(notification.createdDate)}
                    </span>
                    {!notification.isRead && (
                      <span className="ml-2 inline-block w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
