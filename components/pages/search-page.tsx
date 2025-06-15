"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, Users, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import apiClient from "@/lib/apiClient"
import { UUID } from "@/lib/types/api"

interface SearchPageProps {
  onUserClick?: (user: any) => void;
}

interface SearchResult {
  id: UUID
  userName?: string
  firstName?: string
  lastName?: string
  bio?: string
  profilePictureUrl?: string
}

interface PostResult {
  id: UUID
  userId: UUID
  userName?: string
  userFirstName?: string
  userLastName?: string
  contentText?: string
  createdDate: string
  analysisStatus?: string
  postImageUrl?: string
  likeCount: number
  commentCount: number
}

export function SearchPage({ onUserClick }: SearchPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [postResults, setPostResults] = useState<PostResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const { user } = useAuth()

  // Search function
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSearchResults([])
        setPostResults([])
        setHasSearched(false)
        return
      }

      setLoading(true)
      setHasSearched(true)
      try {
        const response = await apiClient.searchUsersAndPosts(searchQuery, {
          PageIndex: 0,
          PageSize: 20
        })

        setSearchResults(response.users || [])
        setPostResults(response.posts || [])
      } catch (error) {
        console.error('Search failed:', error)
        setSearchResults([])
        setPostResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(performSearch, 500)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

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
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-foreground">Search</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-muted border-border focus:bg-card focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Search Results */}
        {hasSearched ? (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center text-muted-foreground py-8">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p>Searching...</p>
              </div>
            ) : (
              <>
                {/* User Results */}
                {searchResults.length > 0 && (
                  <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
                    <h3 className="font-bold text-lg mb-4 text-foreground flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Users ({searchResults.length})
                    </h3>
                    <div className="space-y-4">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-start space-x-4 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                          onClick={() => onUserClick && onUserClick(user.id)}
                        >
                          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex-shrink-0 flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline space-x-2">
                              <h4 className="font-medium text-foreground truncate">
                                {user.userName || `${user.firstName} ${user.lastName}`.trim() || 'Unknown User'}
                              </h4>
                              {user.userName && (
                                <span className="text-sm text-muted-foreground">@{user.userName}</span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-muted-foreground">
                                <strong className="text-foreground">@{user.userName}</strong>
                              </span>
                              {user.bio && (
                                <span className="text-xs text-muted-foreground truncate">
                                  {user.bio}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Post Results */}
                {postResults.length > 0 && (
                  <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
                    <h3 className="font-bold text-lg mb-4 text-foreground">
                      Posts ({postResults.length})
                    </h3>
                    <div className="space-y-4">
                      {postResults.map((post) => (
                        <div
                          key={post.id}
                          className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex-shrink-0"></div>
                            <span className="font-medium text-foreground">
                              {post.userName || `${post.userFirstName} ${post.userLastName}`.trim() || 'Unknown User'}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(post.createdDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-foreground mb-2 line-clamp-3">{post.contentText}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{post.likeCount} likes</span>
                            <span>{post.commentCount} comments</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {searchResults.length === 0 && postResults.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No results found for "{searchQuery}"</p>
                    <p className="text-sm mt-1">Try searching with different keywords</p>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* Suggested Users - Show when not searching */
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <h3 className="font-bold text-lg mb-4 text-foreground">Suggested Users</h3>
            <div className="space-y-4">
              {suggestedUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
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
        )}
      </div>
    </div>
  )
}
