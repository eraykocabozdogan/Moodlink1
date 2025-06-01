"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const trends = [
    { tag: "#invincible", percentage: "71%" },
    { tag: "#USA", percentage: "21%" },
  ]

  const moodTrends = [
    { tag: "#invincible", percentage: "71%" },
    { tag: "#Fener", percentage: "86%" },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-xl font-bold text-foreground mb-4">Arama</h1>
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
      </div>
    </div>
  )
}
