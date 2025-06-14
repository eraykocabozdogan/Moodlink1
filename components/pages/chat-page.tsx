"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Users, Info } from "lucide-react"
import { User } from "@/components/create-group-chat"
import { useAuth } from "@/hooks/use-auth"
import apiClient from "@/lib/apiClient"
import { UUID, ChatMessageDto } from "@/lib/types/api"

interface ChatInfo {
  id: number
  chatId?: UUID  // Backend chat ID
  type: "user" | "group"
  title: string
  handle?: string
  members?: User[]
  lastMessage: string
  time: string
  // Direct message properties
  otherUserId?: UUID
  otherUserName?: string
  otherUserHandle?: string
  otherUserAvatar?: string
  isDirectMessage?: boolean
}

interface ChatPageProps {
  chatDetails: ChatInfo | null
  onBack: () => void
}

interface Message {
  id: string | number
  text: string
  time: string
  sent: boolean
  sender?: string
  senderUserId?: UUID
  messageId?: UUID  // Backend message ID
}

export function ChatPage({ chatDetails, onBack }: ChatPageProps) {
  const [message, setMessage] = useState("")
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const { user } = useAuth()

  // Initial messages
  const initialMessages: { [key: string]: Message[] } = {
    "Doğan": [
      { id: 1, text: "Heyy!", time: "23:46", sent: false },
      { id: 2, text: "Hello!", time: "23:47", sent: true },
    ],
    "Eray2": [
      { id: 1, text: "Hey dude! Wanna see...?", time: "Yesterday 15:30", sent: false },
      { id: 2, text: "Sure, when?", time: "Yesterday 15:32", sent: true },
    ],
  }

  const [messages, setMessages] = useState<Message[]>([])

  // Load messages from backend when chat details change
  useEffect(() => {
    const loadMessages = async () => {
      if (!chatDetails || !user) return

      setLoading(true)
      try {
        // Handle direct messages
        if (chatDetails.isDirectMessage && chatDetails.otherUserId) {
          console.log('Loading direct messages with user:', chatDetails.otherUserId)

          // For direct messages, we need to find or create a chat
          // For now, we'll start with empty messages and let the user send the first message
          setMessages([])

          // You could implement logic here to:
          // 1. Check if a chat already exists between these users
          // 2. Load existing messages if chat exists
          // 3. Create a new chat when first message is sent

        } else if (chatDetails.chatId) {
          // Handle existing chats
          const response = await apiClient.getChatMessages(chatDetails.chatId, {
            PageIndex: 0,
            PageSize: 50
          })
          const backendMessages: Message[] = response.messages.map((msg: ChatMessageDto) => ({
            id: msg.id,
            messageId: msg.id,
            text: msg.content || '',
            time: new Date(msg.sentDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            sent: msg.senderUserId === user.id,
            sender: msg.senderUserName,
            senderUserId: msg.senderUserId
          }))

          // Mesajları tarih sırasına göre sırala (en eski en üstte, en yeni en altta)
          const sortedMessages = backendMessages.sort((a, b) => {
            const msgA = response.messages.find(m => m.id === a.id)
            const msgB = response.messages.find(m => m.id === b.id)
            const timeA = new Date(msgA?.sentDate || 0).getTime()
            const timeB = new Date(msgB?.sentDate || 0).getTime()
            return timeA - timeB
          })

          setMessages(sortedMessages)
        }
      } catch (error) {
        console.error('Failed to load messages:', error)
        // Fallback to mock data for development
        if (chatDetails.type === "user" && initialMessages[chatDetails.title]) {
          setMessages(initialMessages[chatDetails.title])
        } else if (chatDetails.type === "group") {
          setMessages([
            {
              id: 1,
              text: `${chatDetails.title} group chat created.`,
              time: chatDetails.time || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
              sent: false,
              sender: "System"
            }
          ])
        } else {
          // Empty state for new direct messages
          setMessages([])
        }
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [chatDetails?.chatId, chatDetails?.otherUserId, user])

  const handleSend = async () => {
    if (!message.trim() || !user || sendingMessage) return

    // For direct messages, we need either chatId or otherUserId
    if (!chatDetails?.chatId && !chatDetails?.isDirectMessage) return

    setSendingMessage(true)
    const messageText = message
    setMessage("") // Clear input immediately for better UX

    // Add optimistic message to UI
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      text: messageText,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sent: true,
      senderUserId: user.id,
    }

    setMessages(prev => [...prev, optimisticMessage])

    try {
      let response

      if (chatDetails.isDirectMessage && chatDetails.otherUserId) {
        // Send direct message
        console.log('Sending direct message to:', chatDetails.otherUserId)
        response = await apiClient.sendDirectMessage({
          senderUserId: user.id,
          receiverUserId: chatDetails.otherUserId,
          content: messageText,
        })
        console.log('Direct message sent:', response)
      } else if (chatDetails.chatId) {
        // Send regular chat message
        response = await apiClient.sendMessage({
          chatId: chatDetails.chatId,
          senderUserId: user.id,
          content: messageText,
        })
      } else {
        throw new Error('No valid chat target')
      }

      // Replace optimistic message with real message
      setMessages(prev => prev.map(msg =>
        msg.id === optimisticMessage.id
          ? {
              ...msg,
              id: response.id,
              messageId: response.id,
              time: new Date(response.sentDate).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })
            }
          : msg
      ))

    } catch (error: any) {
      console.error('Failed to send message:', error)
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id))
      // Restore message in input
      setMessage(messageText)
      // You could show an error toast here
    } finally {
      setSendingMessage(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Toggle group info panel
  const toggleGroupInfo = () => {
    setShowGroupInfo(!showGroupInfo)
  }

  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between">
          {/* Left: avatar and back button */}
          <div className="flex items-center">
            <button onClick={onBack} className="p-2 hover:bg-muted rounded-full transition-colors mr-2">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            {chatDetails?.type === "user" || chatDetails?.isDirectMessage ? (
              chatDetails.otherUserAvatar ? (
                <img
                  src={chatDetails.otherUserAvatar}
                  alt={chatDetails.otherUserName || chatDetails.title}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-medium">
                  {(chatDetails.otherUserName || chatDetails.title || 'U').substring(0, 2).toUpperCase()}
                </div>
              )
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          {/* Middle: title */}
          <div className="text-center flex-1">
            <h1 className="text-xl font-bold text-foreground">{chatDetails?.title}</h1>
            {chatDetails?.type === "group" && (
              <p className="text-sm text-muted-foreground">{chatDetails.members?.length} members</p>
            )}
          </div>
          {/* Right: info button */}
          <div className="flex items-center justify-end min-w-[40px]">
            {chatDetails?.type === "group" && (
              <button 
                onClick={toggleGroupInfo} 
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <Info className="w-5 h-5 text-foreground" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {loading ? (
            <div className="text-center text-muted-foreground mt-8">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground mt-8">
              <p>No messages yet. Send the first message! 👋</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    msg.sent 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
                      : "bg-muted text-foreground"
                  }`}
                >
                  {/* Show sender name for group chats */}
                  {!msg.sent && chatDetails?.type === "group" && msg.sender && (
                    <p className="text-xs font-medium mb-1">
                      {msg.sender}
                    </p>
                  )}
                  <p className="break-words">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sent ? "text-purple-100" : "text-muted-foreground"}`}>{msg.time}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Group info sidebar */}
        {showGroupInfo && chatDetails?.type === "group" && (
          <div className="w-64 border-l border-border p-4 overflow-y-auto bg-card">
            <h3 className="font-bold text-lg mb-4 text-foreground">Group Members</h3>
            <div className="space-y-3">
              {chatDetails.members?.map(member => (
                <div key={member.id} className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{member.username}</p>
                    <p className="text-xs text-muted-foreground">{member.handle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-border p-4 bg-card">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-background border-border text-foreground"
            maxLength={500}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || sendingMessage || !user}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
          >
            {sendingMessage ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">Press Enter to send</span>
          {message.length > 0 && <span className="text-xs text-muted-foreground">{message.length}/500</span>}
        </div>
      </div>
    </div>
  )
}
