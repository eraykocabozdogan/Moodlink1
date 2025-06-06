"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, TrendingUp, Search, Compass } from "lucide-react"
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
      description: "Yellow and blue hearts meet here! 💛💙",
      members: "45.2K",
      moodPercentage: "92%",
      category: "Sports",
      image: "from-yellow-400 to-blue-600",
    },
    {
      id: "gameofthrones",
      name: "Game of Thrones",
      description: "Winter is coming... The biggest Westeros community ⚔️",
      members: "128K",
      moodPercentage: "78%",
      category: "Entertainment",
      image: "from-gray-700 to-red-600",
    },
    {
      id: "teknoloji",
      name: "Technology Enthusiasts",
      description: "Latest technology news and discussions 🚀",
      members: "67.8K",
      moodPercentage: "85%",
      category: "Technology",
      image: "from-blue-500 to-purple-600",
    },
    {
      id: "muzik",
      name: "Music Lovers",
      description: "Discussions about all types of music and artists 🎵",
      members: "89.3K",
      moodPercentage: "88%",
      category: "Music",
      image: "from-pink-500 to-orange-500",
    },
    {
      id: "yemek",
      name: "Food Culture",
      description: "Delicious recipes and restaurant recommendations 🍽️",
      members: "34.7K",
      moodPercentage: "95%",
      category: "Lifestyle",
      image: "from-green-500 to-yellow-500",
    },
    {
      id: "seyahat",
      name: "Travel Enthusiasts",
      description: "For those who love exploring the world! ✈️",
      members: "52.1K",
      moodPercentage: "91%",
      category: "Travel",
      image: "from-cyan-500 to-blue-500",
    },
  ]

  const communityPosts = [
    {
      id: 1,
      username: "Mehmet",
      handle: "@mehmet_fb",
      time: "2s",
      content: "Championship is ours this season! Forza Fenerbahçe! 💛💙",
      moodCompatibility: "94%",
      community: "Fenerbahçe Fans",
    },
    {
      id: 2,
      username: "Ayşe",
      handle: "@ayse_got",
      time: "5m",
      content: "The new episode of House of Dragon was amazing! I miss Jon Snow 😭",
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
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="w-[120px]"></div> {/* Empty space to balance the left side */}
          <h1 className="text-xl font-bold text-foreground">Community</h1>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Community
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Topluluk ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-muted border-border focus:bg-card focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Create Community Form */}
        {showCreateForm && (
          <Card className="border-primary/20 bg-card">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-3 text-foreground">Yeni Topluluk Oluştur</h3>
              <div className="flex space-x-3">
                <Input
                  type="text"
                  placeholder="Topluluk adı..."
                  value={newCommunityName}
                  onChange={(e) => setNewCommunityName(e.target.value)}
                  className="flex-1 bg-background border-border text-foreground"
                />
                <Button
                  onClick={handleCreateCommunity}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-primary-foreground"
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
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              Katıldığın Topluluklar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {communities
                .filter((community) => joinedCommunities.includes(community.id))
                .map((community) => (
                  <Card key={community.id} className="hover:shadow-lg transition-shadow border-border bg-card">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${community.image} rounded-xl flex-shrink-0`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-foreground truncate">{community.name}</h3>
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              Katıldın
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{community.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{community.members} üye</span>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-primary" />
                              <span className="text-primary font-medium">{community.moodPercentage} Mood</span>
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

        {/* Discover Communities */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center">
            <Compass className="w-5 h-5 mr-2 text-primary" />
            Keşfet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommunities.map((community) => (
              <Card key={community.id} className="hover:shadow-lg transition-shadow border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-20 h-20 bg-gradient-to-r ${community.image} rounded-full mb-3`}></div>
                    <h3 className="font-bold text-foreground mb-1 truncate w-full">{community.name}</h3>
                    <Badge variant="outline" className="border-border text-muted-foreground mb-2">{community.category}</Badge>
                    <p className="text-muted-foreground text-xs mb-3 line-clamp-2 h-8">{community.description}</p>
                    <div className="flex items-center justify-between text-xs w-full mb-3">
                      <span className="text-muted-foreground">{community.members} üye</span>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3 text-primary" />
                        <span className="text-primary font-medium">{community.moodPercentage}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleJoinCommunity(community.id)}
                      variant={joinedCommunities.includes(community.id) ? "secondary" : "default"}
                      className={`w-full ${
                        joinedCommunities.includes(community.id)
                          ? "bg-muted text-muted-foreground hover:bg-muted/80"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-primary-foreground"
                      }`}
                    >
                      {joinedCommunities.includes(community.id) ? "Ayrıl" : "Katıl"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Posts Feed (Optional) */}
        {joinedCommunities.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold text-foreground mb-4">Topluluk Akışı</h2>
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
