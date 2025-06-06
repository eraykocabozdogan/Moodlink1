"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Users, Info, Wifi, WifiOff } from "lucide-react"
import apiClient from "@/lib/apiClient"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { User } from "@/components/create-group-chat"
import signalRService, { Message as SignalRMessage } from "@/lib/signalr-service"
import { useAuth } from "@/contexts/AuthContext"

// Tipleri güncelleyelim
interface ChatInfo {
  id: string;
  name: string;
  type: string;
  members?: User[];
}

// SignalR servisinden Message tipini kullanıyoruz
type Message = SignalRMessage;

interface ChatPageProps {
  chatDetails: ChatInfo | null
  onBack: () => void
}

export function ChatPage({ chatDetails, onBack }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const { user } = useAuth()
  
  // Auth context'ten kullanıcı ID'sini al
  const loggedInUserId = user?.id || "00000000-0000-0000-0000-000000000000";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchMessages = useCallback(async () => {
    if (!chatDetails) return
    setIsLoading(true)
    try {
      const response = await apiClient.get<{ messages: Message[] }>(`/api/Messages/chat/${chatDetails.id}`)
      setMessages(response.messages)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
      toast({ variant: "destructive", title: "Hata", description: "Mesajlar yüklenemedi." })
    } finally {
      setIsLoading(false)
    }
  }, [chatDetails, toast])

  // SignalR bağlantısını yönet
  useEffect(() => {
    if (!user?.id || !chatDetails) return;
    
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    
    // SignalR bağlantısını başlat
    const connectSignalR = async () => {
      const connected = await signalRService.startConnection(token, user.id);
      setIsConnected(connected);
    };
    
    connectSignalR();
    
    // Bağlantı durumu değişikliklerini dinle
    const unsubscribeConnectionChange = signalRService.onConnectionChange((connected) => {
      setIsConnected(connected);
    });
    
    // Yeni mesajları dinle
    const unsubscribeMessages = signalRService.onReceiveMessage((message) => {
      if (message.chatId === chatDetails.id) {
        // Mesaj bu sohbete aitse, mesajlar listesine ekle
        setMessages(prev => {
          // Mesaj zaten listede var mı kontrol et
          const exists = prev.some(m => m.id === message.id);
          if (exists) return prev;
          return [...prev, message];
        });
      }
    });
    
    // Temizleme işlevi
    return () => {
      unsubscribeConnectionChange();
      unsubscribeMessages();
    };
  }, [user, chatDetails]);

  // İlk yükleme için mesajları getir
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Mesajlar değiştiğinde otomatik kaydır
  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSend = async () => {
    if (!newMessage.trim() || !chatDetails || !user) return;
    setIsSending(true);

    const messageData = {
      chatId: chatDetails.id,
      senderUserId: loggedInUserId,
      content: newMessage,
      senderUserName: user.userName,
    };

    try {
      // Mesajı optimistic olarak UI'a ekle
      const optimisticMessage: Message = {
        ...messageData,
        id: Date.now().toString(), // Geçici ID
        sentDate: new Date().toISOString(),
      };
      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage("");

      // SignalR bağlantısı varsa, SignalR üzerinden gönder
      if (isConnected) {
        const success = await signalRService.sendMessage(chatDetails.id, newMessage);
        if (!success) {
          // SignalR ile gönderilemezse API'yi dene
          await apiClient.post('/api/Messages/send', messageData);
        }
      } else {
        // SignalR bağlantısı yoksa API'yi kullan
        await apiClient.post('/api/Messages/send', messageData);
      }
      
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({ variant: "destructive", title: "Hata", description: "Mesaj gönderilemedi." });
      // Hata durumunda optimistic olarak eklenen mesajı kaldır
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={onBack} className="p-2 hover:bg-muted rounded-full mr-2"><ArrowLeft className="w-5 h-5" /></button>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r ${chatDetails?.type === "Direct" ? "from-green-400 to-blue-400" : "from-purple-400 to-pink-400"}`}>
                {chatDetails?.type === "Group" && <Users className="w-5 h-5 text-white" />}
              </div>
            </div>
            <div className="text-center flex-1 mx-2">
              <h1 className="text-xl font-bold truncate">{chatDetails?.name}</h1>
              {/* Bağlantı durumu göstergesi */}
              <div className="flex items-center justify-center text-xs text-muted-foreground">
                {isConnected ? (
                  <span className="flex items-center"><Wifi className="w-3 h-3 mr-1 text-green-500" />Canlı</span>
                ) : (
                  <span className="flex items-center"><WifiOff className="w-3 h-3 mr-1 text-red-500" />Çevrimdışı</span>
                )}
              </div>
            </div>
            <div className="w-10 h-10 flex items-center justify-center">
              {chatDetails?.type === "Group" && <button className="p-2 hover:bg-muted rounded-full"><Info className="w-5 h-5" /></button>}
            </div>
          </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {isLoading ? (
            <div className="space-y-4">
                <Skeleton className="h-12 w-3/4 rounded-lg" />
                <Skeleton className="h-16 w-1/2 rounded-lg self-end" />
                <Skeleton className="h-8 w-2/3 rounded-lg" />
            </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderUserId === loggedInUserId ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.senderUserId === loggedInUserId ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-muted text-foreground"}`}>
                {chatDetails?.type === "Group" && msg.senderUserId !== loggedInUserId && (
                    <p className="text-xs font-medium mb-1">{msg.senderUserName || 'Bilinmeyen Kullanıcı'}</p>
                )}
                <p className="break-words">{msg.content}</p>
                <p className={`text-xs mt-1 opacity-70`}>{new Date(msg.sentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-border p-4 bg-card">
        <div className="flex space-x-2">
          <Input 
            type="text" 
            placeholder="Bir mesaj yaz..." 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && !isSending && handleSend()} 
            className="flex-1 bg-background" 
            disabled={isSending}
          />
          <Button 
            onClick={handleSend} 
            disabled={!newMessage.trim() || isSending} 
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}