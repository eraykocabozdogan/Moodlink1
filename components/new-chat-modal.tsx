"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Search, MessageCircle, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import apiClient from "@/lib/apiClient"
import { UUID, ChatType } from "@/lib/types/api"

interface UserSearchResult {
  id: UUID
  userName?: string
  firstName?: string
  lastName?: string
  bio?: string
  profilePictureUrl?: string
}

interface NewChatModalProps {
  onClose: () => void
  onChatCreated: (chatInfo: any) => void
}

export function NewChatModal({ onClose, onChatCreated }: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const { user } = useAuth()

  // Search users
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setSearchResults([])
        return
      }

      setLoading(true)
      try {
        // Use the search API to find users
        const response = await apiClient.searchUsersAndPosts(searchQuery, {
          PageIndex: 0,
          PageSize: 10
        })
        const users = response.users || []

        // Filter out current user
        const filteredUsers = users.filter((u: UserSearchResult) => u.id !== user?.id)
        setSearchResults(filteredUsers)
      } catch (error) {
        console.error('Failed to search users:', error)
        setSearchResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchUsers, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, user?.id])

  const handleCreateChat = async (targetUser: UserSearchResult) => {
    if (!user || creating) return

    setCreating(true)
    try {
      console.log('Sending direct message to:', targetUser)
      // Send a direct message to create/start a chat
      const response = await apiClient.sendDirectMessage({
        senderUserId: user.id,
        receiverUserId: targetUser.id,
        content: "👋 Hello! Let's start chatting!"
      })
      console.log('sendDirectMessage response:', response)

      // Create chat info object for UI
      const newChatInfo = {
        id: response.chatId,
        chatId: response.chatId,
        type: "user" as const,
        title: targetUser.userName || `${targetUser.firstName} ${targetUser.lastName}`.trim() || 'Unknown User',
        handle: targetUser.userName ? `@${targetUser.userName}` : undefined,
        lastMessage: response.content || "Chat started",
        time: new Date(response.sentDate).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
      console.log('Created chat info:', newChatInfo)

      onChatCreated(newChatInfo)
      onClose()
    } catch (error: any) {
      console.error('Failed to create chat:', error)
      console.error('Create chat error details:', {
        message: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data
      })
      // You could show an error toast here
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            New Chat
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users by username or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="text-center text-muted-foreground py-8">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p>Searching...</p>
              </div>
            ) : searchQuery.length < 2 ? (
              <div className="text-center text-muted-foreground py-8">
                <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Type at least 2 characters to search for users</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No users found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleCreateChat(user)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex-shrink-0 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {user.userName || `${user.firstName} ${user.lastName}`.trim() || 'Unknown User'}
                      </p>
                      {user.userName && (
                        <p className="text-sm text-muted-foreground">@{user.userName}</p>
                      )}
                    </div>
                    {creating ? (
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
