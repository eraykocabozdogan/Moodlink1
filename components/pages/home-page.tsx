"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react" // Added useEffect and useCallback
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PostCard } from "@/components/post-card"
import useEmblaCarousel from 'embla-carousel-react' // Added embla-carousel-react
import { ImagePlus } from 'lucide-react' // Added ImagePlus icon
import apiClient from "@/lib/apiClient"

// Define a type for the Post structure
interface Post {
  id: number;
  username: string;
  handle: string;
  time: string;
  content: string;
  image?: string; 
  moodCompatibility: string;
}

interface HomePageProps {
  onUserClick?: (user: any) => void;
}

export function HomePage({ onUserClick }: HomePageProps = {}) {
  const [activeTab, setActiveTab] = useState("forYou")
  const [postContent, setPostContent] = useState("")

  // API-based state management
  const [forYouPosts, setForYouPosts] = useState<Post[]>([])
  const [followingPosts, setFollowingPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null) // Added state for selected image
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })

  // useCallback hooks for emblaApi
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Fetch posts and user data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      console.log('Fetching data from API...')

      try {
        // Fetch user data and posts in parallel
        const [userResponse, postsResponse] = await Promise.all([
          apiClient.getUserFromAuth(),
          apiClient.getPosts({ PageIndex: 0, PageSize: 20 })
        ])

        console.log('User response:', userResponse)
        console.log('Posts response:', postsResponse)
        console.log('Posts response stringified:', JSON.stringify(postsResponse, null, 2))
        console.log('Posts items:', postsResponse.items)
        console.log('Posts items length:', postsResponse.items?.length)

        // Set current user
        setCurrentUser(userResponse)

        // Transform API data to match our Post interface
        const transformPost = (apiPost: any) => ({
          id: apiPost.id,
          username: 'User', // TODO: Get actual username from userId
          handle: `@user_${apiPost.userId?.slice(-4) || 'unknown'}`, // Use last 4 chars of userId as handle
          time: 'now', // TODO: Add createdDate to API response
          content: apiPost.contentText || '',
          image: apiPost.postImageFileId ? `/api/files/${apiPost.postImageFileId}` : undefined,
          moodCompatibility: `${Math.floor(Math.random() * 30 + 70)}%` // Mock mood compatibility for now
        })

        const transformedPosts = postsResponse.items?.map(transformPost) || []

        // Set the same posts for both tabs for now
        setForYouPosts(transformedPosts)
        setFollowingPosts(transformedPosts)

      } catch (error: any) {
        console.error('Error fetching posts:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
          fullError: error
        })

        let errorMessage = 'Gönderiler yüklenirken bir hata oluştu.'

        if (error.response?.status === 401) {
          errorMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.'
        } else if (error.response?.status === 403) {
          errorMessage = 'Bu içeriği görme yetkiniz yok.'
        } else if (error.response?.status === 404) {
          errorMessage = 'Gönderiler bulunamadı.'
        } else if (error.response?.status >= 500) {
          errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.'
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
          errorMessage = 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.'
        }

        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    return `${Math.floor(diffInSeconds / 86400)}d`
  }

  // Effect to sync Embla carousel with activeTab state
  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        const newIndex = emblaApi.selectedScrollSnap()
        setActiveTab(newIndex === 0 ? "forYou" : "following")
      }
      emblaApi.on("select", onSelect)
      // Cleanup listener on component unmount
      return () => {
        emblaApi.off("select", onSelect)
      }
    }
  }, [emblaApi])

  // Effect to sync activeTab state with Embla carousel
  useEffect(() => {
    if (emblaApi) {
      const targetIndex = activeTab === "forYou" ? 0 : 1
      if (emblaApi.selectedScrollSnap() !== targetIndex) {
        emblaApi.scrollTo(targetIndex)
      }
    }
  }, [activeTab, emblaApi])

  const handlePostSubmit = async () => {
    if (postContent.trim() || selectedImage) { // Allow post if there\'s content or an image
      try {
        console.log('Creating new post:', { content: postContent, hasImage: !!selectedImage })

        // Create post via API
        const createPostData = {
          userId: currentUser?.id || "00000000-0000-0000-0000-000000000000",
          contentText: postContent,
          imageFileIds: undefined, // TODO: Handle image upload
          location: undefined,
          tags: undefined
        }

        const response = await apiClient.createPost(createPostData)
        console.log('Post created successfully:', response)

        // Create local post object for immediate UI update
        const newPost: Post = {
          id: response.id || Date.now(),
          username: "You",
          handle: "@you",
          time: "now",
          content: postContent,
          image: selectedImage ?? undefined, // Add selected image to post, ensure undefined if null
          moodCompatibility: Math.floor(Math.random() * 30 + 70) + "%",
        }

        // Add to local state for immediate feedback
        if (activeTab === "forYou") {
          setForYouPosts([newPost, ...forYouPosts])
        } else {
          setFollowingPosts([newPost, ...followingPosts])
        }

        setPostContent("")
        setSelectedImage(null) // Clear selected image after posting

      } catch (error: any) {
        console.error('Error creating post:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
          fullError: error
        })
        alert('Gönderi paylaşılırken bir hata oluştu.')
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handlePostSubmit()
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      event.target.value = "" // Reset file input value
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-foreground">Home</h1>
        </div>
      </div>

      {/* Create Post */}
      <div className="border-b border-border p-4 bg-card">
        <div className="flex space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <Textarea
              placeholder="What's happening?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              onKeyDown={handleKeyPress}
              className="border-none resize-none text-xl placeholder-muted-foreground focus:ring-0 min-h-[80px] bg-transparent text-foreground"
              rows={3}
              maxLength={280} // Added maxLength for character limit
            />
            {/* Image preview section */}
            {selectedImage && (
              <div className="mt-2">
                <img src={selectedImage} alt="Preview" className="rounded-lg max-h-40 object-contain" />
                <Button variant="ghost" size="sm" onClick={() => setSelectedImage(null)} className="mt-1 text-destructive hover:text-destructive/90">
                  Remove
                </Button>
              </div>
            )}
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center space-x-2">
                {/* Image upload button */}
                <label htmlFor="image-upload" className="cursor-pointer">
                  <ImagePlus className="text-primary hover:text-primary/90" size={24} />
                </label>
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {/* Character count */}
                <span className="text-sm text-muted-foreground">
                  {postContent.length}/280
                </span>
              </div>
              <div className="flex space-x-2 items-center"> {/* Changed to items-center for vertical alignment */}
                <span className="text-xs text-muted-foreground">Press Ctrl+Enter to send</span>
                <Button
                  onClick={handlePostSubmit}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-primary-foreground px-6"
                  disabled={(!postContent.trim() && !selectedImage) || postContent.length > 280} // Updated disabled condition
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Tabs */}
      <div className="flex border-b border-border bg-card">
        <button
          onClick={() => setActiveTab("forYou")}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            activeTab === "forYou"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          For You
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            activeTab === "following"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Following
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <span className="ml-3 text-muted-foreground">Gönderiler yükleniyor...</span>
        </div>
      )}

      {error && (
        <div className="p-4 text-center">
          <p className="text-destructive">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-2"
          >
            Tekrar Dene
          </Button>
        </div>
      )}

      {/* Carousel for posts */}
      {!loading && !error && (
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {/* "For You" Tab Content */}
            <div className="min-w-0 flex-shrink-0 flex-grow-0 basis-full bg-background">
              {forYouPosts.length > 0 ? (
                forYouPosts.map((post) => (
                  <PostCard key={post.id} post={post} onUserClick={onUserClick} />
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <p>Henüz gönderi yok.</p>
                  <p className="text-sm mt-1">İlk gönderiyi sen paylaş!</p>
                </div>
              )}
            </div>
            {/* "Following" Tab Content */}
            <div className="min-w-0 flex-shrink-0 flex-grow-0 basis-full bg-background">
              {followingPosts.length > 0 ? (
                followingPosts.map((post) => (
                  <PostCard key={post.id} post={post} onUserClick={onUserClick} />
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <p>Takip ettiğin kişilerden henüz gönderi yok.</p>
                  <p className="text-sm mt-1">Daha fazla kişi takip etmeyi dene!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
