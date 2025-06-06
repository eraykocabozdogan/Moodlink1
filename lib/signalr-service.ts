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
  private readonly maxReconnectAttempts = 3; // Reduced from 5 to 3
  private readonly reconnectInterval = 5000; // 5 saniye
  private userId: string | null = null;
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://moodlinkbackend.onrender.com';
  private isSignalRDisabled = false;

  // Check if SignalR is likely available by checking if the endpoint exists
  private async checkSignalREndpoint(): Promise<boolean> {
    try {
      // Try to access the SignalR negotiation endpoint
      const response = await fetch(`${this.API_BASE_URL}/hubs/notifications/negotiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Only wait 3 seconds before timing out
        signal: AbortSignal.timeout(3000),
      });
      
      // If the endpoint doesn't exist, we'll get a 404
      if (response.status === 404) {
        console.log('SignalR hub endpoint not found, disabling SignalR');
        return false;
      }
      
      // Even if unauthorized (401) or other error, the endpoint exists
      return true;
    } catch (error) {
      console.error('Error checking SignalR endpoint:', error);
      // Network errors (timeout, connection refused, etc) mean the endpoint is likely not available
      return false;
    }
  }

  // Bağlantı oluşturma
  public async startConnection(token: string, userId: string): Promise<boolean> {
    // Check if SignalR is already disabled in local storage
    if (typeof window !== 'undefined' && localStorage.getItem('signalr-disabled') === 'true') {
      this.isSignalRDisabled = true;
    }
    
    // If SignalR is disabled, don't try to connect
    if (this.isSignalRDisabled) {
      console.log('SignalR is disabled, not attempting to connect');
      return false;
    }

    if (this.connection && this.connection.state === HubConnectionState.Connected) {
      console.log('SignalR bağlantısı zaten açık');
      return true;
    }

    this.userId = userId;

    // Check if the SignalR endpoint exists before attempting to connect
    const endpointExists = await this.checkSignalREndpoint();
    if (!endpointExists) {
      console.log('SignalR endpoint does not exist, disabling SignalR');
      this.disableSignalR();
      return false;
    }

    try {
      // SignalR hub bağlantısını oluştur
      this.connection = new HubConnectionBuilder()
        .withUrl(`${this.API_BASE_URL}/hubs/notifications`, {
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
      try {
        await this.connection.start();
        console.log('SignalR bağlantısı başarıyla kuruldu');
        this.notifyConnectionChange(true);
        this.reconnectAttempts = 0;
        return true;
      } catch (startError: unknown) {
        console.error('SignalR bağlantısı başlatılamadı:', startError);
        
        // Check if it's a "Failed to fetch" error, which indicates the endpoint doesn't exist
        const errorMessage = startError instanceof Error 
          ? startError.toString() 
          : String(startError);
          
        if (errorMessage.includes('Failed to fetch') || 
            errorMessage.includes('Failed to complete negotiation')) {
          console.log('Backend appears to not support SignalR, disabling real-time features');
          this.disableSignalR();
          
          // Display a friendly message only once
          if (typeof window !== 'undefined') {
            // Store in session storage that we've shown this message
            if (!sessionStorage.getItem('signalr-disabled-message-shown')) {
              console.info('Real-time notifications are not available. The app will work normally, but you may need to refresh to see updates.');
              sessionStorage.setItem('signalr-disabled-message-shown', 'true');
            }
          }
          
          return false;
        }
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.log('Maksimum bağlantı denemesi aşıldı, SignalR devre dışı bırakılıyor');
          this.disableSignalR();
        }
        throw startError;
      }
    } catch (error: unknown) {
      console.error('SignalR bağlantısı kurulamadı:', error);
      this.notifyConnectionChange(false);
      
      // Check if it's a network-related error
      const errorMessage = error instanceof Error 
        ? error.toString() 
        : String(error);
        
      if (errorMessage.includes('Failed to fetch') || 
          errorMessage.includes('NetworkError') ||
          errorMessage.includes('Failed to complete negotiation')) {
        console.log('Network error detected, disabling SignalR to prevent unnecessary retries');
        this.disableSignalR();
        return false;
      }
      
      // If we've reached max attempts, disable SignalR to prevent further attempts
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.disableSignalR();
      } else {
        this.attemptReconnect();
      }
      return false;
    }
  }

  // Disable SignalR functionality
  public disableSignalR(): void {
    console.log('SignalR functionality has been disabled');
    this.isSignalRDisabled = true;
    
    // Store the disabled state in localStorage to persist across page refreshes
    if (typeof window !== 'undefined') {
      localStorage.setItem('signalr-disabled', 'true');
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.connection) {
      this.connection.stop().catch(error => {
        console.error('Error stopping SignalR connection:', error);
      });
      this.connection = null;
    }
    this.notifyConnectionChange(false);
  }

  // Enable SignalR functionality
  public enableSignalR(): void {
    console.log('SignalR functionality has been enabled');
    this.isSignalRDisabled = false;
    
    // Remove the disabled state from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('signalr-disabled');
    }
    
    // We don't automatically reconnect here, let the user refresh the page
    this.notifyConnectionChange(false);
  }

  // Check if SignalR is disabled
  public isDisabled(): boolean {
    return this.isSignalRDisabled;
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
    if (this.isSignalRDisabled) {
      console.log('SignalR is disabled, not attempting to reconnect');
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`SignalR yeniden bağlanma denemesi ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
      
      this.reconnectTimer = setTimeout(async () => {
        if (this.userId && this.connection?.state !== HubConnectionState.Connected) {
          const token = localStorage.getItem('token');
          if (token) {
            await this.startConnection(token, this.userId);
          }
        }
      }, this.reconnectInterval);
    } else {
      console.error('Maksimum yeniden bağlanma denemesi sayısına ulaşıldı');
      this.disableSignalR();
    }
  }

  // Mesaj gönderme
  public async sendMessage(chatId: string, content: string): Promise<boolean> {
    if (this.isSignalRDisabled) {
      console.log('SignalR is disabled, message will not be sent');
      return false;
    }

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
    return !this.isSignalRDisabled && this.connection?.state === HubConnectionState.Connected;
  }
}

// Singleton instance
const signalRService = new SignalRService();
export default signalRService;