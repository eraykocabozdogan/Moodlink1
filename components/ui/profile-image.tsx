"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface ProfileImageProps {
  src?: string | null
  alt: string
  className?: string
  size?: "sm" | "md" | "lg"
  fallbackText?: string
}

// ProfileImage component with error handling and proper URL formatting
export function ProfileImage({ 
  src, 
  alt, 
  className = "", 
  size = "md",
  fallbackText = ""
}: ProfileImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>("")
  const [hasError, setHasError] = useState(false)
  const [alternativeIndex, setAlternativeIndex] = useState(0)

  // Generate all possible URLs for the image
  const generateImageUrls = (imageSrc: string): string[] => {
    if (!imageSrc || imageSrc.trim() === '') {
      return []
    }

    const fileId = imageSrc.split('/').pop() || imageSrc

    // Don't generate URLs for empty fileId
    if (!fileId || fileId.trim() === '') {
      return []
    }

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
    ].filter(Boolean) as string[]
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-12 h-12"
      case "lg":
        return "w-32 h-32"
      default:
        return "w-24 h-24"
    }
  }

  useEffect(() => {
    if (src && src.trim() !== '') {
      const imageUrls = generateImageUrls(src)
      if (imageUrls.length > 0 && imageUrls[0]) {
        setCurrentSrc(imageUrls[0])
        setHasError(false)
        setAlternativeIndex(0)
      } else {
        setHasError(true)
        setCurrentSrc('')
      }
    } else {
      setHasError(true)
      setCurrentSrc('')
    }
  }, [src])

  const handleError = () => {
    if (!src || src.trim() === '') {
      setHasError(true)
      return
    }

    const imageUrls = generateImageUrls(src)
    const nextIndex = alternativeIndex + 1
    if (nextIndex < imageUrls.length) {
      setCurrentSrc(imageUrls[nextIndex])
      setAlternativeIndex(nextIndex)
    } else {
      setHasError(true)
    }
  }

  const handleLoad = () => {
    setHasError(false)
  }

  // Show fallback if no src or error
  if (!src || src.trim() === '' || hasError || !currentSrc || currentSrc.trim() === '') {
    return (
      <div className={`${getSizeClasses()} bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-primary-foreground ${className}`}>
        {fallbackText && (
          <span className="text-xs font-medium">
            {fallbackText.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`${getSizeClasses()} rounded-full overflow-hidden ${className}`}>
      <Image
        src={currentSrc}
        alt={alt}
        width={size === "lg" ? 128 : size === "sm" ? 48 : 96}
        height={size === "lg" ? 128 : size === "sm" ? 48 : 96}
        className="w-full h-full object-cover"
        onError={handleError}
        onLoad={handleLoad}
        priority={false}
      />
    </div>
  )
}
