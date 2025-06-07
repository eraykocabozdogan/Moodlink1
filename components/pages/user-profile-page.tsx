"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/post-card"
import { ArrowLeft } from "lucide-react"
import apiClient from "@/lib/apiClient"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"

interface User {
  id: string;
  // Add other user properties as needed
}

interface UserProfilePageProps {
  user: User;
  onBack: () => void;
}

export function UserProfilePage({ user, onBack }: UserProfilePageProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  
  const fetchUserPosts = useCallback(async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Unable to load user profile. User information is missing.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await apiClient.get<{ items: any[] }>(`/api/Posts/user/${user.id}`);
      setUserPosts(response.items);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load user posts. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Kullanıcıyı takip edip etmediğimizi kontrol eden fonksiyon
  const checkIfFollowing = useCallback(async () => {
    if (!user?.id || !currentUser?.id) return;
    
    try {
      // Backend'de bir endpoint varsa bunu kullanabiliriz
      // Örnek: /api/Follows/check/{followedUserId}
      // Şimdilik bir endpoint olmadığını varsayarak dummy bir işlem yapıyoruz
      // Gerçek uygulamada burayı güncelleyin
      setIsFollowing(false);
    } catch (error) {
      console.error("Failed to check follow status:", error);
    }
  }, [user?.id, currentUser?.id]);

  // Bileşen yüklendiğinde verileri çek
  useEffect(() => {
    fetchUserPosts();
    checkIfFollowing();
  }, [fetchUserPosts, checkIfFollowing]);

  const handleFollowToggle = async () => {
    if (!currentUser?.id || !user?.id) {
      toast({
        title: "Hata",
        description: "Kullanıcıyı takip etmek için giriş yapmalısınız.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFollowing) {
        // Takibi bırak
        // Gerçek API çağrısı
        // await apiClient.delete(`/api/Follows/{followId}`);
        console.log(`Unfollowing user ${user.id}`);
        
        // Dummy işlem
        setIsFollowing(false);
        toast({
          title: "Başarılı",
          description: `${user.username} kullanıcısını takip etmeyi bıraktınız.`,
        });
      } else {
        // Takip et
        const followData = {
          followerId: currentUser.id,
          followedId: user.id
        };
        
        // Gerçek API çağrısı
        // Endpoint yapısına göre bu değişebilir
        await apiClient.post('/api/Follows', followData);
        console.log(`Following user ${user.id}`, followData);
        
        setIsFollowing(true);
        toast({
          title: "Başarılı",
          description: `${user.username} kullanıcısını takip etmeye başladınız.`,
        });
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      toast({
        title: "Hata",
        description: "Takip işlemi gerçekleştirilemedi. Lütfen daha sonra tekrar deneyin.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Profil</h1>
          <div className="w-10"></div> {/* Sağ tarafı dengelemek için boş alan */}
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-card border-b border-border p-6">
        <div className="text-center space-y-4">
          {/* Profile Picture */}
          <div className="w-24 h-24 mx-auto">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto flex items-center justify-center text-primary-foreground">
                {user.username.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground">{user.username}</h3>
            <p className="text-muted-foreground">@{user.handle}</p>
          </div>
          
          {user.bio && <p className="text-muted-foreground max-w-md mx-auto">{user.bio}</p>}
          
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">{user.followers}</strong> Takipçi
            </span>
            <span>
              <strong className="text-foreground">{user.following}</strong> Takip Edilen
            </span>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-xl">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Mood:</strong>{" "}
              {user.moods && user.moods.length > 0 ? (
                user.moods.map((mood: any, index: number) => (
                  <span key={index}>
                    {mood.name} {mood.percentage}
                    {index < user.moods.length - 1 ? ", " : ""}
                  </span>
                ))
              ) : (
                <span>Henüz mood verisi yok</span>
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong className="text-foreground">Rozetler:</strong>{" "}
              {user.badges && user.badges.length > 0 ? user.badges.join(" ") : "Henüz rozet yok"}
            </p>
          </div>
          
          <div className="flex justify-center space-x-3">
            <Button
              onClick={handleFollowToggle}
              className={isFollowing ? "bg-muted text-foreground border border-border" : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"}
            >
              {isFollowing ? "Takip Ediliyor" : "Takip Et"}
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Mesaj Gönder
            </Button>
          </div>
        </div>
      </div>

      {/* Mood Compatibility */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-foreground">Mood Uyumu</h4>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full">
            <span className="text-sm font-medium">%{Math.floor(Math.random() * 30) + 70}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Bu kullanıcıyla mood uyumunuz yüksek. Benzer etkinliklerden hoşlanıyorsunuz!
        </p>
      </div>

      {/* Posts */}
      <div className="bg-card">
        <div className="p-4 border-b border-border">
          <h4 className="font-bold text-foreground">Gönderiler</h4>
        </div>
        {isLoading ? (
          <div className="p-4">
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : userPosts.length > 0 ? (
          userPosts.map((post) => (
            <PostCard 
              key={post.id} 
              post={{
                ...post,
                username: user.username || user.firstName + " " + user.lastName,
                handle: `@${user.handle || post.userEmail?.split('@')[0]}`,
                time: new Date(post.createdDate).toLocaleString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                }),
                content: post.contentText,
                moodCompatibility: "85%"
              }} 
            />
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            Bu kullanıcı henüz gönderi paylaşmamış.
          </div>
        )}
      </div>
    </div>
  )
}
