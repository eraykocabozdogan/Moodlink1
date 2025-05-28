import { Heart, MessageCircle, Share } from "lucide-react"
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
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50/50 transition-colors">
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex-shrink-0"></div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-bold text-gray-800">{post.username}</span>
            {post.handle && <span className="text-gray-500 text-sm">{post.handle}</span>}
            {post.community && (
              <>
                <span className="text-gray-500 text-sm">·</span>
                <span className="text-purple-600 text-sm font-medium">#{post.community}</span>
              </>
            )}
            <span className="text-gray-500 text-sm">·</span>
            <span className="text-gray-500 text-sm">{post.time}</span>
          </div>

          {/* Content */}
          <p className="text-gray-800 mb-3">{post.content}</p>

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
          <div className="flex items-center justify-between text-gray-500 text-sm">
            <div className="flex items-center space-x-6">
              <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                <Heart className="w-4 h-4" />
                <span>Beğen</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Yorum</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                <Share className="w-4 h-4" />
                <span>Paylaş</span>
              </button>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full">
              <span className="text-purple-700 font-medium">{post.moodCompatibility} Mood Uyumu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
