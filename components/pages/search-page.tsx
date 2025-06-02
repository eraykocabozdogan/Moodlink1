"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, Users } from "lucide-react"

interface SearchPageProps {
  onUserClick?: (user: any) => void;
}

export function SearchPage({ onUserClick }: SearchPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState("")

  const trends = [
    { tag: "#invincible", percentage: "71%" },
    { tag: "#USA", percentage: "21%" },
  ]

  const moodTrends = [
    { tag: "#invincible", percentage: "71%" },
    { tag: "#Fener", percentage: "86%" },
  ]
  
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
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-xl font-bold text-foreground">Arama</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Kullanıcı, gönderi, etiket ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-muted border-border focus:bg-card focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Trends */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <h3 className="font-bold text-lg mb-4 text-foreground">Trendler</h3>
          <div className="space-y-3">
            {trends.map((trend, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg cursor-pointer"
              >
                <span className="text-primary font-medium">{trend.tag}</span>
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">{trend.percentage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Trends */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <h3 className="font-bold text-lg mb-4 text-foreground">Senin Moduna Göre</h3>
          <div className="space-y-3">
            {moodTrends.map((trend, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg cursor-pointer"
              >
                <span className="text-pink-600 font-medium">{trend.tag}</span> {/* Bu renk özel kalabilir veya tema değişkeni eklenebilir */} 
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">{trend.percentage}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Suggested Users */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <h3 className="font-bold text-lg mb-4 text-foreground">Keşfet: Kullanıcılar</h3>
          <div className="space-y-4">
            {suggestedUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer"
                onClick={() => onUserClick && onUserClick(user)}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                  {user.username.substring(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <h4 className="font-medium text-foreground">{user.username}</h4>
                    <span className="ml-2 text-sm text-muted-foreground">@{user.handle}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{user.bio}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                    <span><strong>{user.followers}</strong> takipçi</span>
                    <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground"></span>
                    <span><strong className="text-primary">{Math.floor(Math.random() * 30) + 70}%</strong> uyum</span>
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
