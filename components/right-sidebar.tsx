import { useState, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"
import { ProfileImage } from "@/components/ui/profile-image"
import { useAuth } from "@/hooks/use-auth"
import apiClient from "@/lib/apiClient"

interface RightSidebarProps {
  currentPage: string
  onUserClick?: (user: any) => void
}

export function RightSidebar({ currentPage, onUserClick }: RightSidebarProps) {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [userMoodProfile, setUserMoodProfile] = useState<any[]>([])

  // Emotion type mapping
  const emotionTypeMap: { [key: number]: string } = {
    1: "Mutluluk",
    2: "Üzüntü",
    3: "Öfke",
    4: "Korku",
    5: "Şaşkınlık",
    6: "İğrenme",
    7: "Heyecan",
    8: "Enerji",
    9: "Endişe",
    10: "Hayal Kırıklığı"
  }

  // Fetch mood-based user recommendations
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      if (!user) return

      setLoading(true)
      try {
        const response = await apiClient.getMoodBasedUserRecommendations({
          PageIndex: 0,
          PageSize: 5
        })

        if (response.success) {
          setUserMoodProfile(response.userMoodProfile || [])

          // Transform compatible users to match our UI format
          const transformedUsers = (response.compatibleUsers || []).map((compatibleUser: any) => {
            // Get top 2 emotions for display
            const topEmotions = compatibleUser.emotionScores
              ?.sort((a: any, b: any) => b.score - a.score)
              ?.slice(0, 2)
              ?.map((emotion: any) => ({
                name: emotionTypeMap[emotion.emotionType] || 'Unknown',
                percentage: `${emotion.score}%`
              })) || []

            return {
              id: compatibleUser.userId,
              username: `${compatibleUser.firstName} ${compatibleUser.lastName}`.trim(),
              handle: compatibleUser.firstName?.toLowerCase() || 'user',
              bio: compatibleUser.compatibilityReason || 'MoodLink user',
              followers: Math.floor(Math.random() * 3000 + 500).toString(), // Mock data
              following: Math.floor(Math.random() * 1000 + 100).toString(), // Mock data
              moods: topEmotions,
              badges: [compatibleUser.dominantEmotion === 'mutluluk' ? '😊' : '🎯', '✨'],
              moodCompatibility: `${Math.round(compatibleUser.moodCompatibility)}%`,
              compatibilityCategory: compatibleUser.compatibilityCategory,
              dominantEmotion: compatibleUser.dominantEmotion
            }
          })

          setSuggestedUsers(transformedUsers)
        }
      } catch (error) {
        console.error('Error fetching suggested users:', error)
        // Fallback to empty array on error
        setSuggestedUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestedUsers()
  }, [user])

  // Theme-specific background configurations for sidebar
  const getThemeBackground = (currentTheme: string) => {
    const themeBackgrounds: Record<string, { image: string; overlay: string }> = {
      night: {
        image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=800&fit=crop&crop=center&auto=format&q=80",
        overlay: "bg-gray-900/80"
      },
      white: {
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=800&fit=crop&crop=center&auto=format&q=80",
        overlay: "bg-white/85"
      },
      nature: {
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=800&fit=crop&crop=center&auto=format&q=80",
        overlay: "bg-green-50/80"
      },
      sunset: {
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=800&fit=crop&crop=center&auto=format&q=80",
        overlay: "bg-orange-50/80"
      },

      nirvana: {
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=800&fit=crop&crop=center&auto=format&q=80",
        overlay: "bg-purple-50/80"
      },
      ocean: {
        image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=800&fit=crop&crop=center&auto=format&q=80",
        overlay: "bg-cyan-50/80"
      }
    }

    return themeBackgrounds[currentTheme] || themeBackgrounds.white
  }

  const themeBackground = getThemeBackground(theme)

  // Mock fallback data (will be replaced by API data)
  const fallbackUsers = [
    {
      username: "Ahmet Yılmaz",
      handle: "ahmet_yilmaz",
      bio: "Athlete and photographer",
      followers: "2.5K",
      following: "450",
      moods: [
        { name: "Energetic", percentage: "78%" },
        { name: "Excited", percentage: "65%" },
      ],
      badges: ["🏆", "📸"]
    },
    {
      username: "Ayşe Kaya",
      handle: "ayse_kaya",
      bio: "Writer and nature lover",
      followers: "1.8K",
      following: "302",
      moods: [
        { name: "Calm", percentage: "82%" },
        { name: "Inspired", percentage: "74%" },
      ],
      badges: ["✍️", "🌿"]
    }
  ]

  // Use API data if available, otherwise fallback
  const displayUsers = suggestedUsers.length > 0 ? suggestedUsers : fallbackUsers

  const renderContent = () => {
    if (currentPage === "home") {
      return (
        <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-border">
          <h3 className="font-bold text-lg mb-4 text-foreground">
            {loading ? "Loading..." : "Suggested Users"}
          </h3>
          <div className="space-y-4">
            {displayUsers.map((user, index) => (
              <div
                key={user.id || index}
                className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                onClick={() => onUserClick && onUserClick(user)}
              >
                <ProfileImage
                  src={null} // Will be added when user profile pictures are available in API
                  alt={user.username}
                  size="sm"
                  fallbackText={user.username}
                  className="w-12 h-12 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline space-x-2">
                    <h4 className="font-medium text-foreground truncate">{user.username}</h4>
                    <span className="text-sm text-muted-foreground">@{user.handle}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{user.bio}</p>
                  {user.moodCompatibility && (
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                        {user.moodCompatibility} Compatible
                      </span>
                      {user.moods?.slice(0, 1).map((mood: any, moodIndex: number) => (
                        <span key={moodIndex} className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                          {mood.name} {mood.percentage}
                        </span>
                      ))}
                    </div>
                  )}
                  {!user.moodCompatibility && user.moods && (
                    <div className="flex items-center space-x-2 mt-2">
                      {user.moods.map((mood: any, moodIndex: number) => (
                        <span key={moodIndex} className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">
                          {mood.name} {mood.percentage}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (currentPage === "search") {
      return (
        <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-border">
          <h3 className="font-bold text-lg mb-4 text-foreground">
            {loading ? "Loading..." : "Popular Users"}
          </h3>
          <div className="space-y-4">
            {displayUsers.map((user, index) => (
              <div
                key={user.id || index}
                className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                onClick={() => onUserClick && onUserClick(user)}
              >
                <ProfileImage
                  src={null} // Will be added when user profile pictures are available in API
                  alt={user.username}
                  size="sm"
                  fallbackText={user.username}
                  className="w-12 h-12 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline space-x-2">
                    <h4 className="font-medium text-foreground truncate">{user.username}</h4>
                    <span className="text-sm text-muted-foreground">@{user.handle}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{user.bio}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-muted-foreground">
                      <strong className="text-foreground">{user.followers}</strong> Followers
                    </span>
                    <span className="text-xs text-muted-foreground">
                      <strong className="text-foreground">{user.following}</strong> Following
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="hidden xl:block fixed right-0 top-0 w-80 h-full border-l border-border overflow-y-auto">
      {/* Background Layer */}
      <div className="absolute inset-0">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${themeBackground.image})`,
          }}
        />
        {/* Overlay */}
        <div className={`absolute inset-0 ${themeBackground.overlay} backdrop-blur-[1px]`} />
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="space-y-4 mt-4">{renderContent()}</div>
      </div>
    </div>
  )
}
