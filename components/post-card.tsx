"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, Share } from "lucide-react"
import Image from "next/image"
import { PostImage } from "@/components/ui/post-image"
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
    community?: string
    likesCount: number
    commentsCount: number
    isLikedByCurrentUser: boolean
    userData?: {
      id: string
      userName?: string
      firstName?: string
      lastName?: string
      fullName?: string
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

      // Transform comments to match our interface
      const transformedComments = response.comments?.map((comment: any) => ({
        id: comment.id,
        username: comment.userName || 'User',
        text: comment.content || '',
        time: 'now' // TODO: Format createdDate
      })) || []

      setComments(transformedComments)
      setCommentsLoaded(true)
    } catch (error) {
      console.error('Error fetching comments:', error)
      // Keep default comments on error
      setComments([
        { id: 1, username: "Ali", text: "Great post!", time: "2m" },
        { id: 2, username: "Ayşe", text: "I agree!", time: "5m" },
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
        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex-shrink-0"></div>

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
              {post.username}
            </span>
            {post.handle && <span className="text-muted-foreground text-sm">{post.handle}</span>}
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">{post.time}</span>
          </div>

          {/* Content */}
          <p className="text-foreground mb-3">{post.content}</p>

          {/* Image */}
          {post.image && (
            <PostImage
              src={post.image}
              alt="Post image"
              className="mb-3"
              width={400}
              height={200}
              aspectRatio="auto"
            />
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

            <div className="bg-accent px-3 py-1 rounded-full">
              <span className="text-accent-foreground font-medium">{post.moodCompatibility} Mood Compatibility</span>
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
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="bg-muted p-2 rounded-lg">
                      <span 
                        className="font-medium text-sm text-foreground cursor-pointer hover:underline"
                        onClick={() => onUserClick && onUserClick({
                          username: commentItem.username,
                          handle: commentItem.username.toLowerCase().replace(' ', '_'),
                          followers: (Math.floor(Math.random() * 300) + 50).toString(),
                          following: (Math.floor(Math.random() * 100) + 20).toString(),
                          bio: `${commentItem.username}'s profile. MoodLink user.`,
                          moods: [
                            { name: "Calm", percentage: Math.floor(Math.random() * 30 + 50) + "%" },
                            { name: "Curious", percentage: Math.floor(Math.random() * 20 + 60) + "%" },
                          ],
                          badges: ["🌟"],
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
    </div>
  )
}
