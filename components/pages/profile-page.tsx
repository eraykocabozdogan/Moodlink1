"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PostCard } from "@/components/post-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Check, X } from "lucide-react"
import apiClient from "@/lib/apiClient"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"

// Backend'den gelen User ve Post tiplerini tanımlayalım
interface UserProfile {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  profileImageUrl?: string | null;
  // Bu alanları API'den alıyorsak ekleyelim, almıyorsak varsayılan değerler kullanırız.
  followers?: string; 
  following?: string;
  moods?: { name: string; percentage: string }[];
  badges?: string[];
}

interface Post {
    id: string;
    userId: string;
    contentText: string;
    createdDate: string;
    userFirstName: string;
    userLastName: string;
    userEmail: string;
    // PostCard'ın beklediği ek alanlar için geçici eklemeler
    handle?: string;
    time?: string;
    moodCompatibility?: string;
}

// UserProfilePage'in prop'larını basitleştirebiliriz, çünkü artık kendi verisini kendi çekecek.
interface ProfilePageProps {}

export function ProfilePage({}: ProfilePageProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ username: "", handle: "", bio: "" })
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [selectedProfileImageFile, setSelectedProfileImageFile] = useState<File | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user: authUser } = useAuth() // Get authenticated user from context

  // Veri çekme işlemini useCallback ile sarmala
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Kullanıcı ve post verilerini paralel olarak çek
      // Artık kimlik doğrulaması yapılmış kullanıcı verilerini AuthContext'ten alıyoruz
      // Yine de API'den en güncel kullanıcı bilgilerini çekiyoruz
      const userPromise = apiClient.get<UserProfile>('/api/Users/GetFromAuth')
      // Kullanıcının kendi postlarını getiren endpoint
      const postsPromise = apiClient.get<{ items: Post[] }>('/api/Posts')

      const [userData, postsData] = await Promise.all([userPromise, postsPromise])
      
      // AuthContext'teki kullanıcı ID'sine göre filtreleme yapıyoruz
      const userPosts = postsData.items.filter(p => p.userId === authUser?.id);

      setUser(userData)
      setPosts(userPosts)
      
      // Düzenleme formu için başlangıç değerlerini ayarla
      setEditForm({
        username: userData.userName,
        handle: `@${userData.userName}`, // handle için geçici çözüm
        bio: userData.bio || "Hello! I'm using MoodLink.",
      })

    } catch (error) {
      console.error("Failed to fetch profile data:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Profil verileri yüklenirken bir sorun oluştu.",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, authUser])

  // Bileşen yüklendiğinde verileri çek
  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleProfileUpdate = async () => {
    if (!user || !authUser) return;
    setIsLoading(true);

    try {
        // TODO: Resim yükleme mantığı.
        // Önce /api/FileAttachments'a resmi gönderip bir ID almanız,
        // sonra bu ID'yi aşağıdaki güncelleme verisine eklemeniz gerekir.
        // const fileId = await uploadProfilePicture(selectedProfileImageFile);

        const updateData = {
            id: authUser.id, // Use authenticated user ID
            userName: editForm.username,
            firstName: user.firstName, // Bu alanlar düzenlenmiyorsa mevcut veriyi gönder
            lastName: user.lastName,
            bio: editForm.bio,
            // profileImageFileId: fileId || user.profileImageFileId
        };

        await apiClient.put('/api/Users/FromAuth', updateData);

        // Başarılı güncelleme sonrası local state'i ve UI'ı güncelle
        setUser(prevUser => prevUser ? { ...prevUser, ...updateData, userName: editForm.username } : null);
        setIsEditing(false);
        setProfileImagePreview(null);
        setSelectedProfileImageFile(null);
        toast({ title: "Başarılı", description: "Profiliniz güncellendi." });

    } catch (error) {
        console.error("Failed to update profile:", error);
        toast({
            variant: "destructive",
            title: "Hata",
            description: "Profil güncellenirken bir sorun oluştu.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      handleProfileUpdate();
    } else {
      setIsEditing(true);
    }
  }
  
  const handleCancelEdit = () => {
    if(user) {
        setEditForm({
            username: user.userName,
            handle: `@${user.userName}`,
            bio: user.bio || "",
        });
    }
    setProfileImagePreview(null);
    setSelectedProfileImageFile(null);
    setIsEditing(false);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  if (isLoading && !user) {
    return (
        <div className="max-w-2xl mx-auto p-6 space-y-4">
            <div className="text-center space-y-4">
                <Skeleton className="w-24 h-24 rounded-full mx-auto" />
                <Skeleton className="h-6 w-48 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
                <Skeleton className="h-10 w-40 mx-auto" />
            </div>
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
    )
  }

  if (!user) {
    return <div className="text-center p-4">Kullanıcı bulunamadı.</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-foreground">Profil</h1>
        </div>
      </div>
      <div className="bg-card border-b border-border p-6">
        <div className="text-center space-y-4">
        <div className="w-24 h-24 mx-auto">
            {isEditing ? (
              <label htmlFor="profileImageInput" className="relative group block w-24 h-24 rounded-full cursor-pointer overflow-hidden">
                <img
                    src={profileImagePreview || user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
                    alt="Profil"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-opacity">
                    <span className="text-white text-sm opacity-0 group-hover:opacity-100">Değiştir</span>
                </div>
              </label>
            ) : (
                <img
                    src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
                    alt={user.userName}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                />
            )}
            <input type="file" id="profileImageInput" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          {isEditing ? (
            <div className="space-y-4 mt-4">
              <Input name="username" value={editForm.username} onChange={handleInputChange} placeholder="Kullanıcı Adı" className="text-center font-bold bg-background"/>
              <Textarea name="bio" value={editForm.bio} onChange={handleInputChange} placeholder="Bio" className="min-h-[100px] bg-background"/>
              <div className="flex justify-center space-x-3">
                <Button onClick={handleProfileUpdate} disabled={isLoading} className="bg-green-500 hover:bg-green-600 text-white">
                  <Check className="w-4 h-4 mr-2" /> {isLoading ? "Kaydediliyor..." : "Kaydet"}
                </Button>
                <Button onClick={handleCancelEdit} variant="outline">
                  <X className="w-4 h-4 mr-2" /> İptal
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-xl font-bold text-foreground">{user.userName}</h3>
                <p className="text-muted-foreground">@{user.email.split('@')[0]}</p>
              </div>
              <p className="text-muted-foreground max-w-md mx-auto">{user.bio}</p>
              <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
                <span><strong className="text-foreground">0</strong> Followers</span>
                <span><strong className="text-foreground">0</strong> Following</span>
              </div>
              <Button onClick={handleEditToggle} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Profili Düzenle
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="bg-card">
        <div className="p-4 border-b border-border">
          <h4 className="font-bold text-foreground">Gönderilerim</h4>
        </div>
        {posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={{...post, handle: `@${user.userName}`}} />)
        ) : (
            !isLoading && <p className="p-4 text-center text-muted-foreground">Henüz hiç gönderi paylaşmadınız.</p>
        )}
      </div>
    </div>
  )
}