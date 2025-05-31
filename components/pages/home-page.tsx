"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react" // Added useEffect and useCallback
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PostCard } from "@/components/post-card"
import useEmblaCarousel from 'embla-carousel-react' // Added embla-carousel-react
import { ImagePlus } from 'lucide-react' // Added ImagePlus icon

// Define a type for the Post structure
interface Post {
  id: number;
  username: string;
  handle: string;
  time: string;
  content: string;
  image?: string; 
  moodCompatibility: string;
}

export function HomePage() {
  const [activeTab, setActiveTab] = useState("forYou")
  const [postContent, setPostContent] = useState("")
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      username: "Doğan",
      handle: "@dogansengul",
      time: "6s",
      content: "Hello Madritistas",
      moodCompatibility: "75%",
    },
    {
      id: 2,
      username: "Eray",
      handle: "@eraykocabozdogan",
      time: "2dk",
      content: "Çankırı çok güzel",
      image: "/placeholder.svg?height=200&width=400",
      moodCompatibility: "88%",
    },
  ])

  const [followingPosts, setFollowingPosts] = useState<Post[]>([
    {
      id: 3,
      username: "TakipEdilen1",
      handle: "@tkp1",
      time: "10dk",
      content: "Yeni gönderim!",
      moodCompatibility: "60%",
    },
  ])
  const [selectedImage, setSelectedImage] = useState<string | null>(null) // Added state for selected image
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })

  // useCallback hooks for emblaApi
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

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

  const handlePostSubmit = () => {
    if (postContent.trim() || selectedImage) { // Allow post if there\'s content or an image
      const newPost: Post = {
        id: Date.now(), 
        username: "Sen", 
        handle: "@sen",
        time: "şimdi",
        content: postContent,
        image: selectedImage ?? undefined, // Add selected image to post, ensure undefined if null
        moodCompatibility: Math.floor(Math.random() * 30 + 70) + "%",
      }

      if (activeTab === "forYou") {
        setPosts([newPost, ...posts])
      } else {
        setFollowingPosts([newPost, ...followingPosts])
      }

      setPostContent("")
      setSelectedImage(null) // Clear selected image after posting
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

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-xl font-bold text-foreground">Ana Sayfa</h1>
      </div>

      {/* Create Post */}
      <div className="border-b border-border p-4 bg-card">
        <div className="flex space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <Textarea
              placeholder="Neler oluyor?"
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
                  Kaldır
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
                <span className="text-xs text-muted-foreground">Ctrl+Enter ile gönder</span>
                <Button
                  onClick={handlePostSubmit}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-primary-foreground px-6"
                  disabled={(!postContent.trim() && !selectedImage) || postContent.length > 280} // Updated disabled condition
                >
                  Gönder
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
          Sizin İçin
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`flex-1 py-4 text-center font-medium transition-colors ${
            activeTab === "following"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Takip Edilenler
        </button>
      </div>

      {/* Carousel for posts */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {/* "For You" Tab Content */}
          <div className="min-w-0 flex-shrink-0 flex-grow-0 basis-full bg-background">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          {/* "Following" Tab Content */}
          <div className="min-w-0 flex-shrink-0 flex-grow-0 basis-full bg-background">
            {followingPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
