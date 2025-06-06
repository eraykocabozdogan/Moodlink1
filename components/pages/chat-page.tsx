"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Users, Info } from "lucide-react"
import { User } from "@/components/create-group-chat"

interface ChatInfo {
  id: number
  type: "user" | "group"
  title: string
  handle?: string
  members?: User[]
  lastMessage: string
  time: string
}

interface ChatPageProps {
  chatDetails: ChatInfo | null
  onBack: () => void
}

interface Message {
  id: number
  text: string
  time: string
  sent: boolean
  sender?: string
}

export function ChatPage({ chatDetails, onBack }: ChatPageProps) {
  const [message, setMessage] = useState("")
  const [showGroupInfo, setShowGroupInfo] = useState(false)

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

  const [messages, setMessages] = useState<Message[]>(() => {
    if (!chatDetails) return [];
    
    // For existing individual chats, use the chat title as key
    if (chatDetails.type === "user" && initialMessages[chatDetails.title]) {
      return initialMessages[chatDetails.title];
    }
    
    // For new group chats, start with an empty array or a welcome message
    if (chatDetails.type === "group") {
      return [
        {
          id: 1,
          text: `${chatDetails.title} group chat created.`,
          time: chatDetails.time || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          sent: false,
          sender: "System"
        }
      ];
    }
    
    return [];
  });

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: message,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sent: true,
      }

      setMessages([...messages, newMessage])
      setMessage("")

      // Otomatik yanıt simülasyonu (opsiyonel)
      if (chatDetails?.type === "user") {
        setTimeout(() => {
          const autoReply: Message = {
            id: Date.now() + 1,
            text: "Thanks for your message! 😊",
            time: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sent: false,
          }
          setMessages((prev) => [...prev, autoReply])
        }, 2000)
      } else if (chatDetails?.type === "group" && chatDetails.members && chatDetails.members.length > 0) {
        // Simulate responses from group members
        setTimeout(() => {
          const randomMember = chatDetails.members![Math.floor(Math.random() * chatDetails.members!.length)];
          const autoReply: Message = {
            id: Date.now() + 1,
            text: "Reply to group message! 👍",
            time: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            sent: false,
            sender: randomMember.username
          }
          setMessages((prev) => [...prev, autoReply])
        }, 2000)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
            {chatDetails?.type === "user" ? (
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
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
          {messages.length === 0 ? (
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
            onKeyPress={handleKeyPress}
            className="flex-1 bg-background border-border text-foreground"
            maxLength={500}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
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
