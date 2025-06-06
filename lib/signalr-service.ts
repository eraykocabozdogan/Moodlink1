import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { toast } from '@/hooks/use-toast';

// SignalR olayları için tip tanımları
export interface Message {
  id: string;
  chatId: string;
  senderUserId: string;
  senderUserName?: string;
  content: string;
  sentDate: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: number;
  content: string;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
  isRead: boolean;
  createdDate: string;
}

// Callback fonksiyonları için tip tanımları
type MessageCallback = (message: Message) => void;
type NotificationCallback = (notification: Notification) => void;
type ConnectionChangeCallback = (isConnected: boolean) => void;

// SignalR servis sınıfı
class SignalRService {
  private connection: HubConnection | null = null;
  private messageCallbacks: MessageCallback[] = [];
  private notificationCallbacks: NotificationCallback[] = [];
  private connectionChangeCallbacks: ConnectionChangeCallback[] = [];
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectInterval = 5000; // 5 saniye
  private userId: string | null = null;

  // Bağlantı oluşturma
  public async startConnection(token: string, userId: string): Promise<boolean> {
    if (this.connection && this.connection.state === HubConnectionState.Connected) {
      console.log('SignalR bağlantısı zaten açık');
      return true;
    }

    this.userId = userId;

    try {
      // SignalR hub bağlantısını oluştur
      this.connection = new HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/hubs/notifications`, {
          accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      // Mesaj alma olayını dinle
      this.connection.on('ReceiveMessage', (message: Message) => {
        console.log('Yeni mesaj alındı:', message);
        this.messageCallbacks.forEach(callback => callback(message));
      });

      // Bildirim alma olayını dinle
      this.connection.on('ReceiveNotification', (notification: Notification) => {
        console.log('Yeni bildirim alındı:', notification);
        this.notificationCallbacks.forEach(callback => callback(notification));
      });

      // Bağlantı durumu değişikliklerini dinle
      this.connection.onreconnecting(() => {
        console.log('SignalR bağlantısı yeniden kuruluyor...');
        this.notifyConnectionChange(false);
      });

      this.connection.onreconnected(() => {
        console.log('SignalR bağlantısı yeniden kuruldu');
        this.notifyConnectionChange(true);
      });

      this.connection.onclose(() => {
        console.log('SignalR bağlantısı kapandı');
        this.notifyConnectionChange(false);
        this.attemptReconnect();
      });

      // Bağlantıyı başlat
      await this.connection.start();
      console.log('SignalR bağlantısı başarıyla kuruldu');
      this.notifyConnectionChange(true);
      this.reconnectAttempts = 0;
      return true;
    } catch (error) {
      console.error('SignalR bağlantısı kurulamadı:', error);
      this.notifyConnectionChange(false);
      this.attemptReconnect();
      return false;
    }
  }

  // Bağlantıyı kapatma
  public async stopConnection(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('SignalR bağlantısı kapatıldı');
      } catch (error) {
        console.error('SignalR bağlantısı kapatılırken hata oluştu:', error);
      } finally {
        this.connection = null;
        this.userId = null;
        this.notifyConnectionChange(false);
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      }
    }
  }

  // Yeniden bağlanma denemesi
  private attemptReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`SignalR yeniden bağlanma denemesi ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
      
      this.reconnectTimer = setTimeout(async () => {
        if (this.userId && this.connection?.state !== HubConnectionState.Connected) {
          const token = localStorage.getItem('auth_token');
          if (token) {
            await this.startConnection(token, this.userId);
          }
        }
      }, this.reconnectInterval);
    } else {
      console.error('Maksimum yeniden bağlanma denemesi sayısına ulaşıldı');
      toast({
        variant: "destructive",
        title: "Bağlantı Hatası",
        description: "Sunucu ile bağlantı kurulamadı. Lütfen sayfayı yenileyin.",
      });
    }
  }

  // Mesaj gönderme
  public async sendMessage(chatId: string, content: string): Promise<boolean> {
    if (!this.connection || this.connection.state !== HubConnectionState.Connected) {
      console.error('SignalR bağlantısı açık değil, mesaj gönderilemiyor');
      return false;
    }

    try {
      await this.connection.invoke('SendMessage', chatId, content);
      return true;
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
      return false;
    }
  }

  // Mesaj olayı için callback ekleme
  public onReceiveMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  // Bildirim olayı için callback ekleme
  public onReceiveNotification(callback: NotificationCallback): () => void {
    this.notificationCallbacks.push(callback);
    return () => {
      this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
    };
  }

  // Bağlantı durumu değişikliği için callback ekleme
  public onConnectionChange(callback: ConnectionChangeCallback): () => void {
    this.connectionChangeCallbacks.push(callback);
    return () => {
      this.connectionChangeCallbacks = this.connectionChangeCallbacks.filter(cb => cb !== callback);
    };
  }

  // Bağlantı durumu değişikliğini bildirme
  private notifyConnectionChange(isConnected: boolean): void {
    this.connectionChangeCallbacks.forEach(callback => callback(isConnected));
  }

  // Bağlantı durumunu kontrol etme
  public isConnected(): boolean {
    return this.connection?.state === HubConnectionState.Connected;
  }
}

// Singleton instance
const signalRService = new SignalRService();
export default signalRService;