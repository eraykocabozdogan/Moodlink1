"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react"
import Image from "next/image"
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
  }
  onUserClick?: (user: any) => void
  onPostUpdate?: (postId: string, updates: { likesCount?: number; isLikedByCurrentUser?: boolean; commentsCount?: number }) => void
}

export function PostCard({ post, onUserClick, onPostUpdate }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLikedByCurrentUser)
  const [likeCount, setLikeCount] = useState(post.likesCount)
  const [commentsCount, setCommentsCount] = useState(post.commentsCount)
  const [saved, setSaved] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<any[]>([])
  const [commentsLoaded, setCommentsLoaded] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Update local state when post prop changes (important for like persistence)
  useEffect(() => {
    setLiked(post.isLikedByCurrentUser)
    setLikeCount(post.likesCount)
    setCommentsCount(post.commentsCount)
  }, [post.isLikedByCurrentUser, post.likesCount, post.commentsCount])

  // Get current user on component mount
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await apiClient.getUserFromAuth()
        setCurrentUser(user)
      } catch (error) {
        console.error('Error getting current user:', error)
      }
    }
    getCurrentUser()
  }, [])

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
      console.error('No current user found')
      return
    }

    try {
      if (liked) {
        // Unlike the post - for now just update local state since we can't fetch existing likes
        setLiked(false)
        setLikeCount(likeCount - 1)
        console.log('Post unliked (local state only)')

        // Notify parent component of the update
        onPostUpdate?.(post.id, {
          likesCount: likeCount - 1,
          isLikedByCurrentUser: false
        })
      } else {
        // Like the post
        try {
          const likeData = {
            userId: currentUser.id,
            postId: post.id
          }

          await apiClient.createLike(likeData)
          setLiked(true)
          setLikeCount(likeCount + 1)
          console.log('Post liked successfully')

          // Notify parent component of the update
          onPostUpdate?.(post.id, {
            likesCount: likeCount + 1,
            isLikedByCurrentUser: true
          })
        } catch (error) {
          console.error('Error liking post:', error)
          // Revert optimistic update on error
          setLiked(false)
          setLikeCount(likeCount)
        }
      }
    } catch (error) {
      console.error('Error handling like:', error)
      // Revert optimistic update on error
      setLiked(post.isLikedByCurrentUser)
      setLikeCount(post.likesCount)
    }
  }

  const handleSave = () => {
    setSaved(!saved)
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
    if (comment.trim() && currentUser) {
      try {
        const commentData = {
          postId: post.id,
          userId: currentUser.id,
          content: comment,
          parentCommentId: undefined
        }

        const response = await apiClient.createComment(commentData)
        console.log('Comment created successfully:', response)

        // Add new comment to local state
        const newComment = {
          id: response.id,
          username: "You",
          text: comment,
          time: "now",
        }
        setComments([newComment, ...comments])
        setCommentsCount(commentsCount + 1) // Update comments count
        setComment("")

        // Notify parent component of the comment count update
        onPostUpdate?.(post.id, {
          commentsCount: commentsCount + 1
        })
      } catch (error) {
        console.error('Error creating comment:', error)
        alert('Yorum eklenirken bir hata oluştu.')
      }
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
              onClick={() => onUserClick && onUserClick({              username: post.username,
              handle: post.handle?.replace('@', '') || 'user',
                followers: (Math.floor(Math.random() * 500) + 100).toString(),
                following: (Math.floor(Math.random() * 200) + 50).toString(),
                bio: `${post.username}'s profile. MoodLink user.`,
                moods: [
                  { name: "Energetic", percentage: Math.floor(Math.random() * 30 + 50) + "%" },
                  { name: "Happy", percentage: Math.floor(Math.random() * 20 + 60) + "%" },
                ],
                badges: ["🏆", "🎯"],
              })}
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
            <div className="mb-3 rounded-xl overflow-hidden">
              <Image
                src={
                  post.image.startsWith('/api/files/')
                    ? `https://moodlinkbackend.onrender.com/api/FileAttachments/download/${post.image.split('/').pop()}`
                    : post.image || "/placeholder.svg"
                }
                alt="Post image"
                width={400}
                height={200}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', post.image)
                  console.error('Attempted URL:', e.currentTarget.src)

                  // Try alternative endpoints
                  const fileId = post.image.split('/').pop()
                  const alternatives = [
                    `https://moodlinkbackend.onrender.com/uploads/${fileId}`,
                    `https://moodlinkbackend.onrender.com/files/${fileId}`,
                    `https://moodlinkbackend.onrender.com/api/FileAttachments/${fileId}`
                  ]
                  console.log('Alternative URLs to try:', alternatives)
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', post.image)
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

              <button
                onClick={handleSave}
                className={`flex items-center space-x-2 transition-colors ${
                  saved ? "text-yellow-500" : "hover:text-yellow-500"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
                <span>Save</span>
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
