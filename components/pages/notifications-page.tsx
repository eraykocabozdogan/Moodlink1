"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import apiClient from "@/lib/apiClient"
import { NotificationListItemDto, NotificationType } from "@/lib/types/api"

interface EnhancedNotification extends NotificationListItemDto {
  postContent?: string
  postPreview?: string
}

interface NotificationsPageProps {
  onPostClick?: (postId: string) => void
}

export function NotificationsPage({ onPostClick }: NotificationsPageProps) {
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
        const uniqueNotifications = rawNotifications.filter((notification, index, array) =>
          array.findIndex(n => n.id === notification.id) === index
        )

        console.log(`Removed ${rawNotifications.length - uniqueNotifications.length} duplicate notifications`)

        // Load user's posts to match with notifications
        let userPosts: any[] = []
        try {
          const postsResponse = await apiClient.getUserPosts(user.id, {
            PageIndex: 0,
            PageSize: 100 // Get more posts to increase match chances
          })
          userPosts = postsResponse.items || []
          console.log('Loaded user posts for notification enhancement:', userPosts.length)
        } catch (postsError) {
          console.warn('Could not load user posts for notification enhancement:', postsError)
        }

        // Enhance notifications with post content
        const enhancedNotifications: EnhancedNotification[] = await Promise.all(
          uniqueNotifications.map(async (notification) => {
          const enhanced: EnhancedNotification = { ...notification }

          // Check if this is a post-related notification
          const isPostRelated = notification.type === 1 || notification.type === 2 ||
                               notification.content?.includes('gönderinizi') ||
                               notification.content?.includes('post')

          if (isPostRelated) {
            // Try to find the related post by relatedEntityId first
            let relatedPost = null

            if (notification.relatedEntityId) {
              // First check in user's posts
              relatedPost = userPosts.find(post => post.id === notification.relatedEntityId)
              // If not found in user posts, try to fetch it directly from API
              if (!relatedPost) {
                try {
                  const postResponse = await apiClient.getPostById(notification.relatedEntityId)
                  relatedPost = postResponse
                  console.log(`✅ Fetched post from API for notification`)
                } catch (error) {
                  // Post might be deleted or inaccessible, will use fallback
                }
              }
            }

            // If no specific post found, try to match by notification content
            if (!relatedPost && notification.content && userPosts.length > 0) {
              // Look for post content mentioned in notification
              const contentMatch = notification.content.match(/"([^"]+)"/)
              if (contentMatch && contentMatch[1]) {
                const mentionedContent = contentMatch[1]
                relatedPost = userPosts.find(post =>
                  post.contentText && post.contentText.includes(mentionedContent)
                )
              }
            }

            // Fallback: use most recent post only for follow notifications
            if (!relatedPost && notification.type === 3 && userPosts.length > 0) { // Follow notification
              relatedPost = userPosts[0] // Most recent post for follow notifications
            }

            if (relatedPost) {
              enhanced.postContent = relatedPost.contentText || ''
              enhanced.postPreview = relatedPost.contentText
                ? (relatedPost.contentText.length > 50
                   ? relatedPost.contentText.substring(0, 50) + '...'
                   : relatedPost.contentText)
                : 'Post content not available'
            } else {
              // Graceful fallback: extract any quoted content from notification text
              const quotedMatch = notification.content?.match(/"([^"]+)"/)
              if (quotedMatch && quotedMatch[1]) {
                enhanced.postPreview = quotedMatch[1]
                enhanced.postContent = quotedMatch[1]
              } else {
                // Generic fallback based on notification type
                if (notification.type === 1) { // Like
                  enhanced.postPreview = "Beğenilen gönderi (içerik mevcut değil)"
                } else if (notification.type === 2) { // Comment
                  enhanced.postPreview = "Yorumlanan gönderi (içerik mevcut değil)"
                } else {
                  enhanced.postPreview = "İlgili gönderi (içerik mevcut değil)"
                }
                enhanced.postContent = enhanced.postPreview
              }
            }
          }

          return enhanced
          })
        )

        setNotifications(enhancedNotifications)
      } catch (error: any) {
        console.error('Failed to load notifications:', error)
        setError('Failed to load notifications')
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [user])

  const handleNotificationClick = async (notification: EnhancedNotification) => {
    console.log('Notification clicked:', notification)

    // Just log the click, don't navigate anywhere
    console.log('Notification clicked, no navigation')

    // TODO: Mark notification as read (temporarily disabled due to API issues)
    // if (!notification.isRead) {
    //   await apiClient.markNotificationAsRead(notification.id)
    //   setNotifications(prev =>
    //     prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    //   )
    // }
  }

  // Helper function to format notification text
  const formatNotificationText = (notification: NotificationListItemDto) => {
    if (!notification.content) return 'New notification'

    // Clean up notification text - remove quoted content since we show it separately
    let cleanText = notification.content

    // Remove quoted content (we show it in the preview box)
    cleanText = cleanText.replace(/"[^"]*"/g, '').trim()

    // Remove extra spaces and clean up
    cleanText = cleanText.replace(/\s+/g, ' ').trim()

    // If text is too short after cleaning, use original
    if (cleanText.length < 10) {
      cleanText = notification.content
    }

    return cleanText || 'New notification'
  }

  // Helper function to format time ago
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

      if (diffInSeconds < 60) return `${diffInSeconds}s`
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
      return `${Math.floor(diffInSeconds / 86400)}d`
    } catch (error) {
      console.error('Date formatting error:', error)
      return 'now'
    }
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
                !notification.isRead ? 'bg-blue-50 dark:bg-blue-950/20' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex space-x-3">
                <div className={`w-8 h-8 rounded-full flex-shrink-0 ${
                  !notification.isRead
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
                }`}></div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {formatNotificationText(notification)}
                  </p>

                  {/* Show post preview if available */}
                  {notification.postPreview && (
                    <div className="mt-2 p-2 bg-muted/50 rounded-lg border-l-2 border-blue-500">
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
                      <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
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
