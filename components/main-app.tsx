"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { HomePage } from "@/components/pages/home-page"
import { SearchPage } from "@/components/pages/search-page"
import { NotificationsPage } from "@/components/pages/notifications-page"
import { MessagesPage } from "@/components/pages/messages-page"
import { CommunityPage } from "@/components/pages/community-page"
import { ProfilePage } from "@/components/pages/profile-page"
import { OptionsPage } from "@/components/pages/options-page"
import { ChatPage } from "@/components/pages/chat-page"
import { ThemeSettingsPage } from "@/components/pages/theme-settings-page"
import { RightSidebar } from "@/components/right-sidebar"
import { Menu } from "lucide-react"

interface MainAppProps {
  user: any
  onLogout: () => void
}

export function MainApp({ user, onLogout }: MainAppProps) {
  const [currentPage, setCurrentPage] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatUser, setChatUser] = useState<string | null>(null)

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />
      case "search":
        return <SearchPage />
      case "notifications":
        return <NotificationsPage />
      case "messages":
        return (
          <MessagesPage
            onChatSelect={(username) => {
              setChatUser(username)
              setCurrentPage("chat")
            }}
          />
        )
      case "chat":
        return <ChatPage chatUser={chatUser} onBack={() => setCurrentPage("messages")} />
      case "community":
        return <CommunityPage />
      case "profile":
        return <ProfilePage user={user} />
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
    <div className="flex h-screen bg-gray-50">
      {/* Hamburger menu button - always visible */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
      >
        <Menu className="w-6 h-6 text-gray-700" />
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
        {showRightSidebar && <RightSidebar currentPage={currentPage} />}
      </div>
    </div>
  )
}
