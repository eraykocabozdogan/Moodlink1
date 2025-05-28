export function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      text: "Doğan ve 2 diğer kişi gönderini beğendi.",
      snippet: "I really like #invincible",
      time: "2s",
    },
    {
      id: 2,
      text: "Eray sana yanıt verdi.",
      snippet: "I don't care!",
      time: "5dk",
    },
  ]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-800">Bildirimler</h1>
      </div>

      <div className="bg-white">
        {notifications.map((notification) => (
          <div key={notification.id} className="border-b border-gray-200 p-4 hover:bg-gray-50 cursor-pointer">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{notification.text}</p>
                <p className="text-gray-600 text-sm mt-1 bg-gray-100 p-2 rounded-lg">"{notification.snippet}"</p>
                <span className="text-gray-500 text-xs">{notification.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
