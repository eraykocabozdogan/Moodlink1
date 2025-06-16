"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Heart, MessageCircle, Share } from "lucide-react"
import Image from "next/image"
import { ProfileImage } from "@/components/ui/profile-image"
import apiClient from "@/lib/apiClient"

interface PostCardProps {
  post: {
    id: string
    username: string
    handle?: string
    time: string
    content: string
    image?: string
    moodCompatibility: string
    matchedMood?: string // Add matched mood name
    community?: string
    likesCount: number
    commentsCount: number
    isLikedByCurrentUser: boolean
    userProfileImageUrl?: string
    userData?: {
      id: string
      userName?: string
      firstName?: string
      lastName?: string
      fullName?: string
      profilePictureFileId?: string
      profileImageUrl?: string
    }
  }
  currentUser?: any // Add currentUser prop
  onUserClick?: (user: any) => void
  onPostUpdate?: (postId: string, updates: { likesCount?: number; isLikedByCurrentUser?: boolean; commentsCount?: number }) => void
}

// Helper functions for localStorage persistence
const getStoredPostData = (postId: string) => {
  try {
    const stored = localStorage.getItem(`post_${postId}`)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const setStoredPostData = (postId: string, data: { liked?: boolean; likeCount?: number; commentsCount?: number }) => {
  try {
    const existing = getStoredPostData(postId) || {}
    const updated = { ...existing, ...data }
    localStorage.setItem(`post_${postId}`, JSON.stringify(updated))
  } catch (error) {
    console.error('Error storing post data:', error)
  }
}

export function PostCard({ post, currentUser: propCurrentUser, onUserClick, onPostUpdate }: PostCardProps) {
  // Initialize state with stored data if available
  const storedData = getStoredPostData(post.id)
  const [liked, setLiked] = useState(storedData?.liked ?? post.isLikedByCurrentUser)
  const [likeCount, setLikeCount] = useState(storedData?.likeCount ?? post.likesCount)
  const [commentsCount, setCommentsCount] = useState(storedData?.commentsCount ?? post.commentsCount)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<any[]>([])
  const [commentsLoaded, setCommentsLoaded] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(propCurrentUser || null)
  const [showImageModal, setShowImageModal] = useState(false)

  // Debug: Log modal state changes
  useEffect(() => {
    console.log('🔄 Modal state changed:', showImageModal, 'for post:', post.id)
  }, [showImageModal, post.id])

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

  // Update local state when post prop changes, but preserve stored data
  useEffect(() => {
    const storedData = getStoredPostData(post.id)
    if (storedData) {
      // Use stored data if available
      setLiked(storedData.liked ?? post.isLikedByCurrentUser)
      setLikeCount(storedData.likeCount ?? post.likesCount)
      setCommentsCount(storedData.commentsCount ?? post.commentsCount)
    } else {
      // Use post data if no stored data
      setLiked(post.isLikedByCurrentUser)
      setLikeCount(post.likesCount)
      setCommentsCount(post.commentsCount)
    }
  }, [post.id, post.isLikedByCurrentUser, post.likesCount, post.commentsCount])

  // Get current user on component mount (only if not provided as prop)
  useEffect(() => {
    if (!propCurrentUser) {
      const getCurrentUser = async () => {
        try {
          const user = await apiClient.getUserFromAuth()
          setCurrentUser(user)
        } catch (error) {
          console.error('Error getting current user:', error)
        }
      }
      getCurrentUser()
    } else {
      setCurrentUser(propCurrentUser)
    }
  }, [propCurrentUser])

  // Fetch comments when showComments becomes true
  useEffect(() => {
    if (showComments && !commentsLoaded) {
      fetchComments()
    }
  }, [showComments, commentsLoaded])

  const fetchComments = async () => {
    try {
      console.log('Fetching comments for post:', post.id)
      const response = await apiClient.getPostComments(post.id)
      console.log('Comments response:', response)

      // Transform comments with user data
      const transformedComments = await Promise.all(
        (response.comments || []).map(async (comment: any) => {
          let userInfo = null
          let username = comment.userName || 'User'

          // Try to fetch user info for profile picture
          if (comment.userId) {
            try {
              userInfo = await apiClient.getUserById(comment.userId)
              const fullName = `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim()
              username = fullName || userInfo.userName || 'User'
            } catch (userError) {
              // Keep default username
            }
          }

          return {
            id: comment.id,
            username: username,
            text: comment.content || '',
            time: comment.createdDate ? formatTimeAgo(comment.createdDate) : 'now',
            userId: comment.userId,
            userInfo: userInfo
          }
        })
      )

      setComments(transformedComments)
      setCommentsLoaded(true)
    } catch (error) {
      console.error('Error fetching comments:', error)
      // Keep default comments on error
      setComments([
        { id: 1, username: "Ali", text: "Great post!", time: "2m", userId: null, userInfo: null },
        { id: 2, username: "Ayşe", text: "I agree!", time: "5m", userId: null, userInfo: null },
      ])
      setCommentsLoaded(true)
    }
  }

  const handleLike = async () => {
    if (!currentUser) {
      console.error('No current user found for like action')
      return
    }

    console.log('=== LIKE ACTION DEBUG ===')
    console.log('Post ID:', post.id)
    console.log('Current user ID:', currentUser.id)
    console.log('Current liked state:', liked)
    console.log('Current like count:', likeCount)

    try {
      if (liked) {
        // Unlike the post - find and delete the like
        console.log('Attempting to unlike post...')
        try {
          const likesResponse = await apiClient.getPostLikes(post.id)
          console.log('Post likes response:', likesResponse)
          console.log('Likes array:', likesResponse.likes)

          // Find the current user's like
          const userLike = likesResponse.likes?.find((like: any) => like.userId === currentUser.id)
          console.log('User like found:', userLike)

          if (userLike) {
            console.log('Deleting like with ID:', userLike.id)
            await apiClient.deleteLike(userLike.id)
            setLiked(false)
            setLikeCount(likeCount - 1)
            console.log('Post unliked successfully')

            // Store in localStorage for persistence
            setStoredPostData(post.id, { liked: false, likeCount: likeCount - 1 })

            // Notify parent component of the update
            onPostUpdate?.(post.id, {
              likesCount: likeCount - 1,
              isLikedByCurrentUser: false
            })
          } else {
            console.log('User like not found in response, updating local state only')
            setLiked(false)
            setLikeCount(likeCount - 1)

            // Store in localStorage for persistence
            setStoredPostData(post.id, { liked: false, likeCount: likeCount - 1 })

            onPostUpdate?.(post.id, {
              likesCount: likeCount - 1,
              isLikedByCurrentUser: false
            })
          }
        } catch (error: any) {
          console.error('Error unliking post:', error)
          console.error('Unlike error details:', error.response?.data || error.message)
          // Still update local state for better UX
          setLiked(false)
          setLikeCount(likeCount - 1)

          // Store in localStorage for persistence even on error
          setStoredPostData(post.id, { liked: false, likeCount: likeCount - 1 })

          onPostUpdate?.(post.id, {
            likesCount: likeCount - 1,
            isLikedByCurrentUser: false
          })
        }
      } else {
        // Like the post
        console.log('Attempting to like post...')
        try {
          const likeData = {
            userId: currentUser.id,
            postId: post.id
          }
          console.log('Like data:', likeData)

          const response = await apiClient.createLike(likeData)
          console.log('Create like response:', response)

          setLiked(true)
          setLikeCount(likeCount + 1)
          console.log('Post liked successfully')

          // Store in localStorage for persistence
          setStoredPostData(post.id, { liked: true, likeCount: likeCount + 1 })

          // Notify parent component of the update
          onPostUpdate?.(post.id, {
            likesCount: likeCount + 1,
            isLikedByCurrentUser: true
          })
        } catch (error: any) {
          console.error('Error liking post:', error)
          console.error('Like error details:', error.response?.data || error.message)
          // Revert optimistic update on error
          setLiked(false)
          setLikeCount(likeCount)
        }
      }
    } catch (error: any) {
      console.error('Error handling like:', error)
      console.error('General like error details:', error.response?.data || error.message)
      // Revert optimistic update on error
      setLiked(post.isLikedByCurrentUser)
      setLikeCount(post.likesCount)
    }
  }



  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${post.username} - MoodLink`,
        text: post.content,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied!")
    }
  }

  const handleComment = async () => {
    if (!comment.trim()) {
      console.log('Comment is empty, not submitting')
      return
    }

    if (!currentUser) {
      console.error('No current user found for comment action')
      return
    }

    console.log('=== COMMENT ACTION DEBUG ===')
    console.log('Post ID:', post.id)
    console.log('Current user ID:', currentUser.id)
    console.log('Comment content:', comment)
    console.log('Current comments count:', commentsCount)

    try {
      const commentData = {
        postId: post.id,
        userId: currentUser.id,
        content: comment,
        parentCommentId: undefined
      }
      console.log('Comment data:', commentData)

      const response = await apiClient.createComment(commentData)
      console.log('Comment created successfully:', response)
      console.log('Comment response JSON:', JSON.stringify(response, null, 2))

      // Add new comment to local state
      const newComment = {
        id: response.id,
        username: "You",
        text: comment,
        time: "now",
        userId: currentUser.id,
        userInfo: currentUser
      }
      console.log('Adding new comment to local state:', newComment)

      setComments([newComment, ...comments])
      setCommentsCount(commentsCount + 1) // Update comments count
      setComment("")

      // Store in localStorage for persistence
      setStoredPostData(post.id, { commentsCount: commentsCount + 1 })

      // Notify parent component of the comment count update
      onPostUpdate?.(post.id, {
        commentsCount: commentsCount + 1
      })

      console.log('Comment added successfully, new count:', commentsCount + 1)
    } catch (error: any) {
      console.error('Error creating comment:', error)
      console.error('Comment error details:', error.response?.data || error.message)
      console.error('Comment error status:', error.response?.status)
      alert('Error adding comment.')
    }
  }

  return (
    <div className="bg-card text-card-foreground border-b border-border p-4 hover:bg-muted/50 transition-colors">
      <div className="flex space-x-3">
        {/* Avatar */}
        <ProfileImage
          src={post.userData?.profilePictureFileId ||
               post.userData?.profileImageFileId ||
               post.userData?.profilePictureUrl ||
               post.userData?.profileImageUrl ||
               post.userProfileImageUrl ||
               (currentUser?.id === post.userData?.id ? (currentUser?.profilePictureFileId || currentUser?.profileImageFileId || currentUser?.profilePictureUrl || currentUser?.profileImageUrl) : null)}
          alt={post.username}
          size="sm"
          fallbackText={post.username}
          className="flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-2">
            <span
              className="font-bold text-foreground cursor-pointer hover:underline"
              onClick={() => {
                if (onUserClick) {
                  if (post.userData?.id) {
                    // Use real user data if available
                    console.log('Using real user data for profile:', post.userData)
                    onUserClick({
                      id: post.userData.id,
                      username: post.username,
                      handle: post.handle?.replace('@', '') || 'user',
                      userName: post.userData.userName,
                      firstName: post.userData.firstName,
                      lastName: post.userData.lastName,
                      fullName: post.userData.fullName,
                      followers: (Math.floor(Math.random() * 500) + 100).toString(),
                      following: (Math.floor(Math.random() * 200) + 50).toString(),
                      bio: `${post.username}'s profile. MoodLink user.`,
                      moods: [
                        { name: "Energetic", percentage: Math.floor(Math.random() * 30 + 50) + "%" },
                        { name: "Happy", percentage: Math.floor(Math.random() * 20 + 60) + "%" },
                      ],
                      badges: ["🏆", "🎯"],
                    })
                  } else {
                    // Fallback: Create mock profile with username
                    console.log('No real user data, creating mock profile for:', post.username)
                    onUserClick({
                      id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                      username: post.username,
                      handle: post.handle?.replace('@', '') || 'user',
                      userName: post.username,
                      firstName: post.username,
                      lastName: '',
                      fullName: post.username,
                      followers: (Math.floor(Math.random() * 500) + 100).toString(),
                      following: (Math.floor(Math.random() * 200) + 50).toString(),
                      bio: `${post.username}'s profile. MoodLink user.`,
                      moods: [
                        { name: "Energetic", percentage: Math.floor(Math.random() * 30 + 50) + "%" },
                        { name: "Happy", percentage: Math.floor(Math.random() * 20 + 60) + "%" },
                      ],
                      badges: ["🏆", "🎯"],
                    })
                  }
                }
              }}
            >
              {/* Display full name if available, otherwise username */}
              {post.userData?.firstName && post.userData?.lastName
                ? `${post.userData.firstName} ${post.userData.lastName}`
                : post.username}
            </span>
            {post.handle && <span className="text-muted-foreground text-sm">{post.handle}</span>}
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{post.time}</span>
          </div>

          {/* Content */}
          <p className="text-foreground mb-3">{post.content}</p>

          {/* Image */}
          {post.image && (
            <div
              className="mb-3 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('🖼️ Image clicked, opening modal for:', post.image)
                setShowImageModal(true)
              }}
            >
              <Image
                src={
                  post.image.startsWith('/api/files/')
                    ? `https://moodlinkbackend.onrender.com/api/FileAttachments/download/${post.image.split('/').pop()}`
                    : post.image || "/placeholder.svg"
                }
                alt="Post image"
                width={400}
                height={200}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  // Show placeholder instead of hiding
                  const parent = e.currentTarget.parentElement
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-48 bg-muted rounded-lg flex items-center justify-center cursor-pointer" onclick="console.log('Placeholder clicked'); this.parentElement.parentElement.click();">
                        <div class="text-center text-muted-foreground">
                          <div class="text-4xl mb-2">📷</div>
                          <p class="text-sm">Click to view image</p>
                        </div>
                      </div>
                    `
                  }
                  console.log('❌ Image failed to load:', post.image)
                }}
                onLoad={() => {
                  console.log('✅ Image loaded successfully:', post.image)
                }}
                onLoadStart={() => {
                  console.log('🔄 Image loading started:', post.image)
                }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between text-muted-foreground text-sm">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  liked ? "text-red-500" : "hover:text-red-500"
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                <span>{likeCount}</span>
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{commentsCount}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 hover:text-green-500 transition-colors"
              >
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {post.matchedMood && (
                <div className="bg-primary px-3 py-1 rounded-full">
                  <span className="text-primary-foreground font-medium text-sm">
                    {post.matchedMood}
                  </span>
                </div>
              )}
              <div className="bg-accent px-3 py-1 rounded-full">
                <span className="text-accent-foreground font-medium text-sm">
                  {post.moodCompatibility} Mood Compatibility
                </span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 space-y-3 border-t border-border pt-3">
              {/* Comment Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleComment()}
                  className="flex-1 p-2 border border-border rounded-lg bg-background text-foreground"
                />
                <button
                  onClick={handleComment}
                  disabled={!comment.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg disabled:opacity-50"
                >
                  Send
                </button>
              </div>

              {/* Comments List */}
              {comments.map((commentItem) => (
                <div key={commentItem.id} className="flex space-x-2">
                  <ProfileImage
                    src={commentItem.userInfo?.profilePictureFileId ||
                         commentItem.userInfo?.profileImageFileId ||
                         commentItem.userInfo?.profilePictureUrl ||
                         commentItem.userInfo?.profileImageUrl ||
                         (commentItem.userId === currentUser?.id ? (currentUser?.profilePictureFileId || currentUser?.profileImageFileId || currentUser?.profilePictureUrl || currentUser?.profileImageUrl) : null)}
                    alt={commentItem.username}
                    size="sm"
                    fallbackText={commentItem.username}
                    className="w-6 h-6 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="bg-muted p-2 rounded-lg">
                      <span
                        className="font-medium text-sm text-foreground cursor-pointer hover:underline"
                        onClick={() => onUserClick && onUserClick({
                          id: commentItem.userInfo?.id || commentItem.userId || `mock-${Date.now()}`,
                          username: commentItem.username,
                          handle: commentItem.userInfo?.userName || commentItem.username.toLowerCase().replace(' ', '_'),
                          userName: commentItem.userInfo?.userName,
                          firstName: commentItem.userInfo?.firstName,
                          lastName: commentItem.userInfo?.lastName,
                          fullName: commentItem.userInfo ? `${commentItem.userInfo.firstName || ''} ${commentItem.userInfo.lastName || ''}`.trim() : commentItem.username,
                          followers: (Math.floor(Math.random() * 300) + 50).toString(),
                          following: (Math.floor(Math.random() * 100) + 20).toString(),
                          bio: `${commentItem.username}'s profile. MoodLink user.`,
                          moods: [
                            { name: "Calm", percentage: Math.floor(Math.random() * 30 + 50) + "%" },
                            { name: "Curious", percentage: Math.floor(Math.random() * 20 + 60) + "%" },
                          ],
                          badges: ["🌟"],
                          profilePictureFileId: commentItem.userInfo?.profilePictureFileId,
                          profileImageFileId: commentItem.userInfo?.profileImageFileId,
                          profilePictureUrl: commentItem.userInfo?.profilePictureUrl,
                          profileImageUrl: commentItem.userInfo?.profileImageUrl,
                        })}
                      >
                        {commentItem.username}
                      </span>
                      <p className="text-sm text-foreground">{commentItem.text}</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">{commentItem.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal - Rendered via Portal */}
      {showImageModal && post.image && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log('🔴 Modal overlay clicked, closing modal')
            setShowImageModal(false)
          }}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] bg-white rounded-lg shadow-2xl"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('🔵 Modal content clicked, staying open')
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('❌ Close button clicked')
                setShowImageModal(false)
              }}
              className="absolute -top-2 -right-2 text-white bg-red-500 hover:bg-red-600 rounded-full p-2 transition-colors z-10 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={
                post.image.startsWith('/api/files/')
                  ? `https://moodlinkbackend.onrender.com/api/FileAttachments/download/${post.image.split('/').pop()}`
                  : post.image || "/placeholder.svg"
              }
              alt="Post image - Full size"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('🖼️ Image in modal clicked')
              }}
              onError={(e) => {
                console.error('❌ Modal image failed to load:', post.image)
              }}
              onLoad={() => {
                console.log('✅ Modal image loaded successfully:', post.image)
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
