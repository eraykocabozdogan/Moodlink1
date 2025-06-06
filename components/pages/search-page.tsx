"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Search, Users, FileText } from "lucide-react"
import apiClient from "@/lib/apiClient"
import { PostCard } from "@/components/post-card"
import { Skeleton } from "@/components/ui/skeleton"

// Swagger'dan gelen tipleri tanımlayalım
interface SearchUser {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePictureUrl?: string;
}

interface SearchPost {
  id: string;
  userId: string;
  userName: string;
  contentText: string;
  createdDate: string;
  // PostCard'ın beklediği diğer alanlar için varsayılan değerler
  handle?: string;
  moodCompatibility?: string;
  image?: string;
}

interface SearchResults {
  users: SearchUser[];
  posts: SearchPost[];
}

interface SearchPageProps {
  onUserClick?: (user: any) => void;
}

export function SearchPage({ onUserClick }: SearchPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResults>({ users: [], posts: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false) // Arama yapılıp yapılmadığını takip et

  // Debounce mekanizması için
  useEffect(() => {
    // Kullanıcı yazmayı bıraktıktan 500ms sonra arama yap
    const timer = setTimeout(() => {
      if (searchQuery.length > 2) {
        performSearch(searchQuery)
      } else {
        // Arama sorgusu kısaysa sonuçları temizle
        setResults({ users: [], posts: [] })
        setHasSearched(false)
      }
    }, 500)

    return () => clearTimeout(timer) // Kullanıcı yazmaya devam ederse timer'ı temizle
  }, [searchQuery])

  const performSearch = async (query: string) => {
    setIsLoading(true)
    setHasSearched(true)
    try {
      const response = await apiClient.get<SearchResults>('/api/Search', { searchTerm: query })
      setResults(response)
    } catch (error) {
      console.error("Search failed:", error)
      setResults({ users: [], posts: [] }) // Hata durumunda sonuçları temizle
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-foreground">Arama</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Kullanıcı veya gönderi ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-muted border-border focus:bg-card focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Results Section */}
        <div>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : !hasSearched ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>Kullanıcıları veya gönderileri keşfetmek için aramaya başla.</p>
            </div>
          ) : results.users.length === 0 && results.posts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>"{searchQuery}" için sonuç bulunamadı.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Results */}
              {results.users.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-foreground flex items-center"><Users className="w-5 h-5 mr-2" /> Kullanıcılar</h3>
                  {results.users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-4 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => onUserClick && onUserClick(user)}
                    >
                      <img src={user.profilePictureUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`} alt={user.userName} className="w-12 h-12 rounded-full bg-muted" />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{user.firstName} {user.lastName}</h4>
                        <p className="text-sm text-muted-foreground">@{user.userName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Post Results */}
              {results.posts.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-foreground flex items-center"><FileText className="w-5 h-5 mr-2" /> Gönderiler</h3>
                  {results.posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={{
                        ...post,
                        handle: `@${post.userName}`,
                        time: new Date(post.createdDate).toLocaleDateString(),
                        moodCompatibility: `${Math.floor(Math.random() * 25) + 70}%` // Geçici
                      }}
                      onUserClick={onUserClick}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}