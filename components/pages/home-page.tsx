"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PostCard } from "@/components/post-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ImagePlus } from 'lucide-react'
import useEmblaCarousel from 'embla-carousel-react'
import apiClient from "@/lib/apiClient"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"

// Backend'den gelen post verisinin tipini tanımlayalım
// Bu, swagger.json'daki GetListPostListItemDto'ya dayanmaktadır.
interface Post {
  id: string; // UUID'ler string olarak gelir
  userId: string;
  contentText: string;
  postImageFileId?: string | null;
  createdDate: string; // Veya Date
  userFirstName: string;
  userLastName: string;
  userEmail: string; // Bu alanlar swagger'a göre olmayabilir, gerekirse eklenir veya çıkarılır
  // Statik verilerdeki bu alanları da ekleyebiliriz, ancak API'dan gelip gelmediğine bağlı
  handle?: string;
  time?: string;
  moodCompatibility?: string;
}

interface HomePageProps {
  onUserClick?: (user: any) => void;
}

export function HomePage({ onUserClick }: HomePageProps = {}) {
  const [activeTab, setActiveTab] = useState("forYou")
  const [postContent, setPostContent] = useState("")
  
  // Post state'ini başlangıçta boş bir dizi olarak ayarlıyoruz.
  const [posts, setPosts] = useState<Post[]>([])
  const [followingPosts, setFollowingPosts] = useState<Post[]>([])

  // Yükleme ve hata durumları için state'ler
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const { toast } = useToast()

  // Tüm gönderileri çeken fonksiyon
  const fetchAllPosts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<{ items: Post[] }>('/api/Posts')
      setPosts(response.items)
    } catch (err) {
      setError("Gönderiler yüklenirken bir hata oluştu.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [user])
  
  // Takip edilen kullanıcıların gönderilerini çeken fonksiyon
  const fetchFollowingPosts = useCallback(async () => {
    if (!user) return
    
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<{ items: Post[] }>(`/api/Posts/followed-users/${user.id}`)
      setFollowingPosts(response.items)
    } catch (err) {
      setError("Takip edilen kullanıcıların gönderileri yüklenirken bir hata oluştu.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Sayfa yüklendiğinde ve sekme değiştiğinde ilgili postları çek
  useEffect(() => {
    if (activeTab === 'forYou') {
      fetchAllPosts()
    } else if (activeTab === 'following' && user) {
      fetchFollowingPosts()
    }
  }, [activeTab, fetchAllPosts, fetchFollowingPosts, user])

  // Auth context'ten kullanıcı bilgilerini al
  const { user } = useAuth()

  // Gönderi resmini yükleyen fonksiyon
  const uploadPostImage = async (dataUrl: string | null): Promise<string | null> => {
    if (!dataUrl || !user) return null;
    
    try {
      // Base64 formatındaki dataUrl'i File nesnesine dönüştür
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], "post-image.jpg", { type: "image/jpeg" });
      
      // FileAttachments API'sine dosyayı yükle
      const uploadResponse = await apiClient.uploadFile<{id: string}>('/api/FileAttachments', file, {
        // StorageType: 1 = Local, 2 = Azure, 3 = AWS
        StorageType: 1,
        // OwnerType: 1 = Post
        OwnerType: 1,
        // FileType: 1 = Image
        FileType: 1,
        OwnerId: user.id
      });
      
      return uploadResponse.id;
    } catch (error) {
      console.error("Failed to upload post image:", error);
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Gönderi resmi yüklenirken bir sorun oluştu.",
      });
      return null;
    }
  };

  // Yeni post gönderme fonksiyonu
  const handlePostSubmit = async () => {
    if (!postContent.trim() && !selectedImage) return
    
    // Kullanıcı giriş yapmamışsa işlemi durdur
    if (!user) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Gönderi paylaşmak için giriş yapmalısınız.",
      })
      return
    }

    try {
      // Eğer resim seçildiyse, önce onu yükle
      let postImageFileId = null;
      if (selectedImage) {
        postImageFileId = await uploadPostImage(selectedImage);
      }
      
      // Swagger'a göre `CreatePostCommand` `userId`, `contentText` ve opsiyonel `postImageFileId` bekliyor.
      const newPostData = {
        // Auth context'ten gelen kullanıcı ID'sini kullan
        userId: user.id,
        contentText: postContent,
        postImageFileId: postImageFileId
      }

      await apiClient.post('/api/Posts', newPostData)
      
      setPostContent("")
      setSelectedImage(null)
      toast({ title: "Başarılı!", description: "Gönderiniz paylaşıldı." })

      // Yeni post gönderildikten sonra aktif sekmeye göre listeyi yenile
      if (activeTab === 'forYou') {
        fetchAllPosts()
      } else if (activeTab === 'following') {
        fetchFollowingPosts()
      }

    } catch (err) {
      toast({
        variant: "destructive",
        title: "Hata!",
        description: "Gönderi paylaşılamadı. Lütfen tekrar deneyin.",
      })
      console.error(err)
    }
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handlePostSubmit()
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      event.target.value = ""
    }
  }
  
  const renderContent = () => {
    if (isLoading) {
      // Yüklenirken gösterilecek iskelet (skeleton) bileşenleri
      return (
        <div className="space-y-4 p-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )
    }

    if (error) {
      return <div className="p-4 text-center text-red-500">{error}</div>
    }

    const currentPosts = activeTab === 'forYou' ? posts : followingPosts;

    return currentPosts.map((post) => (
      <PostCard 
          key={post.id} 
          post={{...post, handle: `@${post.userEmail?.split('@')[0]}`}} // handle ve diğer eksik alanlar için geçici çözüm
          onUserClick={onUserClick} 
      />
    ));
  };


  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-foreground">Home</h1>
        </div>
      </div>

      {/* Create Post */}
      <div className="border-b border-border p-4 bg-card">
        <div className="flex space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <Textarea
              placeholder="What's happening?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              onKeyDown={handleKeyPress}
              className="border-none resize-none text-xl placeholder-muted-foreground focus:ring-0 min-h-[80px] bg-transparent text-foreground"
              rows={3}
              maxLength={280}
            />
            {selectedImage && (
              <div className="mt-2 relative">
                <img src={selectedImage} alt="Preview" className="rounded-lg max-h-40 object-contain" />
                <Button variant="ghost" size="sm" onClick={() => setSelectedImage(null)} className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full h-6 w-6 p-0">
                  <X size={16} />
                </Button>
              </div>
            )}
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center space-x-2">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImagePlus className="text-primary hover:text-primary/90" size={24} />
                </label>
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <span className="text-sm text-muted-foreground">
                  {postContent.length}/280
                </span>
              </div>
              <div className="flex space-x-2 items-center">
                <span className="text-xs text-muted-foreground">Press Ctrl+Enter to send</span>
                <Button
                  onClick={handlePostSubmit}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-primary-foreground px-6"
                  disabled={(!postContent.trim() && !selectedImage) || postContent.length > 280}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Tabs */}
      <div className="flex border-b border-border bg-card">
        <button
          onClick={() => setActiveTab("forYou")}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            activeTab === "forYou"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          For You
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            activeTab === "following"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Following
        </button>
      </div>

      {/* Render Content based on state */}
      <div className="bg-background">
        {renderContent()}
      </div>
    </div>
  )
}