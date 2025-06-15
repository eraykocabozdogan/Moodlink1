import { useTheme } from "@/components/theme-provider"

interface RightSidebarProps {
  currentPage: string
  onUserClick?: (user: any) => void
}

export function RightSidebar({ currentPage, onUserClick }: RightSidebarProps) {
  const { theme } = useTheme()

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

  const suggestedUsers = [
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
    },
    {
      username: "Mehmet Demir",
      handle: "mehmet_demir",
      bio: "Musician and traveler",
      followers: "3.1K",
      following: "420",
      moods: [
        { name: "Creative", percentage: "85%" },
        { name: "Cheerful", percentage: "79%" },
      ],
      badges: ["🎵", "✈️"]
    }
  ]

  const renderContent = () => {
    if (currentPage === "home") {
      return (
        <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-border">
          <h3 className="font-bold text-lg mb-4 text-foreground">Suggested Users</h3>
          <div className="space-y-4">
            {suggestedUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                onClick={() => onUserClick && onUserClick(user)}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex-shrink-0"></div>
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

    if (currentPage === "search") {
      return (
        <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-border">
          <h3 className="font-bold text-lg mb-4 text-foreground">Popular Users</h3>
          <div className="space-y-4">
            {suggestedUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                onClick={() => onUserClick && onUserClick(user)}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex-shrink-0"></div>
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
