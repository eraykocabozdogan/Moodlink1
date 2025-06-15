"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react" // Added useEffect and useCallback
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PostCard } from "@/components/post-card"
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
  likesCount: number;
  commentsCount: number;
  isLikedByCurrentUser: boolean;
  userData?: {
    id: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
  };
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

        while (hasMore) {
          // Try getFeedPosts first (has createdDate), fallback to getPosts
          let postsResponse
          try {
            console.log('🔄 Trying getFeedPosts (with createdDate)...')
            postsResponse = await apiClient.getFeedPosts({ PageIndex: pageIndex, PageSize: pageSize })
            console.log('✅ getFeedPosts succeeded')
          } catch (getFeedPostsError) {
            try {
              console.log('⚠️ getFeedPosts failed, trying getPosts (no createdDate)...')
              postsResponse = await apiClient.getPosts({ PageIndex: pageIndex, PageSize: pageSize })
              console.log('✅ getPosts succeeded (but no createdDate)')
            } catch (getPostsError) {
              console.error('❌ Both endpoints failed:', { getFeedPostsError, getPostsError })
              throw getFeedPostsError
            }
          }



          // Check both possible response formats
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

        console.log(`🎯 Fetched ${allPosts.length} posts total from ${pageIndex} pages`)
        console.log(`🎯 First few posts:`, allPosts.slice(0, 2))

        // Transform API data to match our Post interface with real data
        const transformPost = async (apiPost: any, index: number) => {
          const isCurrentUser = user && apiPost.userId === user.id

          // Debug log to see what fields are available
          if (index === 0) {
            console.log('🔥 FIRST POST DEBUG 🔥')
            console.log('📊 Sample API Post object:', apiPost)
            console.log('📊 Available fields:', Object.keys(apiPost))
            console.log('📊 User fields in post:', {
              userId: apiPost?.userId,
              userName: apiPost?.userName,
              userFirstName: apiPost?.userFirstName,
              userLastName: apiPost?.userLastName,
              fullName: apiPost?.fullName
            })
            console.log('📊 CRITICAL: userId format check:', {
              userId: apiPost?.userId,
              isString: typeof apiPost?.userId === 'string',
              isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(apiPost?.userId || ''),
              length: apiPost?.userId?.length
            })
            console.log('🔥 END FIRST POST DEBUG 🔥')
          }

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
              console.log(`🔍 Fetching user info for ${apiPost.userId}`)
              userInfo = await apiClient.getUserById(apiPost.userId)
              username = userInfo.userName || `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim() || 'User'
              handle = userInfo.userName ? `@${userInfo.userName}` : handle
              console.log(`✅ Got user info: ${username} (${handle})`)
            } catch (userError) {
              console.log(`❌ Could not fetch user info for ${apiPost.userId}:`, userError)
              // Keep default values
            }
          }

          // Debug: Log post image info
          if (apiPost.postImageFileId) {
            console.log(`Post ${apiPost.id.slice(0, 8)} image info:`, {
              postImageFileId: apiPost.postImageFileId,
              isURL: apiPost.postImageFileId.startsWith('http'),
              isRelative: apiPost.postImageFileId.startsWith('/'),
            })
          }

          // Use real data from API response
          let likesCount = apiPost.likesCount || 0
          let commentsCount = apiPost.commentsCount || 0
          let isLikedByCurrentUser = apiPost.isLikedByCurrentUser || false

          console.log(`Post ${apiPost.id.slice(0, 8)}: ${likesCount} likes, ${commentsCount} comments, liked: ${isLikedByCurrentUser}`)

          return {
            id: apiPost.id,
            username: username,
            handle: handle,
            time: (() => {
              console.log(`🔍 Post ${apiPost.id?.slice(0, 8)} createdDate:`, apiPost.createdDate, typeof apiPost.createdDate)
              if (apiPost.createdDate) {
                try {
                  const timeAgo = formatTimeAgo(apiPost.createdDate)
                  console.log(`📅 Formatted time: ${apiPost.createdDate} → ${timeAgo}`)
                  return timeAgo
                } catch (error) {
                  console.error(`❌ Date formatting error:`, error)
                  return 'now'
                }
              } else {
                console.log(`⚠️ No createdDate for post ${apiPost.id?.slice(0, 8)}`)
                return 'now'
              }
            })(),
            content: apiPost.contentText || '',
            image: apiPost.postImageFileId ? apiClient.getImageUrl(apiPost.postImageFileId) : undefined,
            moodCompatibility: `${Math.floor(Math.random() * 30 + 70)}%`, // Mock mood compatibility for now
            likesCount: likesCount,
            commentsCount: commentsCount,
            isLikedByCurrentUser: isLikedByCurrentUser,
            // Add real user data for profile navigation
            userData: userInfo ? {
              id: userInfo.id,
              userName: userInfo.userName,
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
              fullName: userInfo.userName || `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim()
            } : {
              id: apiPost.userId,
              userName: null,
              firstName: null,
              lastName: null,
              fullName: null
            },
            // Add createdDate for sorting
            createdDate: apiPost.createdDate
          }
        }

        console.log(`Transforming ${allPosts.length} posts with real user data...`)

        // Transform ALL posts with real data (might be slower but correct)
        const transformedPosts = await Promise.all(allPosts.map(transformPost))

        // Sort posts by creation date (newest first)
        transformedPosts.sort((a, b) => {
          if (!a.createdDate || !b.createdDate) return 0
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        })

        console.log(`Sorted ${transformedPosts.length} posts by creation date (newest first)`)



        // Set For You posts
        setForYouPosts(transformedPosts)

        // Get posts from followed users with real createdDate
        await getFollowingPosts()

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

  // Get posts from followed users with real createdDate
  const getFollowingPosts = async () => {
    if (!user?.id) {
      console.log('No current user, showing empty following posts')
      setFollowingPosts([])
      return
    }

    try {
      console.log('🔍 Getting posts from followed users with createdDate...')

      // Get list of users that current user follows
      const followsResponse = await apiClient.getFollows({ PageIndex: 0, PageSize: 1000 })
      const followedUserIds = followsResponse.items?.map((follow: any) => follow.followedId) || []

      console.log('📋 Followed user IDs:', followedUserIds)

      if (followedUserIds.length === 0) {
        console.log('No followed users, showing empty following posts')
        setFollowingPosts([])
        return
      }

      // Get posts from each followed user (these have createdDate!)
      const allFollowingPosts: any[] = []

      for (const userId of followedUserIds) {
        try {
          console.log(`🔄 Getting posts for followed user ${userId.slice(0, 8)}...`)
          const userPostsResponse = await apiClient.getUserPosts(userId, { PageIndex: 0, PageSize: 50 })
          const userPosts = userPostsResponse.items || []
          allFollowingPosts.push(...userPosts)
          console.log(`✅ Got ${userPosts.length} posts from user ${userId.slice(0, 8)}`)
        } catch (error) {
          console.log(`⚠️ Failed to get posts for user ${userId.slice(0, 8)}:`, error)
        }
      }

      console.log(`📋 Total following posts collected: ${allFollowingPosts.length}`)

      // Transform posts with real createdDate
      const transformedFollowingPosts = await Promise.all(
        allFollowingPosts.map(async (apiPost: any) => {
          // Get user info
          let userInfo = null
          try {
            userInfo = await apiClient.getUserById(apiPost.userId)
          } catch (error) {
            console.log(`Could not fetch user info for ${apiPost.userId}:`, error)
          }

          const username = userInfo?.userName || userInfo?.firstName || 'User'
          const handle = userInfo?.userName ? `@${userInfo.userName}` : '@user'

          return {
            id: apiPost.id,
            username: username,
            handle: handle,
            time: apiPost.createdDate ? formatTimeAgo(apiPost.createdDate) : 'now',
            content: apiPost.contentText || '',
            image: apiPost.postImageFileId ? apiClient.getImageUrl(apiPost.postImageFileId) : undefined,
            moodCompatibility: `${Math.floor(Math.random() * 30 + 70)}%`,
            likesCount: apiPost.likesCount || 0,
            commentsCount: apiPost.commentsCount || 0,
            isLikedByCurrentUser: apiPost.isLikedByCurrentUser || false,
            userData: userInfo ? {
              id: userInfo.id,
              userName: userInfo.userName,
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
              fullName: userInfo.userName || `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim()
            } : {
              id: apiPost.userId,
              userName: undefined,
              firstName: undefined,
              lastName: undefined,
              fullName: undefined
            },
            createdDate: apiPost.createdDate
          }
        })
      )

      // Sort by creation date (newest first)
      transformedFollowingPosts.sort((a, b) => {
        if (!a.createdDate || !b.createdDate) return 0
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      })

      console.log(`✅ Following posts with real dates: ${transformedFollowingPosts.length}`)
      setFollowingPosts(transformedFollowingPosts)
    } catch (error) {
      console.error('❌ Error getting following posts:', error)
      setFollowingPosts([]) // Show empty on error
    }
  }

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

  // Function to fetch all posts from API with pagination
  const fetchAllPosts = async () => {
    try {
      console.log('Fetching all posts from API...')
      let allPosts: any[] = []
      let pageIndex = 0
      const pageSize = 20
      let hasMore = true

      while (hasMore) {
        console.log(`Fetching page ${pageIndex + 1}...`)

        // Try getFeedPosts first (has createdDate), fallback to getPosts
        let postsResponse
        try {
          console.log('🔄 Refresh: Trying getFeedPosts (with createdDate)...')
          postsResponse = await apiClient.getFeedPosts({ PageIndex: pageIndex, PageSize: pageSize })
          console.log('✅ Refresh: getFeedPosts succeeded')
        } catch (getFeedPostsError) {
          console.log('⚠️ Refresh: getFeedPosts failed, trying getPosts (no createdDate)...')
          postsResponse = await apiClient.getPosts({ PageIndex: pageIndex, PageSize: pageSize })
          console.log('✅ Refresh: getPosts succeeded (but no createdDate)')
        }

        // Check both possible response formats
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

      console.log(`Fetched ${allPosts.length} posts total from ${pageIndex} pages`)
      return allPosts
    } catch (error) {
      console.error('Error fetching all posts:', error)
      return []
    }
  }

  // Function to refresh posts from API
  const refreshPosts = async () => {
    try {
      const allPosts = await fetchAllPosts()

      // Transform API data to match our Post interface with real data
      const transformPost = async (apiPost: any, index: number) => {
        const isCurrentUser = currentUser && apiPost.userId === currentUser.id

        // Use real data from API response
        let likesCount = apiPost.likesCount || 0
        let commentsCount = apiPost.commentsCount || 0
        let isLikedByCurrentUser = apiPost.isLikedByCurrentUser || false

        console.log(`Refresh - Post ${apiPost.id.slice(0, 8)}: ${likesCount} likes, ${commentsCount} comments, liked: ${isLikedByCurrentUser}`)

        return {
          id: apiPost.id,
          username: isCurrentUser ? 'You' : (apiPost.userName || 'User'), // Show "You" for current user's posts
          handle: isCurrentUser ? '@you' : `@user_${apiPost.userId?.slice(-4) || 'unknown'}`, // Use @you for current user
          time: apiPost.createdDate ? formatTimeAgo(apiPost.createdDate) : 'now',
          content: apiPost.contentText || '',
          image: apiPost.postImageFileId ? apiClient.getImageUrl(apiPost.postImageFileId) : undefined,
          moodCompatibility: `${Math.floor(Math.random() * 30 + 70)}%`, // Mock mood compatibility for now
          likesCount: likesCount,
          commentsCount: commentsCount,
          isLikedByCurrentUser: isLikedByCurrentUser,
          createdDate: apiPost.createdDate
        }
      }

      console.log(`Refreshing ${allPosts.length} posts with real data (first 10 posts only for performance)...`)

      // For performance, only fetch real data for first 10 posts
      const postsWithRealData = allPosts.slice(0, 10)
      const postsWithMockData = allPosts.slice(10)

      // Transform first 10 posts with real data
      const realDataPosts = await Promise.all(postsWithRealData.map(transformPost))

      // Transform remaining posts with mock data for performance
      const mockDataPosts = postsWithMockData.map((apiPost: any, index: number) => {
        const isCurrentUser = currentUser && apiPost.userId === currentUser.id
        const postIdHash = apiPost.id.split('-')[0]
        const hashNum = parseInt(postIdHash, 16) || 0

        return {
          id: apiPost.id,
          username: isCurrentUser ? 'You' : (apiPost.userName || 'User'),
          handle: isCurrentUser ? '@you' : `@user_${apiPost.userId?.slice(-4) || 'unknown'}`,
          time: apiPost.createdDate ? formatTimeAgo(apiPost.createdDate) : 'now',
          content: apiPost.contentText || '',
          image: apiPost.postImageFileId ? apiClient.getImageUrl(apiPost.postImageFileId) : undefined,
          moodCompatibility: `${Math.floor(Math.random() * 30 + 70)}%`,
          likesCount: apiPost.likesCount || 0,
          commentsCount: apiPost.commentsCount || 0,
          isLikedByCurrentUser: apiPost.isLikedByCurrentUser || false,
          createdDate: apiPost.createdDate
        }
      })

      const transformedPosts = [...realDataPosts, ...mockDataPosts]

      // Sort posts by creation date (newest first)
      transformedPosts.sort((a, b) => {
        if (!a.createdDate || !b.createdDate) return 0
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      })

      console.log(`Refresh: Sorted ${transformedPosts.length} posts by creation date (newest first)`)

      // Set For You posts
      setForYouPosts(transformedPosts)

      // Get posts from followed users with real createdDate
      await getFollowingPosts()

      console.log('Posts refreshed successfully, count:', transformedPosts.length)
    } catch (error) {
      console.error('Error refreshing posts:', error)
    }
  }

  const handlePostSubmit = async () => {
    if (postContent.trim() || selectedImage) { // Allow post if there\'s content or an image
      try {
        console.log('Creating new post:', { content: postContent, hasImage: !!selectedImage })

        let postImageFileId: string | undefined = undefined

        // Upload image if selected
        if (selectedImage) {
          try {
            console.log('Starting image upload process...')

            // Convert base64 to File object
            const response = await fetch(selectedImage)
            const blob = await response.blob()

            console.log('Blob details:', {
              size: blob.size,
              type: blob.type
            })

            // Determine file type from blob or default to jpeg
            const fileType = blob.type || 'image/jpeg'
            const fileName = `post-image-${Date.now()}.${fileType.split('/')[1] || 'jpg'}`

            const file = new File([blob], fileName, {
              type: fileType,
              lastModified: Date.now()
            })

            console.log('File object created:', {
              name: file.name,
              size: file.size,
              type: file.type,
              lastModified: file.lastModified
            })

            console.log('File created:', {
              name: file.name,
              size: file.size,
              type: file.type
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
              console.log('File appended to FormData successfully')

              // Debug: Log all FormData entries
              console.log('All FormData entries:')
              for (const [key, value] of formData.entries()) {
                console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes, ${value.type})` : value)
              }
            } else {
              console.error('Invalid file object:', file)
              alert('Invalid file. Please try again.')
              return
            }

            console.log('FormData created with:', {
              StorageType: '1',
              OwnerId: currentUser?.id || "00000000-0000-0000-0000-000000000000",
              OwnerType: '1',
              FileType: '1',
              File: file.name
            })

            console.log('Uploading image...')
            const uploadResponse = await apiClient.uploadFile(formData)
            console.log('Image uploaded successfully:', uploadResponse)
            console.log('Upload response type:', typeof uploadResponse)
            console.log('Upload response keys:', Object.keys(uploadResponse || {}))
            console.log('Upload response JSON:', JSON.stringify(uploadResponse, null, 2))

            if (uploadResponse?.id) {
              postImageFileId = uploadResponse.id
              console.log('Image file ID set:', postImageFileId)
              console.log('File ID:', uploadResponse.id)
            } else {
              console.warn('No ID returned from upload response:', uploadResponse)
              console.log('Checking for other possible ID fields...')
              console.log('uploadResponse.fileId:', uploadResponse?.fileId)
              console.log('uploadResponse.attachmentId:', uploadResponse?.attachmentId)
              console.log('uploadResponse.data?.id:', uploadResponse?.data?.id)
            }
          } catch (uploadError: any) {
            console.error('Error uploading image:', uploadError)
            console.log('Upload error message:', uploadError?.message)
            console.log('Upload error status:', uploadError?.response?.status)
            console.log('Upload error statusText:', uploadError?.response?.statusText)
            console.log('Upload error data:', uploadError?.response?.data)
            console.log('Upload error response:', uploadError?.response)
            console.log('Upload error config:', uploadError?.config)

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
        console.log('=== CREATE POST DEBUG ===')
        console.log('Current user object:', currentUser)
        console.log('Current user ID:', currentUser?.id)
        console.log('Current user ID type:', typeof currentUser?.id)

        const createPostData = {
          userId: currentUser?.id || "00000000-0000-0000-0000-000000000000",
          contentText: postContent,
          postImageFileId: postImageFileId
        }

        console.log('Create post data:', createPostData)
        const response = await apiClient.createPost(createPostData)
        console.log('Post created successfully:', response)
        console.log('Created post userId:', response?.userId)
        console.log('Post response JSON:', JSON.stringify(response, null, 2))

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
