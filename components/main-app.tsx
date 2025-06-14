"use client"

import { useState } from "react"
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
        return <ProfilePage />
      case "userProfile":
        return <UserProfilePage user={viewingUser} onBack={() => setCurrentPage("home")} />
      case "activities":
        return <ActivitiesPage />
      case "moodreport":
        return <MoodReportPage />
      case "options":
        return <OptionsPage onLogout={onLogout} onThemeSettings={() => setCurrentPage("themeSettings")} />
      case "themeSettings":
        return <ThemeSettingsPage onBack={() => setCurrentPage("options")} />
      default:
        return <HomePage />
    }
  }

  const showRightSidebar = ["home", "search"].includes(currentPage)

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
        onLogout={onLogout}
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
  )
}
