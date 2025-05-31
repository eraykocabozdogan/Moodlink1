"use client"

import {
  Heart,
  Home,
  Search,
  Bell,
  MessageCircle,
  Users,
  User,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  onLogout: () => void
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ currentPage, onPageChange, onLogout, isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { id: "home", label: "Ana Sayfa", icon: Home },
    { id: "search", label: "Arama", icon: Search },
    { id: "notifications", label: "Bildirimler", icon: Bell },
    { id: "messages", label: "Direkt Mesajlar", icon: MessageCircle },
    { id: "community", label: "Topluluk", icon: Users },
    { id: "profile", label: "Profil", icon: User },
    { id: "activities", label: "Etkinlikler", icon: Calendar },
    { id: "moodreport", label: "Ruh Hali Raporu", icon: BarChart3 },
    { id: "options", label: "Seçenekler", icon: Settings },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out shadow-xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MoodLink
              </h1>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id)
                    onClose()
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                        : "text-foreground hover:bg-muted"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button
              onClick={onLogout}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Çıkış Yap
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
