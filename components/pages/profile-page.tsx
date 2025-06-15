"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PostCard } from "@/components/post-card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProfileImage } from "@/components/ui/profile-image"
import { Check, X } from "lucide-react"
import apiClient from "@/lib/apiClient"
import {
  GetByIdUserResponse,
  GetUserPostsResponse,
  UpdateUserCommand,
  UpdateUserFromAuthCommand,
  FileAttachmentResponse,
  StorageType,
  OwnerType,
  FileType
} from "@/lib/types/api"

interface ProfilePageProps {
  user?: any
}

export function ProfilePage({ user: initialUser }: ProfilePageProps) {
  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [postsLoading, setPostsLoading] = useState(true)
  const [postsError, setPostsError] = useState<string | null>(null)

  // UI states
  const [isEditing, setIsEditing] = useState(false)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [selectedProfileImageFile, setSelectedProfileImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Data states
  const [user, setUser] = useState<any>(null)
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    bio: "",
  })

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)

        const userData = await apiClient.getUserFromAuth()
        console.log('Fetched user data:', userData)

        setUser(userData)
        setEditForm({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          userName: userData.userName || "",
          bio: userData.bio || "",
        })
      } catch (err: any) {
        console.error('Error fetching user data:', err)
        setError('Error loading user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Fetch user posts
  const fetchUserPosts = async () => {
    if (!user?.id) {
      console.log('No user ID available for fetching posts')
      return
    }

    try {
      setPostsLoading(true)
      setPostsError(null)

      console.log('=== PROFILE PAGE USER POSTS DEBUG ===')
      console.log('Current user object:', user)
      console.log('User ID for posts fetch:', user.id)
      console.log('User ID type:', typeof user.id)

      // Try getUserPosts first
      let posts = []
      try {
        const postsResponse = await apiClient.getUserPosts(user.id)
        console.log('getUserPosts API response:', postsResponse)
        console.log('getUserPosts response stringified:', JSON.stringify(postsResponse, null, 2))

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
        image: post.postImageFileId || post.imageUrls?.[0] || undefined,
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

  const handleEditToggle = async () => {
    if (isEditing) {
      await handleSaveProfile()
    } else {
      setIsEditing(true)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      setError(null)

      let profileImageFileId = user.profileImageFileId

      // Upload new profile image if selected
      if (selectedProfileImageFile) {
        console.log('Uploading profile image...')
        const formData = new FormData()
        formData.append('File', selectedProfileImageFile)
        formData.append('StorageType', StorageType.Cloud.toString())
        formData.append('OwnerId', user.id)
        formData.append('OwnerType', OwnerType.User.toString())
        formData.append('FileType', FileType.Image.toString())

        const uploadResponse: FileAttachmentResponse = await apiClient.uploadFile(formData)
        console.log('Profile image uploaded:', uploadResponse)
        profileImageFileId = uploadResponse.id
      }

      // Update user profile
      const updateData: UpdateUserCommand = {
        id: user.id,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        userName: editForm.userName,
        email: user.email,
        password: "", // Empty for profile update
        dateOfBirth: user.dateOfBirth || user.birthDate,
        bio: editForm.bio,
        profileImageFileId: profileImageFileId,
      }

      console.log('Updating user profile:', updateData)

      let updatedUser;
      try {
        // Try the main endpoint first
        updatedUser = await apiClient.updateUser(updateData)
        console.log('Profile updated via /api/Users:', updatedUser)
      } catch (mainError) {
        console.log('Main endpoint failed, trying FromAuth endpoint:', mainError)

        // Fallback to FromAuth endpoint
        const fromAuthData = {
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          userName: editForm.userName,
          bio: editForm.bio,
          profileImageFileId: profileImageFileId,
        }

        updatedUser = await apiClient.updateUserFromAuth(fromAuthData)
        console.log('Profile updated via /api/Users/FromAuth:', updatedUser)
      }

      // Update local state
      setUser({
        ...user,
        ...updatedUser,
        profileImageUrl: selectedProfileImageFile ? profileImagePreview : user.profileImageUrl,
      })

      // Reset form states
      setSelectedProfileImageFile(null)
      setProfileImagePreview(null)
      setIsEditing(false)

      // Refresh posts to reflect any changes
      fetchUserPosts()

    } catch (err: any) {
      console.error('Error saving profile:', err)
      console.error('Error details:', err.response?.data || err.message)

      let errorMessage = 'Error saving profile'
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.data?.errors) {
        errorMessage = err.response.data.errors.join(', ')
      } else if (err.message) {
        errorMessage = err.message
      }

      setError(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditForm({
      ...editForm,
      [name]: value,
    })
  }

  const handleCancelEdit = () => {
    if (!user) return

    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      userName: user.userName || "",
      bio: user.bio || "",
    })
    setProfileImagePreview(null)
    setSelectedProfileImageFile(null)
    setIsEditing(false)
    setError(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedProfileImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-foreground">Profile</h1>
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
            <Skeleton className="h-10 w-32 mx-auto" />
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
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-foreground">Profile</h1>
          </div>
        </div>

        {/* Error State */}
        <div className="p-8 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Try Again
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
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 mx-4 mt-4 rounded">
          {error}
        </div>
      )}

      {/* Profile Info */}
      <div className="bg-card border-b border-border p-6">
        <div className="text-center space-y-4">
          {/* Profile Picture Area */}
          <div className="w-24 h-24 mx-auto"> {/* Container for sizing */}
            {isEditing ? (
              <>
                <label
                  htmlFor="profileImageInput"
                  className="relative group block w-24 h-24 rounded-full cursor-pointer overflow-hidden"
                >
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Profile Picture Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ProfileImage
                      src={user.profileImageFileId || user.profileImageUrl}
                      alt={user.userName || 'User'}
                      size="md"
                      fallbackText="Select Image"
                      className=""
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-opacity">
                    <span className="text-white text-sm opacity-0 group-hover:opacity-100">Change</span>
                  </div>
                </label>
                <input
                  type="file"
                  id="profileImageInput"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            ) : (
              <ProfileImage
                src={user.profileImageFileId || user.profileImageUrl}
                alt={user.userName || 'User'}
                size="md"
                fallbackText={user.firstName || user.userName || 'U'}
                className="mx-auto"
              />
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Input
                  name="firstName"
                  value={editForm.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="text-center bg-background border-border text-foreground"
                />
                <Input
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="text-center bg-background border-border text-foreground"
                />
                <Input
                  name="userName"
                  value={editForm.userName}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className="text-center bg-background border-border text-foreground"
                />
              </div>
              <Textarea
                name="bio"
                value={editForm.bio}
                onChange={handleInputChange}
                placeholder="Bio"
                className="min-h-[100px] bg-background border-border text-foreground"
              />
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={handleEditToggle}
                  disabled={saving}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-primary-foreground"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted"
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
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
              <Button
                onClick={handleEditToggle}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-primary-foreground"
              >
                Edit Profile
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="bg-card">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h4 className="font-bold text-foreground">My Posts</h4>
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
            <p className="text-sm mt-1">Share your first post!</p>
          </div>
        )}
      </div>
    </div>
  )
}
