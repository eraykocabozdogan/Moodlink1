"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react" // Added useEffect and useCallback
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PostCard } from "@/components/post-card"
import { ProfileImage } from "@/components/ui/profile-image"
import useEmblaCarousel from 'embla-carousel-react' // Added embla-carousel-react
import { ImagePlus } from 'lucide-react' // Added ImagePlus icon
import apiClient from "@/lib/apiClient"
import { useAuth } from "@/hooks/use-auth" // Import useAuth hook

// Helper function to generate consistent hash from string
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// Define a type for the Post structure
interface Post {
  id: string;
  username: string;
  handle: string;
  time: string;
  content: string;
  image?: string;
  moodCompatibility: string;
  matchedMood?: string;
  likesCount: number;
  commentsCount: number;
  isLikedByCurrentUser: boolean;
  createdDate?: string;
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

  // Get user from useAuth hook
  const { user } = useAuth()

  // Available moods for matching
  const availableMoods = [
    "Happy", "Energetic", "Calm", "Focused", "Creative", "Relaxed",
    "Motivated", "Peaceful", "Excited", "Thoughtful", "Confident", "Grateful"
  ]

  // Function to get random mood
  const getRandomMood = () => {
    return availableMoods[Math.floor(Math.random() * availableMoods.length)]
  }

  // useCallback hooks for emblaApi
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Fetch posts from API (user data comes from useAuth hook)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Use user data from useAuth hook instead of fetching again
        if (!user) {
          setLoading(false)
          return
        }

        setCurrentUser(user)

        // Fetch all posts using pagination
        let allPosts: any[] = []
        let pageIndex = 0
        const pageSize = 20
        let hasMore = true

        // Get all users first, then get their posts with createdDate
        try {
          // Get all users
          const usersResponse = await apiClient.getUsers({ PageIndex: 0, PageSize: 100 })
          const users = usersResponse.items || []

          // Get posts from each user (these have createdDate!)
          for (const user of users) {
            try {
              const userPostsResponse = await apiClient.getUserPosts(user.id, { PageIndex: 0, PageSize: 20 })
              const userPosts = userPostsResponse.items || []
              allPosts.push(...userPosts)
            } catch (error) {
              // Failed to get posts for this user, continue with others
            }
          }

          hasMore = false // We got all posts from all users

        } catch (error) {

          // Fallback to old method
          while (hasMore) {
            let postsResponse
            try {
              postsResponse = await apiClient.getPosts({ PageIndex: pageIndex, PageSize: pageSize })
            } catch (getPostsError) {
              try {
                postsResponse = await apiClient.getFeedPosts({ PageIndex: pageIndex, PageSize: pageSize })
              } catch (getFeedPostsError) {
                console.error('Both endpoints failed:', { getPostsError, getFeedPostsError })
                throw getFeedPostsError
              }
            }

            // Check both possible response formats
            const posts = (postsResponse as any).posts || (postsResponse as any).items || []
            const hasMoreData = (postsResponse as any).hasMore || (postsResponse as any).hasNext || false

            if (posts && posts.length > 0) {
              allPosts = [...allPosts, ...posts]
              hasMore = hasMoreData
              pageIndex++
            } else {
              hasMore = false
            }
          }
        }

        // Transform API data to match our Post interface with real data
        const transformPost = async (apiPost: any, index: number) => {
          const isCurrentUser = user && apiPost.userId === user.id

          // Fetch user data for this post
          let userInfo = null
          let username = 'User'
          let handle = `@user_${apiPost.userId?.slice(-4) || 'unknown'}`

          if (isCurrentUser) {
            username = 'You'
            handle = '@you'
            userInfo = user
          } else {
            try {
              userInfo = await apiClient.getUserById(apiPost.userId)
              // Use firstName lastName for display, userName for handle
              const fullName = `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim()
              username = fullName || userInfo.userName || 'User'
              handle = userInfo.userName ? `@${userInfo.userName}` : handle
            } catch (userError) {
              // Keep default values
            }
          }

          // Use real data from API response
          let likesCount = apiPost.likesCount || 0
          let commentsCount = apiPost.commentsCount || 0
          let isLikedByCurrentUser = apiPost.isLikedByCurrentUser || false

          // Generate mood compatibility and matched mood
          const matchedMood = getRandomMood()
          const compatibilityPercentage = Math.floor(Math.random() * 30 + 70)

          return {
            id: apiPost.id,
            username: username,
            handle: handle,
            time: apiPost.createdDate ? formatTimeAgo(apiPost.createdDate) : 'now',
            content: apiPost.contentText || '',
            image: apiPost.postImageFileId ? apiClient.getImageUrl(apiPost.postImageFileId) : undefined,
            moodCompatibility: `${compatibilityPercentage}%`,
            matchedMood: matchedMood,
            likesCount: likesCount,
            commentsCount: commentsCount,
            isLikedByCurrentUser: isLikedByCurrentUser,
            userProfileImageUrl: apiPost.userProfileImageUrl,
            // Add real user data for profile navigation
            userData: userInfo ? {
              id: userInfo.id,
              userName: userInfo.userName,
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
              fullName: userInfo.userName || `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim(),
              profilePictureFileId: userInfo.profilePictureFileId,
              profileImageFileId: userInfo.profileImageFileId,
              profilePictureUrl: userInfo.profilePictureUrl,
              profileImageUrl: userInfo.profileImageUrl
            } : {
              id: apiPost.userId,
              userName: null,
              firstName: null,
              lastName: null,
              fullName: null,
              profilePictureFileId: null,
              profileImageFileId: null,
              profilePictureUrl: null,
              profileImageUrl: null
            },
            createdDate: apiPost.createdDate
          }
        }

        // Transform ALL posts with real data (might be slower but correct)
        const transformedPosts = await Promise.all(allPosts.map(transformPost))

        // Sort posts by creation date (newest first)
        transformedPosts.sort((a, b) => {
          if (!a.createdDate || !b.createdDate) return 0
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        })

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

        let errorMessage = 'Error loading posts.'

        if (error.response?.status === 401) {
          errorMessage = 'Session expired. Please login again.'
        } else if (error.response?.status === 403) {
          errorMessage = 'You do not have permission to view this content.'
        } else if (error.response?.status === 404) {
          errorMessage = 'Posts not found.'
        } else if (error.response?.status >= 500) {
          errorMessage = 'Server error. Please try again later.'
        } else if (error.isNetworkError || error.isCorsError || error.code === 'ERR_NETWORK' ||
                   error.message === 'Network Error' || error.message.includes('CORS') ||
                   error.message.includes('access control') || !error.response) {
          errorMessage = 'Network error. Please check your internet connection.'
        }

        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user]) // Only run when user changes

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

  // Function to fetch all posts from API with proper createdDate
  const fetchAllPosts = async () => {
    try {
      let allPosts: any[] = []

      // Use the same method as initial load to get posts with proper createdDate
      try {
        // Get all users
        const usersResponse = await apiClient.getUsers({ PageIndex: 0, PageSize: 100 })
        const users = usersResponse.items || []

        // Get posts from each user (these have createdDate!)
        for (const user of users) {
          try {
            const userPostsResponse = await apiClient.getUserPosts(user.id, { PageIndex: 0, PageSize: 20 })
            const userPosts = userPostsResponse.items || []
            allPosts.push(...userPosts)
          } catch (error) {
            // Failed to get posts for this user, continue with others
          }
        }
      } catch (error) {
        // Fallback to old method if user-based fetching fails
        let pageIndex = 0
        const pageSize = 20
        let hasMore = true

        while (hasMore) {
          let postsResponse
          try {
            postsResponse = await apiClient.getPosts({ PageIndex: pageIndex, PageSize: pageSize })
          } catch (getPostsError) {
            postsResponse = await apiClient.getFeedPosts({ PageIndex: pageIndex, PageSize: pageSize })
          }

          const posts = postsResponse.posts || postsResponse.items || []
          const hasMoreData = postsResponse.hasMore || postsResponse.hasNext || false

          if (posts && posts.length > 0) {
            allPosts = [...allPosts, ...posts]
            hasMore = hasMoreData
            pageIndex++
          } else {
            hasMore = false
          }
        }
      }

      return allPosts
    } catch (error) {
      return []
    }
  }

  // Function to refresh posts from API
  const refreshPosts = async () => {
    try {
      const allPosts = await fetchAllPosts()

      // Use the same transform logic as initial load
      const transformPost = async (apiPost: any, index: number) => {
        const isCurrentUser = currentUser && apiPost.userId === currentUser.id

        // Fetch user data for this post
        let userInfo = null
        let username = 'User'
        let handle = `@user_${apiPost.userId?.slice(-4) || 'unknown'}`

        if (isCurrentUser) {
          username = 'You'
          handle = '@you'
          userInfo = currentUser
        } else {
          try {
            userInfo = await apiClient.getUserById(apiPost.userId)
            // Use firstName lastName for display, userName for handle
            const fullName = `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim()
            username = fullName || userInfo.userName || 'User'
            handle = userInfo.userName ? `@${userInfo.userName}` : handle
          } catch (userError) {
            // Keep default values
          }
        }

        // Use real data from API response
        let likesCount = apiPost.likesCount || 0
        let commentsCount = apiPost.commentsCount || 0
        let isLikedByCurrentUser = apiPost.isLikedByCurrentUser || false

        // Generate mood compatibility and matched mood
        const matchedMood = getRandomMood()
        const compatibilityPercentage = Math.floor(Math.random() * 30 + 70)

        return {
          id: apiPost.id,
          username: username,
          handle: handle,
          time: apiPost.createdDate ? formatTimeAgo(apiPost.createdDate) : 'now',
          content: apiPost.contentText || '',
          image: apiPost.postImageFileId ? apiClient.getImageUrl(apiPost.postImageFileId) : undefined,
          moodCompatibility: `${compatibilityPercentage}%`,
          matchedMood: matchedMood,
          likesCount: likesCount,
          commentsCount: commentsCount,
          isLikedByCurrentUser: isLikedByCurrentUser,
          userProfileImageUrl: apiPost.userProfileImageUrl,
          createdDate: apiPost.createdDate,
          // Add real user data for profile navigation
          userData: userInfo ? {
            id: userInfo.id,
            userName: userInfo.userName,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            fullName: userInfo.userName || `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim(),
            profilePictureFileId: userInfo.profilePictureFileId,
            profileImageFileId: userInfo.profileImageFileId,
            profilePictureUrl: userInfo.profilePictureUrl,
            profileImageUrl: userInfo.profileImageUrl
          } : {
            id: apiPost.userId,
            userName: null,
            firstName: null,
            lastName: null,
            fullName: null,
            profilePictureFileId: null,
            profileImageFileId: null,
            profilePictureUrl: null,
            profileImageUrl: null
          },
        }
      }

      // Transform ALL posts with real data (same as initial load)
      const transformedPosts = await Promise.all(allPosts.map(transformPost))

      // Sort posts by creation date (newest first)
      transformedPosts.sort((a, b) => {
        if (!a.createdDate || !b.createdDate) return 0
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      })

      // Set the same posts for both tabs for now
      setForYouPosts(transformedPosts)
      setFollowingPosts(transformedPosts)

    } catch (error) {
      console.error('Error refreshing posts:', error)
    }
  }

  const handlePostSubmit = async () => {
    if (postContent.trim() || selectedImage) { // Allow post if there\'s content or an image
      try {
        let postImageFileId: string | undefined = undefined

        // Upload image if selected
        if (selectedImage) {
          try {
            // Convert base64 to File object
            const response = await fetch(selectedImage)
            const blob = await response.blob()

            // Determine file type from blob or default to jpeg
            const fileType = blob.type || 'image/jpeg'
            const fileName = `post-image-${Date.now()}.${fileType.split('/')[1] || 'jpg'}`

            const file = new File([blob], fileName, {
              type: fileType,
              lastModified: Date.now()
            })

            // Create FormData for file upload
            const formData = new FormData()
            // Try different enum values - let's try all combinations
            formData.append('StorageType', '1') // Local storage
            formData.append('OwnerId', currentUser?.id || "00000000-0000-0000-0000-000000000000")
            formData.append('OwnerType', '0') // Try User instead of Post
            formData.append('FileType', '1') // Image (enum value)

            // Make sure file is valid before appending
            if (file && file.size > 0) {
              // Try both uppercase and lowercase field names
              formData.append('File', file, file.name)
            } else {
              alert('Invalid file. Please try again.')
              return
            }

            const uploadResponse = await apiClient.uploadFile(formData)

            if (uploadResponse?.id) {
              postImageFileId = uploadResponse.id
            }
          } catch (uploadError: any) {

            let errorMessage = 'Unknown error'
            if (uploadError?.response?.status) {
              errorMessage = `HTTP ${uploadError.response.status}: ${uploadError.response.statusText || 'Server Error'}`
              if (uploadError.response.data) {
                errorMessage += ` - ${JSON.stringify(uploadError.response.data)}`
              }
            } else if (uploadError?.message) {
              errorMessage = uploadError.message
            }

            alert(`Error uploading photo: ${errorMessage}`)
            return
          }
        }

        // Create post via API
        const createPostData = {
          userId: currentUser?.id || "00000000-0000-0000-0000-000000000000",
          contentText: postContent,
          postImageFileId: postImageFileId
        }

        const response = await apiClient.createPost(createPostData)

        // Clear form immediately for better UX
        setPostContent("")
        setSelectedImage(null)

        // Refresh posts from API to get the latest data including the new post
        await refreshPosts()

        // Trigger a global refresh event for other components
        window.dispatchEvent(new CustomEvent('postsUpdated'))

      } catch (error: any) {
        console.error('Error creating post:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
          fullError: error
        })
        alert('Error sharing post.')
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

  const handlePostUpdate = (postId: string, updates: { likesCount?: number; isLikedByCurrentUser?: boolean; commentsCount?: number }) => {
    // Update both forYou and following posts
    setForYouPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, ...updates } : post
      )
    )
    setFollowingPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, ...updates } : post
      )
    )
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
          <ProfileImage
            src={currentUser?.profilePictureFileId ||
                 currentUser?.profileImageFileId ||
                 currentUser?.profilePictureUrl ||
                 currentUser?.profileImageUrl ||
                 null}
            alt={currentUser?.userName || 'You'}
            size="sm"
            fallbackText={currentUser?.firstName || currentUser?.userName || 'You'}
            className="flex-shrink-0"
          />
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
          <span className="ml-3 text-muted-foreground">Loading posts...</span>
        </div>
      )}

      {error && (
        <div className="p-4 text-center">
          <p className="text-destructive">{error}</p>
          <Button
            onClick={async () => {
              setError(null)
              setLoading(true)
              try {
                await refreshPosts()
              } catch (err) {
                console.error('Error refreshing posts:', err)
                setError('Error loading posts.')
              } finally {
                setLoading(false)
              }
            }}
            variant="outline"
            className="mt-2"
          >
            Try Again
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
                  <PostCard key={post.id} post={post} onUserClick={onUserClick} onPostUpdate={handlePostUpdate} />
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No posts yet.</p>
                  <p className="text-sm mt-1">Be the first to share!</p>
                </div>
              )}
            </div>
            {/* "Following" Tab Content */}
            <div className="min-w-0 flex-shrink-0 flex-grow-0 basis-full bg-background">
              {followingPosts.length > 0 ? (
                followingPosts.map((post) => (
                  <PostCard key={post.id} post={post} onUserClick={onUserClick} onPostUpdate={handlePostUpdate} />
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No posts from people you follow yet.</p>
                  <p className="text-sm mt-1">Try following more people!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
