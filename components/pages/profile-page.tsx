"use client"

import type React from "react"

import { useState } from "react"
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

  // Varsayılan kullanıcı verilerini güvenli şekilde ayarlayalım
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
  }

  const [user, setUser] = useState({
    ...defaultUser,
    ...initialUser,
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
      setUser({
        ...user,
        username: editForm.username,
        handle: editForm.handle,
        bio: editForm.bio,
      })
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
    })
    setIsEditing(false)
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
          <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>

          {isEditing ? (
            <div className="space-y-4">
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
