interface RightSidebarProps {
  currentPage: string
  onUserClick?: (user: any) => void
}

export function RightSidebar({ currentPage, onUserClick }: RightSidebarProps) {
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
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
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
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
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
    <div className="hidden xl:block fixed right-0 top-0 w-80 h-full bg-background border-l border-border p-4 overflow-y-auto">
      <div className="space-y-4 mt-4">{renderContent()}</div>
    </div>
  )
}
