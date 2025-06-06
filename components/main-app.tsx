"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { HomePage } from "@/components/pages/home-page"
import { SearchPage } from "@/components/pages/search-page"
import { NotificationsPage } from "@/components/pages/notifications-page"
import { MessagesPage } from "@/components/pages/messages-page"
import { CommunityPage } from "@/components/pages/community-page"
import { ProfilePage } from "@/components/pages/profile-page"
import { UserProfilePage } from "@/components/pages/user-profile-page"
import { OptionsPage } from "@/components/pages/options-page"
import { ChatPage } from "@/components/pages/chat-page"
import { ThemeSettingsPage } from "@/components/pages/theme-settings-page"
import { MoodReportPage } from "@/components/pages/mood-report-page"
import { ActivitiesPage } from "@/components/pages/activities-page"
import { RightSidebar } from "@/components/right-sidebar"
import { Menu } from "lucide-react"
import { User } from "@/components/create-group-chat"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import signalRService, { Notification as SignalRNotification } from "@/lib/signalr-service"
import { useToast } from "@/hooks/use-toast"

interface ChatInfo {
  id: number
  type: "user" | "group"
  title: string
  handle?: string
  members?: User[]
  lastMessage: string
  time: string
}

interface MainAppProps {
  user: any
  onLogout: () => void
}

export function MainApp({ user: initialUser, onLogout: externalLogout }: MainAppProps) {
  const [currentPage, setCurrentPage] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatDetails, setChatDetails] = useState<ChatInfo | null>(null)
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const [viewingUser, setViewingUser] = useState<any>(null)

  const handlePostClick = (postId: number) => {
    setSelectedPostId(postId)
    setCurrentPage("home") 
  }

  const handleUserClick = (userInfo: any) => {
    setViewingUser(userInfo)
    setCurrentPage("userProfile")
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onUserClick={handleUserClick} />
      case "search":
        return <SearchPage onUserClick={handleUserClick} />
      case "notifications":
        return <NotificationsPage />
      case "messages":
        return (
          <MessagesPage
            onChatSelect={(chatInfo) => {
              setChatDetails(chatInfo)
              setCurrentPage("chat")
            }}
            onUserClick={handleUserClick}
          />
        )
      case "chat":
        return <ChatPage chatDetails={chatDetails} onBack={() => setCurrentPage("messages")} />
      case "profile":
        return <ProfilePage user={user} />
      case "userProfile":
        return <UserProfilePage user={viewingUser} onBack={() => setCurrentPage("home")} />
      case "activities":
        return <ActivitiesPage />
      case "moodreport":
        // --- DEĞİŞİKLİK BURADA ---
        // MoodReportPage bileşenine 'user' prop'u aktarılıyor.
        return <MoodReportPage user={user} />
      case "options":
        return <OptionsPage onLogout={onLogout} onThemeSettings={() => setCurrentPage("themeSettings")} />
      case "themeSettings":
        return <ThemeSettingsPage onBack={() => setCurrentPage("options")} />
      default:
        return <HomePage />
    }
  }

  const showRightSidebar = ["home", "search"].includes(currentPage)

  // AuthProvider ile sarmalayarak tüm alt bileşenlere auth context'i sağlayalım
  return (
    <AuthProvider>
      <MainAppContent 
        initialUser={initialUser}
        externalLogout={externalLogout}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        chatDetails={chatDetails}
        setChatDetails={setChatDetails}
        selectedPostId={selectedPostId}
        setSelectedPostId={setSelectedPostId}
        viewingUser={viewingUser}
        setViewingUser={setViewingUser}
        handlePostClick={handlePostClick}
        handleUserClick={handleUserClick}
        renderPage={renderPage}
      />
    </AuthProvider>
  )
}

// İç bileşen, AuthProvider içinde kullanılacak
function MainAppContent({
  initialUser,
  externalLogout,
  currentPage,
  setCurrentPage,
  sidebarOpen,
  setSidebarOpen,
  chatDetails,
  setChatDetails,
  selectedPostId,
  setSelectedPostId,
  viewingUser,
  setViewingUser,
  handlePostClick,
  handleUserClick,
  renderPage
}: any) {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const [hasNewMessages, setHasNewMessages] = useState(false)
  const [isSignalRConnected, setIsSignalRConnected] = useState(false)
  
  // Dış logout fonksiyonunu ve auth context'in logout fonksiyonunu birleştir
  const handleLogout = () => {
    // SignalR bağlantısını kapat
    signalRService.stopConnection()
    
    logout()
    if (externalLogout) externalLogout()
  }
  
  // Auth context'teki kullanıcı bilgilerini kullan, yoksa props'tan gelen kullanıcıyı kullan
  const currentUser = user || initialUser
  
  // SignalR bağlantısını yönet
  useEffect(() => {
    if (!currentUser?.id) return
    
    const token = localStorage.getItem('auth_token')
    if (!token) return
    
    // SignalR bağlantısını başlat
    const connectSignalR = async () => {
      const connected = await signalRService.startConnection(token, currentUser.id)
      setIsSignalRConnected(connected)
    }
    
    connectSignalR()
    
    // Bağlantı durumu değişikliklerini dinle
    const unsubscribeConnectionChange = signalRService.onConnectionChange((connected) => {
      setIsSignalRConnected(connected)
    })
    
    // Yeni bildirimleri dinle
    const unsubscribeNotifications = signalRService.onReceiveNotification((notification) => {
      // Bildirim kullanıcıya aitse
      if (notification.userId === currentUser.id) {
        // Bildirim sayfasında değilse, yeni bildirim göstergesini aktifleştir
        if (currentPage !== 'notifications') {
          setHasNewNotifications(true)
        }
        
        // Bildirim toast'u göster
        toast({
          title: "Yeni Bildirim",
          description: notification.content || getNotificationText(notification),
        })
      }
    })
    
    // Yeni mesajları dinle
    const unsubscribeMessages = signalRService.onReceiveMessage((message) => {
      // Mesaj gönderen kullanıcı kendisi değilse ve mesaj sayfasında değilse
      if (message.senderUserId !== currentUser.id && currentPage !== 'chat') {
        setHasNewMessages(true)
        
        // Mesaj toast'u göster
        toast({
          title: "Yeni Mesaj",
          description: `${message.senderUserName || 'Bilinmeyen Kullanıcı'}: ${message.content}`,
        })
      }
    })
    
    // Temizleme işlevi
    return () => {
      unsubscribeConnectionChange()
      unsubscribeNotifications()
      unsubscribeMessages()
    }
  }, [currentUser, currentPage, toast])
  
  // Bildirim tipine göre metin oluştur
  const getNotificationText = (notification: SignalRNotification) => {
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
        return "Yeni bildirim"
    }
  }
  
  // Sayfa değiştiğinde ilgili göstergeleri sıfırla
  useEffect(() => {
    if (currentPage === 'notifications') {
      setHasNewNotifications(false)
    } else if (currentPage === 'chat' || currentPage === 'messages') {
      setHasNewMessages(false)
    }
  }, [currentPage])
  
  return (
    <div className="flex h-screen bg-background">
      {/* Hamburger menu button - always visible */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-3 bg-card rounded-full shadow-lg hover:shadow-xl transition-shadow border border-border"
      >
        <Menu className="w-6 h-6 text-foreground" />
      </button>

      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        hasNewNotifications={hasNewNotifications}
        hasNewMessages={hasNewMessages}
        isSignalRConnected={isSignalRConnected}
      />

      {/* Main content */}
      <div className="flex-1 flex">
        <main className={`flex-1 ${showRightSidebar ? "xl:mr-80" : ""} overflow-auto p-4 md:p-6 pt-16 md:pt-6`}>
        {/* renderPage fonksiyonunu burada yeniden tanımlayarak currentUser'ı kullanmasını sağlıyoruz */}
        {(() => {
          switch (currentPage) {
            case "home":
              return <HomePage onUserClick={handleUserClick} />
            case "search":
              return <SearchPage onUserClick={handleUserClick} />
            case "notifications":
              return <NotificationsPage />
            case "messages":
              return (
                <MessagesPage
                  onChatSelect={(chatInfo) => {
                    setChatDetails(chatInfo)
                    setCurrentPage("chat")
                  }}
                  onUserClick={handleUserClick}
                />
              )
            case "chat":
              return <ChatPage chatDetails={chatDetails} onBack={() => setCurrentPage("messages")} />
            case "profile":
              return <ProfilePage user={currentUser} />
            case "userProfile":
              return <UserProfilePage user={viewingUser} onBack={() => setCurrentPage("home")} />
            case "activities":
              return <ActivitiesPage />
            case "moodreport":
              return <MoodReportPage user={currentUser} />
            case "options":
              return <OptionsPage onLogout={handleLogout} onThemeSettings={() => setCurrentPage("themeSettings")} />
            case "themeSettings":
              return <ThemeSettingsPage onBack={() => setCurrentPage("options")} />
            default:
              return <HomePage />
          }
        })()}
      </main>

        {/* Right sidebar */}
        {showRightSidebar && <RightSidebar currentPage={currentPage} onUserClick={handleUserClick} />}
      </div>
    </div>
  )
}