"use client"

interface MessagesPageProps {
  onChatSelect: (username: string) => void
}

export function MessagesPage({ onChatSelect }: MessagesPageProps) {
  const conversations = [
    {
      id: 1,
      username: "Doğan",
      handle: "@dgns",
      lastMessage: "Heyy!",
      time: "23:46",
    },
    {
      id: 2,
      username: "Eray2",
      handle: "@erayy",
      lastMessage: "Hey dude! Wanna see...",
      time: "Dün",
    },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-xl font-bold text-foreground">Direkt Mesajlar</h1>
      </div>

      <div className="bg-card">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onChatSelect(conversation.username)}
            className="border-b border-border p-4 hover:bg-muted/50 cursor-pointer"
          >
            <div className="flex space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground">{conversation.username}</p>
                    <p className="text-muted-foreground text-sm">{conversation.handle}</p>
                  </div>
                  <span className="text-muted-foreground text-xs">{conversation.time}</span>
                </div>
                <p className="text-muted-foreground text-sm mt-1 truncate">{conversation.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
