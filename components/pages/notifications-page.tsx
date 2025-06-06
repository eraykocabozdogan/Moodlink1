"use client"

interface NotificationsPageProps {
  onPostClick?: (postId: number) => void
}

export function NotificationsPage({ onPostClick }: NotificationsPageProps) {
  const notifications = [
    {
      id: 1,
      text: "Doğan and 2 others liked your post.",
      snippet: "I really like #invincible",
      time: "2s",
      postId: 1,
      type: "like",
    },
    {
      id: 2,
      text: "Eray replied to you.",
      snippet: "I don't care!",
      time: "5m",
      postId: 2,
      type: "reply",
    },
    {
      id: 3,
      text: "Ahmet shared your post.",
      snippet: "Hello Madritistas",
      time: "1h",
      postId: 1,
      type: "share",
    },
  ]

  const handleNotificationClick = (notification: any) => {
    if (onPostClick && notification.postId) {
      onPostClick(notification.postId)
    }
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
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="border-b border-border p-4 hover:bg-muted cursor-pointer transition-colors"
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-foreground font-medium">{notification.text}</p>
                <p className="text-muted-foreground text-sm mt-1 bg-muted p-2 rounded-lg">"{notification.snippet}"</p>
                <span className="text-muted-foreground text-xs">{notification.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
