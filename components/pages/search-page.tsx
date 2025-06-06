"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, Users } from "lucide-react"

interface SearchPageProps {
  onUserClick?: (user: any) => void;
}

export function SearchPage({ onUserClick }: SearchPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState("")

  const suggestedUsers = [
    { 
      username: "Ahmet Yılmaz", 
      handle: "ahmet_yilmaz", 
      bio: "Sporcu ve fotoğrafçı",
      followers: "2.5K",
      following: "450",
      moods: [
        { name: "Enerjik", percentage: "78%" },
        { name: "Heyecanlı", percentage: "65%" },
      ],
      badges: ["🏆", "📸"]
    },
    { 
      username: "Ayşe Kaya", 
      handle: "ayse_kaya", 
      bio: "Yazar ve doğa sever",
      followers: "1.8K",
      following: "302",
      moods: [
        { name: "Sakin", percentage: "82%" },
        { name: "İlham Dolu", percentage: "74%" },
      ],
      badges: ["✍️", "🌿"]
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-foreground">Arama</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Kullanıcı ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-muted border-border focus:bg-card focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Suggested Users */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <h3 className="font-bold text-lg mb-4 text-foreground">Önerilen Kullanıcılar</h3>
          <div className="space-y-4">
            {suggestedUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                onClick={() => onUserClick && onUserClick(user)}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline space-x-2">
                    <h4 className="font-medium text-foreground truncate">{user.username}</h4>
                    <span className="text-sm text-muted-foreground">@{user.handle}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{user.bio}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-muted-foreground">
                      <strong className="text-foreground">{user.followers}</strong> Takipçi
                    </span>
                    <span className="text-xs text-muted-foreground">
                      <strong className="text-foreground">{user.following}</strong> Takip
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
