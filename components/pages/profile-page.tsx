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

// ProfilePage'in prop'larını güncelleyelim
interface ProfilePageProps {
  user?: any; // Opsiyonel olarak dışarıdan bir kullanıcı nesnesi alabilir
}

export function ProfilePage({ user: externalUser }: ProfilePageProps) {
  // Auth context'ten kullanıcı bilgilerini al
  const { user: authUser, updateUser: updateAuthUser } = useAuth()
  
  // Dışarıdan gelen kullanıcı veya auth context'ten gelen kullanıcıyı kullan
  const currentUser = externalUser || authUser
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ username: "", handle: "", bio: "" })
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [selectedProfileImageFile, setSelectedProfileImageFile] = useState<File | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Profil verilerini çeken fonksiyon
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Kullanıcı profil bilgilerini çek
      let userData: UserProfile
      
      console.log('Fetching profile data, current user:', currentUser);
      
      if (currentUser && currentUser.id) {
        // Eğer currentUser zaten tam bir kullanıcı nesnesi ise, onu kullan
        console.log('Using existing user data from auth context:', currentUser);
        userData = {
          id: currentUser.id,
          userName: currentUser.userName || '',
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          email: currentUser.email || '',
          bio: currentUser.bio || '',
          profileImageUrl: currentUser.profileImageUrl || null
        };
      } else {
        // Değilse API'den çek
        console.log('Fetching user data from API');
        try {
          userData = await apiClient.get<UserProfile>('/api/Users/GetFromAuth');
          console.log('Successfully fetched user data from API:', userData);
        } catch (apiError) {
          console.error('Error fetching user from API:', apiError);
          toast({
            variant: "destructive",
            title: "Kullanıcı Bilgileri Alınamadı",
            description: "Kullanıcı bilgileriniz yüklenemedi. Lütfen tekrar giriş yapın.",
          });
          throw apiError;
        }
      }
      
      // Kullanıcının postlarını doğrudan kullanıcıya özel endpoint'ten çek
      try {
        console.log(`Fetching posts for user ${userData.id}`);
        const postsEndpoint = `/api/Posts/user/${userData.id}`;
        console.log(`Making request to endpoint: ${postsEndpoint}`);
        
        const postsData = await apiClient.get<{ items: Post[] }>(postsEndpoint);
        
        // Add additional verification to avoid undefined errors
        if (!postsData) {
          console.warn('Posts data is undefined or null');
          setPosts([]);
        } else if (!postsData.items) {
          console.warn('Posts items array is undefined or null');
          setPosts([]);
        } else {
          console.log(`Successfully fetched ${postsData.items.length} posts`);
          setPosts(postsData.items);
        }
      } catch (postsError) {
        console.error('Error fetching posts:', postsError);
        // Log additional details if available
        if (postsError instanceof Error && (postsError as any).details) {
          console.error('Detailed error info:', (postsError as any).details);
        }
        
        toast({
          variant: "destructive",
          title: "Gönderiler Alınamadı",
          description: "Kullanıcı gönderileri yüklenemedi. Sunucu yanıt vermiyor olabilir.",
        });
        // Don't throw here, we still want to show the profile
        setPosts([]);
      }

      setUserProfile(userData);
      
      // Düzenleme formu için başlangıç değerlerini ayarla
      setEditForm({
        username: userData.userName || '',
        handle: `@${userData.userName || ''}`, // handle için geçici çözüm
        bio: userData.bio || "Hello! I'm using MoodLink.",
      });

    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Profil verileri yüklenirken bir sorun oluştu.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, toast]);

  // Bileşen yüklendiğinde verileri çek
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Profil resmini yükleyen fonksiyon
  const uploadProfilePicture = async (file: File | null): Promise<string | null> => {
    if (!file) return null;
    
    try {
      // FileAttachments API'sine dosyayı yükle
      const response = await apiClient.uploadFile<{id: string}>('/api/FileAttachments', file, {
        // StorageType: 1 = Local, 2 = Azure, 3 = AWS
        StorageType: 1,
        // OwnerType: 0 = User, 1 = Post, 2 = Activity, 3 = Comment, 5 = Message, 6 = Group
        OwnerType: 0,
        // FileType: 1 = Image, 2 = Video, 3 = Audio, 4 = Document
        FileType: 1,
        OwnerId: userProfile?.id
      });
      
      return response.id;
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Profil resmi yüklenirken bir sorun oluştu.",
      });
      return null;
    }
  };

  const handleProfileUpdate = async () => {
    if (!userProfile) return;
    setIsLoading(true);

    try {
        // Eğer yeni bir profil resmi seçildiyse, önce onu yükle
        let profileImageFileId = null;
        if (selectedProfileImageFile) {
          profileImageFileId = await uploadProfilePicture(selectedProfileImageFile);
        }

        const updateData = {
            id: userProfile.id,
            userName: editForm.username,
            firstName: userProfile.firstName, // Bu alanlar düzenlenmiyorsa mevcut veriyi gönder
            lastName: userProfile.lastName,
            bio: editForm.bio,
            profileImageFileId: profileImageFileId // Eğer yeni resim yüklendiyse, onun ID'sini kullan
        };

        await apiClient.put('/api/Users/FromAuth', updateData);

        // Başarılı güncelleme sonrası local state'i ve UI'ı güncelle
        // Profil resmi URL'sini güncellemek için yeniden veri çekme işlemi yapılabilir
        // veya backend'den dönen yanıtta profil resmi URL'si varsa doğrudan güncellenebilir
        await fetchData(); // Profil verilerini yeniden çek
        
        // Auth context'i de güncelle
        if (updateAuthUser && userProfile) {
          updateAuthUser({...userProfile, userName: editForm.username, bio: editForm.bio});  
        }
        
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
    if(userProfile) {
        setEditForm({
            username: userProfile.userName,
            handle: `@${userProfile.userName}`,
            bio: userProfile.bio || "",
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

  if (isLoading && !userProfile) {
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

  if (!userProfile) {
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
                    src={profileImagePreview || userProfile.profileImageUrl || `https://ui-avatars.com/api/?name=${userProfile.firstName}+${userProfile.lastName}&background=random`}
                    alt="Profil"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-opacity">
                    <span className="text-white text-sm opacity-0 group-hover:opacity-100">Değiştir</span>
                </div>
              </label>
            ) : (
                <img
                    src={userProfile.profileImageUrl || `https://ui-avatars.com/api/?name=${userProfile.firstName}+${userProfile.lastName}&background=random`}
                    alt={userProfile.userName}
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
                <h3 className="text-xl font-bold text-foreground">{userProfile.userName}</h3>
                <p className="text-muted-foreground">@{userProfile.email.split('@')[0]}</p>
              </div>
              <p className="text-muted-foreground max-w-md mx-auto">{userProfile.bio}</p>
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
            posts.map(post => <PostCard key={post.id} post={{...post, handle: `@${userProfile.userName}`}} />)
        ) : (
            !isLoading && <p className="p-4 text-center text-muted-foreground">Henüz hiç gönderi paylaşmadınız.</p>
        )}
      </div>
    </div>
  )
}