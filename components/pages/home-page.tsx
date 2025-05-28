"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PostCard } from "@/components/post-card"

export function HomePage() {
  const [activeTab, setActiveTab] = useState("forYou")
  const [postContent, setPostContent] = useState("")
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: "Doğan",
      handle: "@dogansengul",
      time: "6s",
      content: "Hello Madritistas",
      moodCompatibility: "75%",
    },
    {
      id: 2,
      username: "Eray",
      handle: "@eraykocabozdogan",
      time: "2dk",
      content: "Çankırı çok güzel",
      image: "/placeholder.svg?height=200&width=400",
      moodCompatibility: "88%",
    },
  ])

  const [followingPosts, setFollowingPosts] = useState([
    {
      id: 3,
      username: "TakipEdilen1",
      handle: "@tkp1",
      time: "10dk",
      content: "Yeni gönderim!",
      moodCompatibility: "60%",
    },
  ])

  const handlePostSubmit = () => {
    if (postContent.trim()) {
      const newPost = {
        id: Date.now(), // Basit ID oluşturma
        username: "Sen", // Mevcut kullanıcı
        handle: "@sen",
        time: "şimdi",
        content: postContent,
        moodCompatibility: Math.floor(Math.random() * 30 + 70) + "%", // Random mood uyumu
      }

      // Yeni postu listenin başına ekle
      if (activeTab === "forYou") {
        setPosts([newPost, ...posts])
      } else {
        setFollowingPosts([newPost, ...followingPosts])
      }

      // Post içeriğini temizle
      setPostContent("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handlePostSubmit()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-800">Ana Sayfa</h1>
      </div>

      {/* Create Post */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <Textarea
              placeholder="Neler oluyor?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              onKeyDown={handleKeyPress}
              className="border-none resize-none text-xl placeholder-gray-500 focus:ring-0 min-h-[80px]"
              rows={3}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-500">
                {postContent.length > 0 && `${postContent.length}/280 karakter`}
              </span>
              <div className="flex space-x-2">
                <span className="text-xs text-gray-400">Ctrl+Enter ile gönder</span>
                <Button
                  onClick={handlePostSubmit}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6"
                  disabled={!postContent.trim() || postContent.length > 280}
                >
                  Gönder
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab("forYou")}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            activeTab === "forYou"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Sizin İçin
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            activeTab === "following"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Takip Edilenler
        </button>
      </div>

      {/* Posts */}
      <div className="bg-white">
        {activeTab === "forYou" && posts.map((post) => <PostCard key={post.id} post={post} />)}
        {activeTab === "following" && followingPosts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  )
}
