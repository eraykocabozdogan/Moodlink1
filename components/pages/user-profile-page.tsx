"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/post-card"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface UserProfilePageProps {
  user: any
  onBack: () => void
}

export function UserProfilePage({ user, onBack }: UserProfilePageProps) {
  const { t } = useLanguage()
  const [isFollowing, setIsFollowing] = useState(false)
  
  // Örnek gönderiler (Example posts)
  const userPosts = [
    {
      id: 1,
      username: user.username,
      handle: `@${user.handle}`,
      time: t("post.time.minutes", { minutes: "15" }),
      content: t("post.example.mood"),
      moodCompatibility: "85%",
    },
    {
      id: 2,
      username: user.username,
      handle: `@${user.handle}`,
      time: t("post.time.seconds", { seconds: "2" }),
      content: t("post.example.activity"),
      moodCompatibility: "92%",
    },
  ]

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">{t("title.profile")}</h1>
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
              <strong className="text-foreground">{user.followers}</strong> {t("profile.followers")}
            </span>
            <span>
              <strong className="text-foreground">{user.following}</strong> {t("profile.followingCount")}
            </span>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-xl">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">{t("profile.mood")}:</strong>{" "}
              {user.moods && user.moods.length > 0 ? (
                user.moods.map((mood: any, index: number) => (
                  <span key={index}>
                    {mood.name} {mood.percentage}
                    {index < user.moods.length - 1 ? ", " : ""}
                  </span>
                ))
              ) : (
                <span>{t("profile.noMood")}</span>
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong className="text-foreground">{t("profile.badges")}:</strong>{" "}
              {user.badges && user.badges.length > 0 ? user.badges.join(" ") : t("profile.noBadges")}
            </p>
          </div>
          
          <div className="flex justify-center space-x-3">
            <Button
              onClick={handleFollowToggle}
              className={isFollowing ? "bg-muted text-foreground border border-border" : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"}
            >
              {isFollowing ? t("profile.followingStatus") : t("profile.follow")}
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              {t("profile.message")}
            </Button>
          </div>
        </div>
      </div>

      {/* Mood Compatibility */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-foreground">{t("profile.compatibility")}</h4>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full">
            <span className="text-sm font-medium">%{Math.floor(Math.random() * 30) + 70}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {t("profile.compatibilityText")}
        </p>
      </div>

      {/* Posts */}
      <div className="bg-card">
        <div className="p-4 border-b border-border">
          <h4 className="font-bold text-foreground">{t("profile.posts")}</h4>
        </div>
        {userPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
