"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send } from "lucide-react"

interface ChatPageProps {
  chatUser: string | null
  onBack: () => void
}

interface Message {
  id: number
  text: string
  time: string
  sent: boolean
}

export function ChatPage({ chatUser, onBack }: ChatPageProps) {
  const [message, setMessage] = useState("")

  // Başlangıç mesajları
  const initialMessages: { [key: string]: Message[] } = {
    Doğan: [
      { id: 1, text: "Heyy!", time: "23:46", sent: false },
      { id: 2, text: "Selam!", time: "23:47", sent: true },
    ],
    Eray: [
      { id: 1, text: "Hey dude! Wanna see...?", time: "Dün 15:30", sent: false },
      { id: 2, text: "Olur, ne zaman?", time: "Dün 15:32", sent: true },
    ],
  }

  const [messages, setMessages] = useState<Message[]>(chatUser ? initialMessages[chatUser] || [] : [])

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: message,
        time: new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        sent: true,
      }

      setMessages([...messages, newMessage])
      setMessage("")

      // Otomatik yanıt simülasyonu (opsiyonel)
      setTimeout(() => {
        const autoReply: Message = {
          id: Date.now() + 1,
          text: "Mesajın için teşekkürler! 😊",
          time: new Date().toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sent: false,
        }
        setMessages((prev) => [...prev, autoReply])
      }, 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
          <h1 className="text-xl font-bold text-gray-800">{chatUser}</h1>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Henüz mesaj yok. İlk mesajı sen gönder! 👋</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  msg.sent ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="break-words">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sent ? "text-purple-100" : "text-gray-500"}`}>{msg.time}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Mesaj yaz..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
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
          <span className="text-xs text-gray-400">Enter ile gönder</span>
          {message.length > 0 && <span className="text-xs text-gray-500">{message.length}/500</span>}
        </div>
      </div>
    </div>
  )
}
