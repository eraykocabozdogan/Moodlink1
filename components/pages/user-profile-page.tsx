"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/post-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import apiClient from "@/lib/apiClient"
import {
  GetByIdUserResponse,
  GetUserPostsResponse,
  CreateFollowCommand,
  UUID
} from "@/lib/types/api"

interface UserProfilePageProps {
  user: any // User object or user ID
  onBack: () => void
  onMessage?: (user: any) => void // Callback for message button
}

export function UserProfilePage({ user: userProp, onBack, onMessage }: UserProfilePageProps) {
  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [postsLoading, setPostsLoading] = useState(true)
  const [postsError, setPostsError] = useState<string | null>(null)

  // UI states
  const [followLoading, setFollowLoading] = useState(false)
  const [messageLoading, setMessageLoading] = useState(false)

  // Data states
  const [user, setUser] = useState<any>(null)
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followId, setFollowId] = useState<string | null>(null)

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await apiClient.getUserFromAuth()
        setCurrentUser(userData)
      } catch (err: any) {
        console.error('Error fetching current user:', err)
      }
    }

    fetchCurrentUser()
  }, [])

  // Fetch real followers count for a user
  const fetchFollowersCount = async (userId: UUID): Promise<number> => {
    try {
      console.log(`🔍 Fetching followers count for user ${userId.slice(0, 8)}...`)
      const followsResponse = await apiClient.getFollows({ PageIndex: 0, PageSize: 1000 })
      const followers = followsResponse.items?.filter((follow: any) => follow.followedId === userId) || []
      const count = followers.length
      console.log(`✅ User ${userId.slice(0, 8)} has ${count} followers`)
      return count
    } catch (error) {
      console.error(`❌ Error fetching followers count for ${userId}:`, error)
      return 0
    }
  }

  // Fetch real following count for a user
  const fetchFollowingCount = async (userId: UUID): Promise<number> => {
    try {
      console.log(`🔍 Fetching following count for user ${userId.slice(0, 8)}...`)
      const followsResponse = await apiClient.getFollows({ PageIndex: 0, PageSize: 1000 })
      const following = followsResponse.items?.filter((follow: any) => follow.followerId === userId) || []
      const count = following.length
      console.log(`✅ User ${userId.slice(0, 8)} is following ${count} users`)
      return count
    } catch (error) {
      console.error(`❌ Error fetching following count for ${userId}:`, error)
      return 0
    }
  }

  // Check if current user is following the target user
  const checkFollowStatus = async (targetUserId: UUID) => {
    if (!currentUser?.id) {
      console.log('No current user, setting follow status to false')
      setIsFollowing(false)
      return
    }

    try {
      console.log('🔍 Checking follow status for:', { currentUserId: currentUser.id, targetUserId })

      // Get all follows and check if current user follows target user
      const followsResponse = await apiClient.getFollows({ PageIndex: 0, PageSize: 1000 })
      const followRelation = followsResponse.items?.find(
        (follow: any) => follow.followerId === currentUser.id && follow.followedId === targetUserId
      )

      const isFollowingUser = !!followRelation
      console.log('✅ Follow status check result:', { isFollowingUser, followRelation })

      setIsFollowing(isFollowingUser)
      if (followRelation) {
        setFollowId(followRelation.id)
      }
    } catch (error) {
      console.error('❌ Error checking follow status:', error)
      setIsFollowing(false) // Default to false on error
    }
  }

  // Fetch user data by ID or use provided user object
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)

        // If userProp is a string (ID), fetch user data
        if (typeof userProp === 'string') {
          const userData = await apiClient.getUserById(userProp as UUID)
          console.log('Fetched user data:', userData)

          // Fetch real followers and following counts
          const [followersCount, followingCount] = await Promise.all([
            fetchFollowersCount(userProp as UUID),
            fetchFollowingCount(userProp as UUID)
          ])

          // Enhance user data with real counts
          const enhancedUserData = {
            ...userData,
            followersCount,
            followingCount
          }

          console.log('Enhanced user data with real counts:', enhancedUserData)
          setUser(enhancedUserData)

          // Don't check follow status here, wait for currentUser to load
        }
        // If userProp is an object, use it directly (for backward compatibility)
        else if (userProp && typeof userProp === 'object') {
          console.log('Using provided user object:', userProp)

          // For user objects, try to get real counts if we have a real ID
          let followersCount = 0
          let followingCount = 0

          if (userProp.id && !userProp.id.startsWith('mock-')) {
            // Real user - fetch real counts
            try {
              [followersCount, followingCount] = await Promise.all([
                fetchFollowersCount(userProp.id),
                fetchFollowingCount(userProp.id)
              ])
              console.log(`Real counts for user object: ${followersCount} followers, ${followingCount} following`)
            } catch (error) {
              console.log('Failed to fetch real counts for user object, using defaults')
              followersCount = 0
              followingCount = 0
            }
          } else {
            // Mock user - use provided values or defaults
            followersCount = parseInt(userProp.followers?.replace(/[^\d]/g, '') || '0')
            followingCount = parseInt(userProp.following?.replace(/[^\d]/g, '') || '0')
            console.log(`Mock counts for user object: ${followersCount} followers, ${followingCount} following`)
          }

          // Transform the user object to match API response format
          const transformedUser = {
            id: userProp.id, // Use real ID, don't generate mock
            firstName: userProp.firstName || '',
            lastName: userProp.lastName || '',
            userName: userProp.handle || userProp.username || 'user',
            email: userProp.email || '',
            bio: userProp.bio || '',
            profileImageUrl: userProp.profileImageUrl || null,
            followersCount,
            followingCount,
            postsCount: userProp.postsCount || 0,
            isFollowedByCurrentUser: false, // Default for mock data
            createdDate: userProp.createdDate || new Date().toISOString(),
          }

          setUser(transformedUser)

          // Don't check follow status here, wait for currentUser to load
          setIsFollowing(false) // Default until currentUser loads
        }
      } catch (err: any) {
        console.error('Error fetching user data:', err)
        setError('Error loading user data')
      } finally {
        setLoading(false)
      }
    }

    if (userProp) {
      fetchUserData()
    }
  }, [userProp])

  // Check follow status when both currentUser and user are loaded
  useEffect(() => {
    if (currentUser?.id && user?.id && !user.id.startsWith('mock-')) {
      console.log('🔄 Both currentUser and user loaded, checking follow status...')
      checkFollowStatus(user.id)
    }
  }, [currentUser?.id, user?.id])

  // Fetch user posts
  const fetchUserPosts = async () => {
    if (!user?.id) {
      console.log('No user ID available for fetching posts')
      return
    }

    // If it's a mock ID, show empty posts
    if (user.id.startsWith('mock-')) {
      console.log('Mock user detected, showing empty posts')
      setUserPosts([])
      return
    }

    try {
      setPostsLoading(true)
      setPostsError(null)

      console.log('Fetching posts for user ID:', user.id)

      // Use getUserPosts with pagination to get posts with createdDate
      let posts = []
      try {
        console.log(`🔄 Getting posts for user ${user.id.slice(0, 8)} with createdDate...`)
        const postsResponse = await apiClient.getUserPosts(user.id, { PageIndex: 0, PageSize: 50 })
        console.log('getUserPosts API response:', postsResponse)

        // Check both possible response formats
        posts = postsResponse.posts || postsResponse.items || []
        console.log(`✅ Got ${posts.length} posts from getUserPosts`)

        // Debug: Check if posts have createdDate
        if (posts.length > 0) {
          console.log('📅 Sample post from getUserPosts:', {
            id: posts[0].id?.slice(0, 8),
            createdDate: posts[0].createdDate,
            hasCreatedDate: !!posts[0].createdDate,
            fields: Object.keys(posts[0])
          })
        }

      } catch (getUserPostsError) {
        console.error('❌ getUserPosts failed:', getUserPostsError)
        console.log('⚠️ Falling back to getPosts filter method...')

        // Fallback: Get all posts and filter by user ID
        try {
          let allPosts = []
          let pageIndex = 0
          let hasMore = true

          while (hasMore && pageIndex < 5) { // Limit to 5 pages to avoid infinite loop
            const postsResponse = await apiClient.getPosts({ PageIndex: pageIndex, PageSize: 20 })
            const pagePosts = postsResponse.items || postsResponse.posts || []

            if (pagePosts.length > 0) {
              allPosts = [...allPosts, ...pagePosts]
              hasMore = postsResponse.hasNext || postsResponse.hasMore || false
              pageIndex++
            } else {
              hasMore = false
            }
          }

          // Filter posts by current user ID
          posts = allPosts.filter((post: any) => post.userId === user.id)
          console.log(`📋 Filtered ${posts.length} user posts from ${allPosts.length} total posts`)
        } catch (fallbackError) {
          console.error('❌ Fallback method also failed:', fallbackError)
          throw fallbackError
        }
      }

      console.log('Final posts array:', posts)
      console.log('Final posts length:', posts.length)

      // Transform posts to match PostCard interface
      const transformedPosts = posts?.map((post: any) => {
        // Use profile user info for all posts since they're all from this user
        const displayName = user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.userName || 'User'
        const handle = user.userName || 'user'

        return {
          id: post.id,
          username: displayName,
          handle: `@${handle}`,
          time: post.createdDate ? formatTimeAgo(post.createdDate) : 'now',
          content: post.contentText || '',
          image: post.postImageFileId ? apiClient.getImageUrl(post.postImageFileId) : undefined,
          moodCompatibility: "90%", // TODO: Calculate from API
          likesCount: post.likesCount || 0,
          commentsCount: post.commentsCount || 0,
          isLikedByCurrentUser: post.isLikedByCurrentUser || false,
        }
      }) || []

      console.log('Transformed posts:', transformedPosts)
      setUserPosts(transformedPosts)
    } catch (err: any) {
      console.error('Error fetching user posts:', err)
      console.error('Error details:', err.response?.data || err.message)
      setPostsError('Error loading posts')
    } finally {
      setPostsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserPosts()
  }, [user?.id])

  // Listen for global posts update events
  useEffect(() => {
    const handlePostsUpdated = () => {
      console.log('Posts updated event received, refreshing user posts...')
      fetchUserPosts()
    }

    window.addEventListener('postsUpdated', handlePostsUpdated)

    return () => {
      window.removeEventListener('postsUpdated', handlePostsUpdated)
    }
  }, [user?.id])

  // Helper function to format time
  const formatTimeAgo = (dateString: string) => {
    if (!dateString) {
      console.warn('formatTimeAgo: dateString is empty or undefined')
      return 'now'
    }

    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('formatTimeAgo: Invalid date string:', dateString)
      return 'now'
    }

    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    // Handle negative differences (future dates)
    if (diffInSeconds < 0) {
      console.warn('formatTimeAgo: Date is in the future:', dateString)
      return 'now'
    }

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    return `${Math.floor(diffInSeconds / 86400)}d`
  }

  const handleMessage = async () => {
    if (!currentUser || !user || messageLoading) return

    try {
      setMessageLoading(true)

      if (onMessage) {
        // Use the callback if provided
        onMessage(user)
      } else {
        // Fallback: Create direct message
        console.log('Creating direct message with user:', user)

        const response = await apiClient.sendDirectMessage({
          senderUserId: currentUser.id,
          receiverUserId: user.id,
          content: "" // Empty content - just create the chat
        })

        console.log('Direct message created:', response)

        // You could navigate to the chat here or show a success message
        alert('Chat created! You can now send messages.')
      }
    } catch (error) {
      console.error('Error creating message:', error)
      alert('Failed to create chat. Please try again.')
    } finally {
      setMessageLoading(false)
    }
  }

  const handleFollowToggle = async () => {
    if (!currentUser || !user || followLoading) return

    try {
      setFollowLoading(true)

      if (isFollowing) {
        // Unfollow - we need to find the follow relationship ID
        // For now, we'll use a simple approach and let the backend handle it
        const followsResponse = await apiClient.getFollows({ PageIndex: 0, PageSize: 1000 })
        const followRelation = followsResponse.items?.find(
          (follow: any) => follow.followerId === currentUser.id && follow.followedId === user.id
        )

        if (followRelation) {
          await apiClient.deleteFollow(followRelation.id)
          setIsFollowing(false)

          // Fetch real updated followers count
          const updatedFollowersCount = await fetchFollowersCount(user.id)
          setUser({ ...user, followersCount: updatedFollowersCount })
          console.log(`✅ Unfollowed user, updated followers count: ${updatedFollowersCount}`)
        }
      } else {
        // Follow - optimistically update UI first
        setIsFollowing(true)

        const followData: CreateFollowCommand = {
          followerId: currentUser.id,
          followedId: user.id,
        }

        console.log('🔄 Creating follow with data:', followData)
        console.log('🔄 Current user:', currentUser)
        console.log('🔄 Target user:', user)
        console.log('🔄 Follow data types:', {
          followerId: typeof followData.followerId,
          followedId: typeof followData.followedId,
          followerIdValue: followData.followerId,
          followedIdValue: followData.followedId
        })

        const followResponse = await apiClient.createFollow(followData)
        console.log('✅ Follow created:', followResponse)

        setFollowId(followResponse.id)

        // Fetch real updated followers count
        const updatedFollowersCount = await fetchFollowersCount(user.id)
        setUser({ ...user, followersCount: updatedFollowersCount })
        console.log(`✅ Followed user, updated followers count: ${updatedFollowersCount}`)
      }
    } catch (err: any) {
      console.error('❌ Error toggling follow:', err)

      // Show user-friendly error message
      let errorMessage = 'Failed to follow user.'
      let shouldSetFollowing = false

      if (err.response?.status === 500) {
        // Check if error message indicates duplicate follow
        const errorData = err.response?.data
        if (errorData && (
          JSON.stringify(errorData).toLowerCase().includes('duplicate') ||
          JSON.stringify(errorData).toLowerCase().includes('already') ||
          JSON.stringify(errorData).toLowerCase().includes('exists') ||
          JSON.stringify(errorData).toLowerCase().includes('constraint')
        )) {
          errorMessage = 'You are already following this user.'
          shouldSetFollowing = true // Set as following since it already exists
        } else {
          errorMessage = 'Server error. Please try again later.'
        }
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid request. Please try again.'
      } else if (err.response?.status === 409) {
        errorMessage = 'You are already following this user.'
        shouldSetFollowing = true
      }

      alert(errorMessage)

      // If it's a duplicate follow error, keep as following
      if (shouldSetFollowing) {
        setIsFollowing(true)
      } else {
        // Revert to original state on error
        setIsFollowing(false) // Since we optimistically set to true, revert to false
      }
    } finally {
      setFollowLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="p-2 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Profile</h1>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Profile Info Skeleton */}
        <div className="bg-card border-b border-border p-6">
          <div className="text-center space-y-4">
            <Skeleton className="w-24 h-24 rounded-full mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
            <Skeleton className="h-16 w-full max-w-md mx-auto" />
            <div className="flex justify-center space-x-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-20 w-full max-w-md mx-auto" />
            <div className="flex justify-center space-x-3">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>

        {/* Posts Skeleton */}
        <div className="bg-card">
          <div className="p-4 border-b border-border">
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="p-4 space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !user) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="p-2 hover:bg-muted rounded-full">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Profile</h1>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Error State */}
        <div className="p-8 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Tekrar Dene
          </Button>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
          <div className="w-10"></div>
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
                {(user.userName || user.firstName || user.lastName || 'U').substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.userName || 'User'
              }
            </h3>
            <p className="text-muted-foreground">@{user.userName || 'user'}</p>
          </div>

          {user.bio && <p className="text-muted-foreground max-w-md mx-auto">{user.bio}</p>}

          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">{user.followersCount || 0}</strong> Followers
            </span>
            <span>
              <strong className="text-foreground">{user.followingCount || 0}</strong> Following
            </span>
          </div>

          <div className="bg-muted/50 p-4 rounded-xl">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Posts:</strong>{" "}
              <span>{user.postsCount || 0} posts</span>
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong className="text-foreground">Joined:</strong>{" "}
              <span>{user.createdDate ? new Date(user.createdDate).toLocaleDateString('en-US') : 'Unknown'}</span>
            </p>
          </div>

          <div className="flex justify-center space-x-3">
            <Button
              onClick={handleFollowToggle}
              disabled={followLoading || !currentUser}
              className={isFollowing ? "bg-muted text-foreground border border-border hover:bg-muted/80" : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"}
            >
              {followLoading ? "Loading..." : (isFollowing ? "Following" : "Follow")}
            </Button>
            <Button
              onClick={handleMessage}
              disabled={messageLoading || !currentUser}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              {messageLoading ? "Creating..." : "Message"}
            </Button>
          </div>
        </div>
      </div>

      {/* Mood Compatibility */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-foreground">Mood Compatibility</h4>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full">
            <span className="text-sm font-medium">%{Math.floor(Math.random() * 30) + 70}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          You have high mood compatibility with this user. You enjoy similar activities!
        </p>
      </div>

      {/* Posts */}
      <div className="bg-card">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h4 className="font-bold text-foreground">Posts</h4>
          <Button
            onClick={fetchUserPosts}
            variant="outline"
            size="sm"
            disabled={postsLoading}
          >
            {postsLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        {postsLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : postsError ? (
          <div className="p-4 text-center">
            <p className="text-destructive mb-2">{postsError}</p>
            <Button
              onClick={fetchUserPosts}
              variant="outline"
              size="sm"
            >
              Try Again
            </Button>
          </div>
        ) : userPosts.length > 0 ? (
          userPosts.map((post) => (
            <PostCard key={post.id} post={post} currentUser={currentUser} />
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <p>No posts yet.</p>
            <p className="text-sm mt-1">This user hasn't shared any posts yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
