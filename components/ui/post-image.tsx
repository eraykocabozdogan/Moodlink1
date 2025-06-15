"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface PostImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  aspectRatio?: "auto" | "square" | "video"
}

// PostImage component with error handling and proper URL formatting
export function PostImage({ 
  src, 
  alt, 
  className = "", 
  width = 600, 
  height = 400,
  aspectRatio = "auto"
}: PostImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>("")
  const [hasError, setHasError] = useState(false)
  const [alternativeIndex, setAlternativeIndex] = useState(0)

  // Generate all possible URLs for the image
  const generateImageUrls = (imageSrc: string): string[] => {
    const fileId = imageSrc.split('/').pop() || imageSrc
    
    return [
      // If it's already a full URL, use it
      imageSrc.startsWith('http') ? imageSrc : null,
      // Primary endpoint
      `https://moodlinkbackend.onrender.com/api/FileAttachments/download/${fileId}`,
      // Alternative endpoints
      `https://moodlinkbackend.onrender.com/uploads/${fileId}`,
      `https://moodlinkbackend.onrender.com/files/${fileId}`,
      `https://moodlinkbackend.onrender.com/api/FileAttachments/${fileId}`,
      // Local fallback
      `/api/files/${fileId}`,
      // Placeholder as last resort
      "/placeholder.svg"
    ].filter(Boolean) as string[]
  }

  const imageUrls = generateImageUrls(src)

  useEffect(() => {
    setCurrentSrc(imageUrls[0])
    setHasError(false)
    setAlternativeIndex(0)
  }, [src])

  const handleError = () => {
    console.error('Image failed to load:', currentSrc)
    
    const nextIndex = alternativeIndex + 1
    if (nextIndex < imageUrls.length) {
      console.log(`Trying alternative URL ${nextIndex}:`, imageUrls[nextIndex])
      setCurrentSrc(imageUrls[nextIndex])
      setAlternativeIndex(nextIndex)
    } else {
      console.error('All image URLs failed')
      setHasError(true)
    }
  }

  const handleLoad = () => {
    console.log('Image loaded successfully:', currentSrc)
    setHasError(false)
  }

  // Get CSS classes based on aspect ratio
  const getImageClasses = () => {
    const baseClasses = "w-full bg-muted"
    
    switch (aspectRatio) {
      case "square":
        return `${baseClasses} aspect-square object-cover`
      case "video":
        return `${baseClasses} aspect-video object-cover`
      default:
        return `${baseClasses} h-auto max-h-96 object-contain`
    }
  }

  if (hasError) {
    return (
      <div className={`${className} rounded-xl overflow-hidden bg-muted flex items-center justify-center h-48`}>
        <span className="text-muted-foreground text-sm">Image not available</span>
      </div>
    )
  }

  return (
    <div className={`${className} rounded-xl overflow-hidden bg-muted`}>
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={getImageClasses()}
        onError={handleError}
        onLoad={handleLoad}
        priority={false}
      />
    </div>
  )
}
