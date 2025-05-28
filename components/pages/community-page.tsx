"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, TrendingUp, Search } from "lucide-react"
import { PostCard } from "@/components/post-card"

export function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>(["fenerbahce"])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCommunityName, setNewCommunityName] = useState("")

  const communities = [
    {
      id: "fenerbahce",
      name: "Fenerbahçe Fans",
      description: "Sarı lacivertli kalpler burada buluşuyor! 💛💙",
      members: "45.2K",
      moodPercentage: "92%",
      category: "Spor",
      image: "from-yellow-400 to-blue-600",
    },
    {
      id: "gameofthrones",
      name: "Game of Thrones",
      description: "Winter is coming... Westeros'un en büyük topluluğu ⚔️",
      members: "128K",
      moodPercentage: "78%",
      category: "Eğlence",
      image: "from-gray-700 to-red-600",
    },
    {
      id: "teknoloji",
      name: "Teknoloji Meraklıları",
      description: "En son teknoloji haberleri ve tartışmaları 🚀",
      members: "67.8K",
      moodPercentage: "85%",
      category: "Teknoloji",
      image: "from-blue-500 to-purple-600",
    },
    {
      id: "muzik",
      name: "Müzik Severler",
      description: "Her türden müzik ve sanatçı tartışmaları 🎵",
      members: "89.3K",
      moodPercentage: "88%",
      category: "Müzik",
      image: "from-pink-500 to-orange-500",
    },
    {
      id: "yemek",
      name: "Yemek Kültürü",
      description: "Lezzetli tarifler ve restoran önerileri 🍽️",
      members: "34.7K",
      moodPercentage: "95%",
      category: "Yaşam",
      image: "from-green-500 to-yellow-500",
    },
    {
      id: "seyahat",
      name: "Seyahat Tutkunları",
      description: "Dünyayı keşfetmeyi sevenler burada! ✈️",
      members: "52.1K",
      moodPercentage: "91%",
      category: "Seyahat",
      image: "from-cyan-500 to-blue-500",
    },
  ]

  const communityPosts = [
    {
      id: 1,
      username: "Mehmet",
      handle: "@mehmet_fb",
      time: "2s",
      content: "Bu sezon şampiyonluk bizim! Forza Fenerbahçe! 💛💙",
      moodCompatibility: "94%",
      community: "Fenerbahçe Fans",
    },
    {
      id: 2,
      username: "Ayşe",
      handle: "@ayse_got",
      time: "5dk",
      content: "House of Dragon'un yeni bölümü harikaydı! Jon Snow'u özlüyorum 😭",
      moodCompatibility: "82%",
      community: "Game of Thrones",
    },
  ]

  const handleJoinCommunity = (communityId: string) => {
    if (joinedCommunities.includes(communityId)) {
      setJoinedCommunities(joinedCommunities.filter((id) => id !== communityId))
    } else {
      setJoinedCommunities([...joinedCommunities, communityId])
    }
  }

  const handleCreateCommunity = () => {
    if (newCommunityName.trim()) {
      // Handle community creation
      setNewCommunityName("")
      setShowCreateForm(false)
    }
  }

  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">Topluluk</h1>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Topluluk Oluştur
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Topluluk ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Create Community Form */}
        {showCreateForm && (
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-3 text-gray-800">Yeni Topluluk Oluştur</h3>
              <div className="flex space-x-3">
                <Input
                  type="text"
                  placeholder="Topluluk adı..."
                  value={newCommunityName}
                  onChange={(e) => setNewCommunityName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleCreateCommunity}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Oluştur
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Joined Communities */}
        {joinedCommunities.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              Katıldığın Topluluklar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {communities
                .filter((community) => joinedCommunities.includes(community.id))
                .map((community) => (
                  <Card key={community.id} className="hover:shadow-lg transition-shadow border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${community.image} rounded-xl flex-shrink-0`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-800 truncate">{community.name}</h3>
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Katıldın
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{community.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{community.members} üye</span>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-purple-600" />
                              <span className="text-purple-600 font-medium">{community.moodPercentage} Mood</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Community Posts */}
        {joinedCommunities.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Topluluk Gönderileri</h2>
            <div className="bg-white rounded-xl border border-gray-200">
              {communityPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* All Communities */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Tüm Topluluklar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCommunities.map((community) => (
              <Card key={community.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${community.image} rounded-xl flex-shrink-0`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-800 truncate">{community.name}</h3>
                        <Badge variant="outline">{community.category}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{community.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{community.members} üye</span>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4 text-purple-600" />
                            <span className="text-purple-600 font-medium">{community.moodPercentage}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleJoinCommunity(community.id)}
                          variant={joinedCommunities.includes(community.id) ? "outline" : "default"}
                          size="sm"
                          className={
                            joinedCommunities.includes(community.id)
                              ? "border-purple-300 text-purple-600 hover:bg-purple-50"
                              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                          }
                        >
                          {joinedCommunities.includes(community.id) ? "Ayrıl" : "Katıl"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
