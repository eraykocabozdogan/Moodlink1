"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react"
import Image from "next/image"

interface PostCardProps {
  post: {
    id: number
    username: string
    handle?: string
    time: string
    content: string
    image?: string
    moodCompatibility: string
    community?: string
  }
  onUserClick?: (user: any) => void
}

export function PostCard({ post, onUserClick }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 10)
  const [saved, setSaved] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([
    { id: 1, username: "Ali", text: "Great post!", time: "2m" },
    { id: 2, username: "Ayşe", text: "I agree!", time: "5m" },
  ])

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
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

  const handleComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        username: "You",
        text: comment,
        time: "now",
      }
      setComments([newComment, ...comments])
      setComment("")
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
                src={post.image || "/placeholder.svg"}
                alt="Post image"
                width={400}
                height={200}
                className="w-full h-48 object-cover"
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
                <span>{comments.length}</span>
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
