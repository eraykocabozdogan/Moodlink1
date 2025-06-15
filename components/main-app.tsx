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
import { ThemeBackground } from "@/components/ui/theme-background"
import { Menu } from "lucide-react"
import { User } from "@/components/create-group-chat"
import { useAuth } from "@/hooks/use-auth"

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

export function MainApp({ user, onLogout }: MainAppProps) {
  const [currentPage, setCurrentPage] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatDetails, setChatDetails] = useState<ChatInfo | null>(null)
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const [viewingUser, setViewingUser] = useState<any>(null)

  // Use auth hook for enhanced logout
  const { logout: authLogout } = useAuth()

  // Load saved page from localStorage on mount
  useEffect(() => {
    const savedPage = localStorage.getItem('currentPage')
    if (savedPage) {
      setCurrentPage(savedPage)
    }
  }, [])

  // Save current page to localStorage whenever it changes
  const handlePageChange = (page: string) => {
    setCurrentPage(page)
    localStorage.setItem('currentPage', page)
  }

  const handlePostClick = (postId: number) => {
    setSelectedPostId(postId)
    handlePageChange("home")
  }

  const handleUserClick = (userInfo: any) => {
    setViewingUser(userInfo)
    handlePageChange("userProfile")
  }

  // Enhanced logout function
  const handleLogout = () => {
    console.log('MainApp logout triggered')

    // Clear current page from localStorage
    localStorage.removeItem('currentPage')

    // Use auth hook logout (clears localStorage)
    authLogout()

    // Call parent logout (changes screen)
    onLogout()
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onUserClick={handleUserClick} />
      case "search":
        return <SearchPage onUserClick={handleUserClick} />
      case "notifications":
        return <NotificationsPage onPostClick={(postId) => {
          // Navigate to home page
          console.log('Notification clicked, navigating to home page for post:', postId)
          handlePageChange("home")
          // TODO: When backend fixes relatedEntityId, we can scroll to specific post
        }} />
      case "messages":
        return (
          <MessagesPage
            onChatSelect={(chatInfo) => {
              setChatDetails(chatInfo)
              handlePageChange("chat")
            }}
            onUserClick={handleUserClick}
          />
        )
      case "chat":
        return <ChatPage chatDetails={chatDetails} onBack={() => handlePageChange("messages")} />
      case "profile":
        return <ProfilePage />
      case "userProfile":
        return <UserProfilePage user={viewingUser} onBack={() => handlePageChange("home")} />
      case "activities":
        return <ActivitiesPage />
      case "moodreport":
        return <MoodReportPage />
      case "options":
        return <OptionsPage onLogout={handleLogout} onThemeSettings={() => handlePageChange("themeSettings")} />
      case "themeSettings":
        return <ThemeSettingsPage onBack={() => handlePageChange("options")} />
      default:
        return <HomePage />
    }
  }

  const showRightSidebar = ["home", "search"].includes(currentPage)

  return (
    <ThemeBackground>
      <div className="flex h-screen">
        {/* Hamburger menu button - always visible */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 p-3 bg-card/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-shadow border border-border"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <div className="flex-1 flex">
          <main className={`flex-1 ${showRightSidebar ? "xl:mr-80" : ""}`}>{renderPage()}</main>

          {/* Right sidebar */}
          {showRightSidebar && <RightSidebar currentPage={currentPage} onUserClick={handleUserClick} />}
        </div>
      </div>
    </ThemeBackground>
  )
}
