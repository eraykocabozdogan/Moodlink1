"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Users, TrendingUp, Search, Compass, Loader2, MessageSquare } from "lucide-react"
import { PostCard } from "@/components/post-card"
import apiClient from "@/lib/apiClient"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"

// Backend'den gelen topluluk verisinin tipini tanımlayalım
interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  moodPercentage: number;
  category: string;
  // Backend'de henüz bu alan yoksa, rastgele gradient renkler atayabiliriz
  image?: string;
}

// Topluluk gönderisi için arayüz
interface CommunityPost {
  id: string;
  userId: string;
  username?: string;
  handle?: string;
  contentText: string;
  time?: string;
  moodCompatibility?: string;
  communityId: string;
  communityName?: string;
}

// Renk gradientleri için yardımcı fonksiyon
const getRandomGradient = () => {
  const gradients = [
    "from-yellow-400 to-blue-600",
    "from-gray-700 to-red-600",
    "from-blue-500 to-purple-600",
    "from-pink-500 to-orange-500",
    "from-green-500 to-yellow-500",
    "from-cyan-500 to-blue-500",
    "from-purple-500 to-pink-500",
    "from-red-500 to-yellow-500"
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

export function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [communities, setCommunities] = useState<Community[]>([])
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([])
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCommunityName, setNewCommunityName] = useState("")
  const [newCommunityDescription, setNewCommunityDescription] = useState("")
  const [newCommunityCategory, setNewCommunityCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  // Toplulukları çeken fonksiyon
  const fetchCommunities = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Not: Bu endpoint backend'de oluşturulmalıdır
      const response = await apiClient.get<{ items: Community[] }>('/api/Communities')
      
      // Backend'den gelen verilere rastgele gradient ekleyelim (eğer backend'de yoksa)
      const communitiesWithGradients = response.items.map(community => ({
        ...community,
        image: community.image || getRandomGradient()
      }))
      
      setCommunities(communitiesWithGradients)
    } catch (err) {
      console.error('Topluluklar yüklenirken hata:', err)
      setError("Topluluklar yüklenirken bir hata oluştu.")
      // Geçici olarak statik veriler kullanabiliriz
      setCommunities([
        {
          id: "fenerbahce",
          name: "Fenerbahçe Fans",
          description: "Yellow and blue hearts meet here! 💛💙",
          memberCount: 45200,
          moodPercentage: 92,
          category: "Sports",
          image: "from-yellow-400 to-blue-600",
        },
        {
          id: "gameofthrones",
          name: "Game of Thrones",
          description: "Winter is coming... The biggest Westeros community ⚔️",
          memberCount: 128000,
          moodPercentage: 78,
          category: "Entertainment",
          image: "from-gray-700 to-red-600",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Kullanıcının katıldığı toplulukları çeken fonksiyon
  const fetchJoinedCommunities = useCallback(async () => {
    if (!user?.id) return
    
    try {
      // Not: Bu endpoint backend'de oluşturulmalıdır
      const response = await apiClient.get<{ communityIds: string[] }>(`/api/Communities/user/${user.id}/joined`)
      setJoinedCommunities(response.communityIds)
    } catch (err) {
      console.error('Katılınan topluluklar yüklenirken hata:', err)
      // Hata durumunda boş dizi veya varsayılan değer kullanabiliriz
      setJoinedCommunities([])
    }
  }, [user?.id])

  // Topluluk gönderilerini çeken fonksiyon
  const fetchCommunityPosts = useCallback(async () => {
    if (joinedCommunities.length === 0) {
      setCommunityPosts([])
      return
    }
    
    try {
      // Not: Bu endpoint backend'de oluşturulmalıdır
      const response = await apiClient.get<{ items: CommunityPost[] }>('/api/Communities/posts', {
        communityIds: joinedCommunities.join(',') 
      })
      setCommunityPosts(response.items)
    } catch (err) {
      console.error('Topluluk gönderileri yüklenirken hata:', err)
      // Hata durumunda boş dizi veya örnek veriler kullanabiliriz
      setCommunityPosts([
        {
          id: "1",
          userId: "user1",
          username: "Mehmet",
          handle: "@mehmet_fb",
          contentText: "Championship is ours this season! Forza Fenerbahçe! 💛💙",
          time: "2s",
          moodCompatibility: "94%",
          communityId: "fenerbahce",
          communityName: "Fenerbahçe Fans"
        }
      ])
    }
  }, [joinedCommunities])

  // Topluluğa katılma/ayrılma işlemi
  const handleJoinCommunity = async (communityId: string) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Topluluğa katılmak için giriş yapmalısınız.",
      })
      return
    }
    
    setIsJoining(true)
    try {
      if (joinedCommunities.includes(communityId)) {
        // Topluluktan ayrılma
        // Not: Bu endpoint backend'de oluşturulmalıdır
        await apiClient.delete(`/api/Communities/${communityId}/members/${user.id}`)
        setJoinedCommunities(joinedCommunities.filter(id => id !== communityId))
        toast({
          title: "Başarılı",
          description: "Topluluktan ayrıldınız.",
        })
      } else {
        // Topluluğa katılma
        // Not: Bu endpoint backend'de oluşturulmalıdır
        await apiClient.post(`/api/Communities/${communityId}/members`, {
          userId: user.id
        })
        setJoinedCommunities([...joinedCommunities, communityId])
        toast({
          title: "Başarılı",
          description: "Topluluğa katıldınız.",
        })
      }
    } catch (err) {
      console.error('Topluluğa katılma/ayrılma hatası:', err)
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "İşlem sırasında bir hata oluştu.",
      })
    } finally {
      setIsJoining(false)
    }
  }

  // Topluluk oluşturma işlemi
  const handleCreateCommunity = async () => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Topluluk oluşturmak için giriş yapmalısınız.",
      })
      return
    }
    
    if (!newCommunityName.trim()) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Topluluk adı boş olamaz.",
      })
      return
    }
    
    setIsCreating(true)
    try {
      // Not: Bu endpoint backend'de oluşturulmalıdır
      const response = await apiClient.post<{ id: string }>('/api/Communities', {
        name: newCommunityName.trim(),
        description: newCommunityDescription.trim() || `${newCommunityName} topluluğuna hoş geldiniz!`,
        category: newCommunityCategory.trim() || "Genel",
        creatorUserId: user.id
      })
      
      // Yeni oluşturulan topluluğu listeye ekle ve katılınan topluluklara ekle
      const newCommunity: Community = {
        id: response.id,
        name: newCommunityName.trim(),
        description: newCommunityDescription.trim() || `${newCommunityName} topluluğuna hoş geldiniz!`,
        memberCount: 1, // Sadece oluşturan kişi
        moodPercentage: 100, // Başlangıç değeri
        category: newCommunityCategory.trim() || "Genel",
        image: getRandomGradient()
      }
      
      setCommunities([newCommunity, ...communities])
      setJoinedCommunities([response.id, ...joinedCommunities])
      
      // Formu temizle ve kapat
      setNewCommunityName("")
      setNewCommunityDescription("")
      setNewCommunityCategory("")
      setShowCreateForm(false)
      
      toast({
        title: "Başarılı",
        description: "Topluluk başarıyla oluşturuldu.",
      })
    } catch (err) {
      console.error('Topluluk oluşturma hatası:', err)
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Topluluk oluşturulurken bir hata oluştu.",
      })
    } finally {
      setIsCreating(false)
    }
  }

  // Sayfa yüklendiğinde toplulukları ve kullanıcının katıldığı toplulukları çek
  useEffect(() => {
    fetchCommunities()
    if (user?.id) {
      fetchJoinedCommunities()
    }
  }, [fetchCommunities, fetchJoinedCommunities, user?.id])

  // Katılınan topluluklar değiştiğinde topluluk gönderilerini çek
  useEffect(() => {
    if (joinedCommunities.length > 0) {
      fetchCommunityPosts()
    }
  }, [joinedCommunities, fetchCommunityPosts])

  const filteredCommunities = communities.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col space-y-6">
        {/* Search and Create Community */}
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Topluluk ara..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            disabled={!user}
          >
            <Plus className="mr-2 h-4 w-4" /> Topluluk Oluştur
          </Button>
        </div>

        {/* Create Community Form */}
        {showCreateForm && (
          <Card className="p-4 border border-blue-200 bg-blue-50">
            <CardHeader className="p-2">
              <CardTitle className="text-xl">Yeni Topluluk Oluştur</CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="community-name">Topluluk Adı</Label>
                <Input
                  id="community-name"
                  value={newCommunityName}
                  onChange={(e) => setNewCommunityName(e.target.value)}
                  placeholder="Topluluğunuzun adını girin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="community-description">Açıklama</Label>
                <Input
                  id="community-description"
                  value={newCommunityDescription}
                  onChange={(e) => setNewCommunityDescription(e.target.value)}
                  placeholder="Topluluğunuzu kısaca tanımlayın"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="community-category">Kategori</Label>
                <Input
                  id="community-category"
                  value={newCommunityCategory}
                  onChange={(e) => setNewCommunityCategory(e.target.value)}
                  placeholder="Örn: Spor, Müzik, Teknoloji"
                />
              </div>
            </CardContent>
            <CardFooter className="p-2 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                İptal
              </Button>
              <Button 
                onClick={handleCreateCommunity} 
                disabled={isCreating || !newCommunityName.trim()}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  "Oluştur"
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Topluluklar yükleniyor...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-md">
            <p className="text-red-600">{error}</p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => fetchCommunities()}
            >
              Yeniden Dene
            </Button>
          </div>
        )}

        {/* Joined Communities */}
        {!isLoading && !error && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Katıldığın Topluluklar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {communities
                .filter((community) => joinedCommunities.includes(community.id))
                .map((community) => (
                  <Card key={community.id} className="overflow-hidden">
                    <div
                      className={`h-24 bg-gradient-to-r ${community.image} flex items-center justify-center`}
                    >
                      <h3 className="text-2xl font-bold text-white drop-shadow-md">
                        {community.name.split(" ")[0]}
                      </h3>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{community.name}</h3>
                        <Badge variant="outline" className="ml-2">
                          {community.category}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">{community.description}</p>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{community.memberCount.toLocaleString()} üye</span>
                        <span>Mood: %{community.moodPercentage}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-end">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleJoinCommunity(community.id)}
                        disabled={isJoining || !user}
                      >
                        {isJoining ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            İşleniyor...
                          </>
                        ) : (
                          "Ayrıl"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>

            {joinedCommunities.length === 0 && (
              <div className="text-center p-8 border rounded-lg bg-muted/10">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Henüz bir topluluğa katılmadın</h3>
                <p className="text-muted-foreground mb-4">
                  İlgi alanlarına göre topluluklara katılarak benzer düşünen kişilerle bağlantı kur
                </p>
              </div>
            )}
          </div>
        )}

        {/* Discover Communities */}
        {!isLoading && !error && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Keşfet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCommunities
                .filter((community) => !joinedCommunities.includes(community.id))
                .map((community) => (
                  <Card key={community.id} className="overflow-hidden">
                    <div
                      className={`h-24 bg-gradient-to-r ${community.image} flex items-center justify-center`}
                    >
                      <h3 className="text-2xl font-bold text-white drop-shadow-md">
                        {community.name.split(" ")[0]}
                      </h3>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{community.name}</h3>
                        <Badge variant="outline" className="ml-2">
                          {community.category}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">{community.description}</p>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{community.memberCount.toLocaleString()} üye</span>
                        <span>Mood: %{community.moodPercentage}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-end">
                      <Button
                        className="w-full"
                        onClick={() => handleJoinCommunity(community.id)}
                        disabled={isJoining || !user}
                      >
                        {isJoining ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            İşleniyor...
                          </>
                        ) : (
                          "Katıl"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>

            {filteredCommunities.filter((community) => !joinedCommunities.includes(community.id))
              .length === 0 && (
              <div className="text-center p-8 border rounded-lg bg-muted/10">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Topluluk bulunamadı</h3>
                <p className="text-muted-foreground">
                  Arama kriterlerine uygun topluluk bulunamadı veya tüm topluluklara zaten katıldın
                </p>
              </div>
            )}
          </div>
        )}

        {/* Community Posts (Optional) */}
        {!isLoading && !error && joinedCommunities.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Topluluk Gönderileri</h2>
            {communityPosts.length > 0 ? (
              <div className="space-y-4">
                {communityPosts.map((post) => (
                  <Card key={post.id} className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>{post.username?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{post.username || "Kullanıcı"}</span>
                          <span className="text-muted-foreground text-sm">{post.handle || "@kullanıcı"}</span>
                          <span className="text-muted-foreground text-sm">· {post.time || "şimdi"}</span>
                        </div>
                        <Badge variant="outline" className="mt-1 mb-2">
                          {post.communityName || "Topluluk"}
                        </Badge>
                        <p className="mt-1">{post.contentText}</p>
                        {post.moodCompatibility && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            <span>Mood Uyumluluğu: {post.moodCompatibility}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border rounded-lg bg-muted/10">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Henüz gönderi yok</h3>
                <p className="text-muted-foreground">
                  Katıldığın topluluklarda henüz gönderi paylaşılmamış
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
