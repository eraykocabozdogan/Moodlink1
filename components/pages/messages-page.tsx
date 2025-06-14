"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Users, Plus, MessageCircle } from "lucide-react"
import { CreateGroupChat, User } from "@/components/create-group-chat"
import { NewChatModal } from "@/components/new-chat-modal"
import { useAuth } from "@/hooks/use-auth"
import apiClient from "@/lib/apiClient"
import { UUID } from "@/lib/types/api"

interface ChatInfo {
  id: number
  chatId?: UUID  // Backend chat ID
  type: "user" | "group"
  title: string
  handle?: string
  members?: User[]
  lastMessage: string
  time: string
}

interface MessagesPageProps {
  onChatSelect: (chatInfo: ChatInfo) => void
  onUserClick?: (user: any) => void
}

export function MessagesPage({ onChatSelect, onUserClick }: MessagesPageProps) {
  const [showCreateGroupChat, setShowCreateGroupChat] = useState(false)
  const [showNewChat, setShowNewChat] = useState(false)
  const [conversations, setConversations] = useState<ChatInfo[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  console.log('MessagesPage rendered, user:', user)

  // Sample user list for group creation
  const availableUsers: User[] = [
    { id: 1, username: "Doğan", handle: "@dgns" },
    { id: 2, username: "Eray", handle: "@erayy" },
    { id: 3, username: "Ahmet", handle: "@ahmt" },
    { id: 4, username: "Mehmet", handle: "@mhmt" },
    { id: 5, username: "Zeynep", handle: "@zynp" },
    { id: 6, username: "Ayşe", handle: "@ayse" },
  ]

  // Load user chats from backend
  useEffect(() => {
    console.log('Messages useEffect called')
    const loadChats = async () => {
      console.log('loadChats called, user:', user)

      if (!user) {
        console.log('No user found, setting loading to false')
        setLoading(false)
        return
      }

      try {
        console.log('Loading user chats...')
        const response = await apiClient.getUserChats({
          PageIndex: 0,
          PageSize: 50
        })
        console.log('getUserChats response:', response)
        const backendChats: ChatInfo[] = (response.chats || []).map((chat: any) => {
          console.log('Processing chat:', chat)
          return {
            id: chat.id,
            chatId: chat.id,
            type: chat.type === "Group" ? "group" : "user",
            title: chat.name || "Unknown Chat",
            lastMessage: chat.lastMessage?.content || "No messages yet",
            time: chat.lastMessage?.sentDate ? new Date(chat.lastMessage.sentDate).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }) : "Now",
            members: [] // We don't have participants in UserChatDto
          }
        })
        setConversations(backendChats)
      } catch (error) {
        console.error('Failed to load chats:', error)
        // Fallback to mock data for development
        setConversations([
          {
            id: 1,
            type: "user",
            title: "Doğan",
            handle: "@dgns",
            lastMessage: "Heyy!",
            time: "23:46",
          },
          {
            id: 2,
            type: "user",
            title: "Eray2",
            handle: "@erayy",
            lastMessage: "Hey dude! Wanna see...",
            time: "Yesterday",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadChats()
  }, [user])

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex justify-between items-center">
          <Button
            onClick={() => setShowNewChat(true)}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            size="sm"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            New Chat
          </Button>
          <h1 className="text-xl font-bold text-foreground">Direct Messages</h1>
          <Button
            onClick={() => setShowCreateGroupChat(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            size="sm"
          >
            <Users className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      <div className="bg-card">
        {loading ? (
          <div className="text-center text-muted-foreground p-8">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p>Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-muted-foreground p-8">
            <p>No conversations yet. Start a new chat! 💬</p>
          </div>
        ) : (
          conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onChatSelect(conversation)}
            className="border-b border-border p-4 hover:bg-muted/50 cursor-pointer"
          >
            <div className="flex space-x-3">
              {conversation.type === "user" ? (
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex-shrink-0"></div>
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex-shrink-0 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p 
                      className="font-medium text-foreground cursor-pointer hover:underline"
                      onClick={(e) => {
                        if (conversation.type === "user" && onUserClick) {
                          e.stopPropagation();
                          onUserClick({
                            username: conversation.title,
                            handle: conversation.handle?.replace('@', '') || '',
                            followers: (Math.floor(Math.random() * 2000) + 500).toString(),
                            following: (Math.floor(Math.random() * 500) + 100).toString(),
                            bio: `${conversation.title}'s profile. MoodLink user.`,
                            moods: [
                              { name: "Energetic", percentage: Math.floor(Math.random() * 30 + 50) + "%" },
                              { name: "Happy", percentage: Math.floor(Math.random() * 20 + 60) + "%" },
                            ],
                            badges: ["🏆", "🎯"],
                          });
                        }
                      }}
                    >
                      {conversation.title}
                    </p>
                    {conversation.type === "user" && conversation.handle && (
                      <p className="text-muted-foreground text-sm">{conversation.handle}</p>
                    )}
                    {conversation.type === "group" && conversation.members && (
                      <p className="text-muted-foreground text-sm">{conversation.members.length} members</p>
                    )}
                  </div>
                  <span className="text-muted-foreground text-xs">{conversation.time}</span>
                </div>
                <p className="text-muted-foreground text-sm mt-1 truncate">{conversation.lastMessage}</p>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          onChatCreated={(newChatInfo) => {
            setConversations([newChatInfo, ...conversations]);
            setShowNewChat(false);
            // Automatically open the new chat
            onChatSelect(newChatInfo);
          }}
        />
      )}

      {/* Group Chat Creation Modal */}
      {showCreateGroupChat && (
        <CreateGroupChat
          onClose={() => setShowCreateGroupChat(false)}
          availableUsers={availableUsers}
          onCreateGroup={(groupName, members) => {
            const newGroup: ChatInfo = {
              id: Date.now(),
              type: "group",
              title: groupName,
              members: members,
              lastMessage: "Group created",
              time: new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
            setConversations([newGroup, ...conversations]);
            setShowCreateGroupChat(false);
          }}
        />
      )}
    </div>
  )
}
