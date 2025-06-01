"use client"

import type React from "react"

import { useState, useRef } from "react" // Added useRef
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PostCard } from "@/components/post-card"
import { Check, X } from "lucide-react"

interface ProfilePageProps {
  user: any
}

export function ProfilePage({ user: initialUser }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [selectedProfileImageFile, setSelectedProfileImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Varsayılan kullanıcı verilerini güvenli şekilde ayarlayalım
  const defaultUser = {
    username: "Kullanıcı Adı",
    handle: "kullanici_adi",
    bio: "Merhaba! Ben MoodLink kullanıyorum.",
    followers: "13K",
    following: "32",
    profileImageUrl: null as string | null, // Added profileImageUrl
    moods: [
      { name: "Energetic", percentage: "62%" },
      { name: "Sad", percentage: "56%" },
    ],
    badges: ["🏅", "🏆"],
  }

  const [user, setUser] = useState({
    ...defaultUser,
    ...(initialUser || {}), // Handle potential null/undefined initialUser
    profileImageUrl: initialUser?.profileImageUrl || defaultUser.profileImageUrl, // Initialize profileImageUrl
    // Moods array'inin var olduğundan emin olalım
    moods: initialUser?.moods || defaultUser.moods,
    badges: initialUser?.badges || defaultUser.badges,
  })

  const [editForm, setEditForm] = useState({
    username: user.username,
    handle: user.handle,
    bio: user.bio || "Merhaba! Ben MoodLink kullanıyorum.",
  })

  const userPosts = [
    {
      id: 1,
      username: user.username,
      handle: `@${user.handle}`,
      time: "1s",
      content: "Bu benim ilk gönderim!",
      moodCompatibility: "90%",
    },
  ]

  const handleEditToggle = () => {
    if (isEditing) {
      // Kaydet
      let newProfileImageUrl = user.profileImageUrl;
      if (selectedProfileImageFile && profileImagePreview) {
        // Simulate upload
        console.log("Simulating upload of file:", selectedProfileImageFile.name);
        newProfileImageUrl = profileImagePreview; // Use preview as the new URL
      }

      setUser({
        ...user,
        username: editForm.username,
        handle: editForm.handle,
        bio: editForm.bio,
        profileImageUrl: newProfileImageUrl, // Update profile image URL
      });
      setSelectedProfileImageFile(null); // Reset after saving
      setProfileImagePreview(null); // Reset preview
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditForm({
      ...editForm,
      [name]: value,
    })
  }

  const handleCancelEdit = () => {
    setEditForm({
      username: user.username,
      handle: user.handle,
      bio: user.bio || "",
    });
    setProfileImagePreview(null); // Reset preview on cancel
    setSelectedProfileImageFile(null); // Reset file on cancel
    setIsEditing(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-xl font-bold text-foreground">Profil</h1>
      </div>

      {/* Profile Info */}
      <div className="bg-card border-b border-border p-6">
        <div className="text-center space-y-4">
          {/* Profile Picture Area */}
          <div className="w-24 h-24 mx-auto"> {/* Container for sizing */}
            {isEditing ? (
              <>
                <label
                  htmlFor="profileImageInput"
                  className="relative group block w-24 h-24 rounded-full cursor-pointer overflow-hidden"
                >
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Profil Resmi Önizleme"
                      className="w-full h-full object-cover"
                    />
                  ) : user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl as string}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-primary-foreground">
                      <span className="text-xs">Resim Seç</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-opacity">
                    <span className="text-white text-sm opacity-0 group-hover:opacity-100">Değiştir</span>
                  </div>
                </label>
                <input
                  type="file"
                  id="profileImageInput"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            ) : user.profileImageUrl ? (
              <img
                src={user.profileImageUrl as string}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto flex items-center justify-center text-primary-foreground">
                {/* Optional: Add an icon or initials if no image */}
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4 mt-4"> {/* Added mt-4 for spacing */}
              <div>
                <Input
                  name="username"
                  value={editForm.username}
                  onChange={handleInputChange}
                  placeholder="Kullanıcı adı"
                  className="text-center font-bold bg-background border-border text-foreground"
                />
                <Input
                  name="handle"
                  value={editForm.handle}
                  onChange={handleInputChange}
                  placeholder="Kullanıcı kodu"
                  className="text-center text-muted-foreground mt-2 bg-background border-border"
                />
              </div>
              <Textarea
                name="bio"
                value={editForm.bio}
                onChange={handleInputChange}
                placeholder="Biyografi"
                className="min-h-[100px] bg-background border-border text-foreground"
              />
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={handleEditToggle}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-primary-foreground"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Kaydet
                </Button>
                <Button onClick={handleCancelEdit} variant="outline" className="border-border text-foreground hover:bg-muted">
                  <X className="w-4 h-4 mr-2" />
                  İptal
                </Button>
              </div>
            </div>
          ) : (
            <>
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
              <Button
                onClick={handleEditToggle}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-primary-foreground"
              >
                Profili Düzenle
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="bg-card">
        <div className="p-4 border-b border-border">
          <h4 className="font-bold text-foreground">Gönderilerim</h4>
        </div>
        {userPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
