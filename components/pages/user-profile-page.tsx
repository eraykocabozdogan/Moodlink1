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
}

export function UserProfilePage({ user: userProp, onBack }: UserProfilePageProps) {
  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [postsLoading, setPostsLoading] = useState(true)
  const [postsError, setPostsError] = useState<string | null>(null)

  // UI states
  const [followLoading, setFollowLoading] = useState(false)

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

          setUser(userData)
          setIsFollowing(userData.isFollowedByCurrentUser || false)
        }
        // If userProp is an object, use it directly (for backward compatibility)
        else if (userProp && typeof userProp === 'object') {
          console.log('Using provided user object:', userProp)

          // Transform the user object to match API response format
          const transformedUser = {
            id: userProp.id || `mock-${Date.now()}`, // Generate mock ID if not present
            firstName: userProp.firstName || '',
            lastName: userProp.lastName || '',
            userName: userProp.handle || userProp.username || 'user',
            email: userProp.email || '',
            bio: userProp.bio || '',
            profileImageUrl: userProp.profileImageUrl || null,
            followersCount: parseInt(userProp.followers?.replace(/[^\d]/g, '') || '0'),
            followingCount: parseInt(userProp.following?.replace(/[^\d]/g, '') || '0'),
            postsCount: userProp.postsCount || 0,
            isFollowedByCurrentUser: false, // Default for mock data
            createdDate: userProp.createdDate || new Date().toISOString(),
          }

          setUser(transformedUser)
          setIsFollowing(false) // Default for mock data
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

  // Fetch user posts
  const fetchUserPosts = async () => {
    if (!user?.id) {
      console.log('No user ID available for fetching posts')
      return
    }

    try {
      setPostsLoading(true)
      setPostsError(null)

      console.log('Fetching posts for user ID:', user.id)

      // Try getUserPosts first
      let posts = []
      try {
        const postsResponse = await apiClient.getUserPosts(user.id)
        console.log('getUserPosts API response:', postsResponse)

        // Check both possible response formats
        posts = postsResponse.posts || postsResponse.items || []
        console.log('Posts from getUserPosts:', posts.length)

        // If getUserPosts returns empty but count > 0, there might be a pagination issue
        if (posts.length === 0 && postsResponse.count > 0) {
          console.log('getUserPosts pagination issue detected, falling back to getPosts filter')
          throw new Error('getUserPosts pagination issue')
        }
      } catch (getUserPostsError) {
        console.log('getUserPosts failed, trying fallback with getPosts filter:', getUserPostsError.message)

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
          console.log(`Filtered ${posts.length} user posts from ${allPosts.length} total posts`)
        } catch (fallbackError) {
          console.error('Fallback method also failed:', fallbackError)
          throw fallbackError
        }
      }

      console.log('Final posts array:', posts)
      console.log('Final posts length:', posts.length)

      // Transform posts to match PostCard interface
      const transformedPosts = posts?.map((post: any) => ({
        id: post.id,
        username: post.userName || post.userFirstName || user.userName || 'User',
        handle: `@${post.userName || user.userName || 'user'}`,
        time: formatTimeAgo(post.createdDate),
        content: post.contentText || '',
        image: post.imageUrls?.[0] || (post.userProfileImageUrl ? post.userProfileImageUrl : undefined),
        moodCompatibility: "90%", // TODO: Calculate from API
        likesCount: post.likesCount || 0,
        commentsCount: post.commentsCount || 0,
        isLikedByCurrentUser: post.isLikedByCurrentUser || false,
      })) || []

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
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    return `${Math.floor(diffInSeconds / 86400)}d`
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
          setUser({ ...user, followersCount: (user.followersCount || 1) - 1 })
        }
      } else {
        // Follow
        const followData: CreateFollowCommand = {
          followerId: currentUser.id,
          followedId: user.id,
        }

        const followResponse = await apiClient.createFollow(followData)
        console.log('Follow created:', followResponse)

        setIsFollowing(true)
        setFollowId(followResponse.id)
        setUser({ ...user, followersCount: (user.followersCount || 0) + 1 })
      }
    } catch (err: any) {
      console.error('Error toggling follow:', err)
      // Revert the state on error
      setIsFollowing(!isFollowing)
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
                {user.username.substring(0, 2).toUpperCase()}
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
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Message
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
            <PostCard key={post.id} post={post} />
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
