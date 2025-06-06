"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Users, Plus } from "lucide-react"
import { CreateGroupChat, User } from "@/components/create-group-chat"
import apiClient from "@/lib/apiClient"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

// Swagger'daki UserChatDto'ya göre tip tanımı
interface ChatInfo {
  id: string; // uuid
  name: string;
  type: string; // 'Direct' or 'Group'
  groupImageUrl?: string;
  participantCount: number;
  lastMessage?: {
    id: string;
    content: string;
    senderName: string;
    sentDate: string;
  };
  joinedDate: string;
}

interface ChatsResponse {
  chats: ChatInfo[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface MessagesPageProps {
  onChatSelect: (chatInfo: ChatInfo) => void
  onUserClick?: (user: any) => void
}

export function MessagesPage({ onChatSelect, onUserClick }: MessagesPageProps) {
  const [conversations, setConversations] = useState<ChatInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateGroupChat, setShowCreateGroupChat] = useState(false)
  const { toast } = useToast()
  
  const fetchConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching conversations with token:', token ? 'present' : 'missing');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await apiClient.get<ChatsResponse>('/api/Chats/user-chats');
      console.log('Conversations response:', response);
      setConversations(response.chats || []);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Sohbetler yüklenemedi.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);
  
  const handleCreateGroup = async (groupName: string, members: User[]) => {
    try {
        const participantUserIds = members.map(m => m.id);
        console.log('Creating group chat:', {
          name: groupName,
          type: 2,
          participantUserIds
        });
        
        await apiClient.post('/api/Chats/create', {
            name: groupName,
            type: 2, // 2: Group Chat
            participantUserIds
        });

        toast({ title: "Başarılı", description: "Grup başarıyla oluşturuldu." });
        setShowCreateGroupChat(false);
        fetchConversations(); // Listeyi yenile
    } catch (error) {
        console.error("Failed to create group:", error);
        toast({ variant: "destructive", title: "Hata", description: "Grup oluşturulamadı." });
    }
  }


  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex justify-between items-center">
          <div className="w-24"></div>
          <h1 className="text-xl font-bold text-foreground">Direct Messages</h1>
          <Button 
            onClick={() => setShowCreateGroupChat(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            size="sm"
          >
            <Users className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      <div className="bg-card">
        {isLoading ? (
            <div className="p-4 space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        ) : conversations.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">Henüz bir sohbetiniz yok.</div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onChatSelect(conversation)}
              className="border-b border-border p-4 hover:bg-muted/50 cursor-pointer"
            >
              <div className="flex space-x-3">
                <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-r ${conversation.type === "Direct" ? "from-green-400 to-blue-400" : "from-purple-400 to-pink-400"}`}>
                    {conversation.type === "Group" && <Users className="w-6 h-6 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-foreground">{conversation.name}</p>
                    <span className="text-muted-foreground text-xs">{conversation.lastMessage ? new Date(conversation.lastMessage.sentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1 truncate">{conversation.lastMessage?.content || "Henüz mesaj yok."}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showCreateGroupChat && (
        <CreateGroupChat 
          onClose={() => setShowCreateGroupChat(false)}
          availableUsers={[]} // TODO: Kullanıcı listesi API'den çekilmeli
          onCreateGroup={handleCreateGroup}
        />
      )}
    </div>
  )
}