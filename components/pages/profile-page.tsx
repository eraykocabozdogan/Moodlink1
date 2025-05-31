"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PostCard } from "@/components/post-card"
import { Check, X, ImagePlus } from "lucide-react"

interface ProfilePageProps {
  user: any
}

export function ProfilePage({ user: initialUser }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)

  const defaultUser = {
    username: "Kullanıcı Adı",
    handle: "kullanici_adi",
    bio: "Merhaba! Ben MoodLink kullanıyorum.",
    followers: "13K",
    following: "32",
    moods: [
      { name: "Energetic", percentage: "62%" },
      { name: "Sad", percentage: "56%" },
    ],
    badges: ["🏅", "🏆"],
    profilePicture: "/placeholder-user.jpg", // Added default profile picture
  }

  const [user, setUser] = useState({
    ...defaultUser,
    ...initialUser,
    moods: initialUser?.moods || defaultUser.moods,
    badges: initialUser?.badges || defaultUser.badges,
    profilePicture: initialUser?.profilePicture || defaultUser.profilePicture, // Initialize profile picture
  })

  const [editForm, setEditForm] = useState({
    username: user.username,
    handle: user.handle,
    bio: user.bio || "Merhaba! Ben MoodLink kullanıyorum.",
    profilePicture: user.profilePicture, // Add profilePicture to editForm
  })

  const [selectedProfilePicture, setSelectedProfilePicture] = useState<string | null>(null) // State for temporary new profile picture

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
      setUser({
        ...user,
        username: editForm.username,
        handle: editForm.handle,
        bio: editForm.bio,
        profilePicture: selectedProfilePicture || user.profilePicture, // Save new or keep old
      })
      setSelectedProfilePicture(null); // Reset temporary image
    } else {
      // When entering edit mode, set the form with current user data
      setEditForm({
        username: user.username,
        handle: user.handle,
        bio: user.bio || "Merhaba! Ben MoodLink kullanıyorum.",
        profilePicture: user.profilePicture,
      });
      setSelectedProfilePicture(null); // Clear any previous selection
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
      profilePicture: user.profilePicture, // Reset profile picture in form
    })
    setSelectedProfilePicture(null); // Clear temporary image
    setIsEditing(false)
  }

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
      event.target.value = ""; // Allow re-selecting the same file
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-800">Profil</h1>
      </div>

      {/* Profile Info */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="text-center space-y-4">
          {/* Profile Picture Display - Conditional based on isEditing */}
          {!isEditing && (
            <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto overflow-hidden">
              <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
            </div>
          )}

          {isEditing ? (
            <div className="space-y-4">
              {/* Profile Picture Editing Section */}
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-purple-500">
                <img 
                  src={selectedProfilePicture || editForm.profilePicture} 
                  alt="Profil Resmi" 
                  className="w-full h-full object-cover"
                />
                <label 
                  htmlFor="profile-picture-upload" 
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                >
                  <ImagePlus className="w-8 h-8 text-white" />
                </label>
                <input 
                  id="profile-picture-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleProfilePictureChange} 
                />
              </div>

              <div>
                <Input
                  name="username"
                  value={editForm.username}
                  onChange={handleInputChange}
                  placeholder="Kullanıcı adı"
                  className="text-center font-bold"
                />
                <Input
                  name="handle"
                  value={editForm.handle}
                  onChange={handleInputChange}
                  placeholder="Kullanıcı kodu"
                  className="text-center text-gray-600 mt-2"
                />
              </div>
              <Textarea
                name="bio"
                value={editForm.bio}
                onChange={handleInputChange}
                placeholder="Biyografi"
                className="min-h-[100px]"
              />
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={handleEditToggle}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Kaydet
                </Button>
                <Button onClick={handleCancelEdit} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  İptal
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{user.username}</h3>
                <p className="text-gray-600">@{user.handle}</p>
              </div>
              {user.bio && <p className="text-gray-700 max-w-md mx-auto">{user.bio}</p>}
              <div className="flex justify-center space-x-6 text-sm">
                <span>
                  <strong>{user.followers}</strong> Takipçi
                </span>
                <span>
                  <strong>{user.following}</strong> Takip Edilen
                </span>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl">
                <p className="text-sm text-gray-700">
                  <strong>Mood:</strong>{" "}
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
                <p className="text-sm text-gray-700 mt-1">
                  <strong>Rozetler:</strong>{" "}
                  {user.badges && user.badges.length > 0 ? user.badges.join(" ") : "Henüz rozet yok"}
                </p>
              </div>
              <Button
                onClick={handleEditToggle}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Profili Düzenle
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="bg-white">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-bold text-gray-800">Gönderilerim</h4>
        </div>
        {userPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
