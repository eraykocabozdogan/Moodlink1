# MoodLink API Client

Bu klasör, MoodLink uygulaması için TypeScript tabanlı API istemcisini içerir. Swagger.json dosyasından otomatik olarak oluşturulan tip tanımları ve API çağrı fonksiyonları bulunmaktadır.

## Dosya Yapısı

```
lib/
├── types/
│   └── api.ts          # TypeScript arayüzleri ve tip tanımları
├── apiClient.ts        # Ana API istemci sınıfı
├── apiClient.example.ts # Kullanım örnekleri
├── utils.ts           # Yardımcı fonksiyonlar
└── README.md          # Bu dosya
```

## Kurulum

API istemcisi axios kullanır. Gerekli bağımlılık zaten yüklenmiştir:

```bash
npm install axios
```

## Temel Kullanım

### 1. API İstemcisini İçe Aktarma

```typescript
import apiClient from '@/lib/apiClient';
import type { CreateActivityCommand, UserForLoginDto } from '@/lib/types/api';
```

### 2. Kimlik Doğrulama

```typescript
// Giriş yapma
const loginData: UserForLoginDto = {
  email: 'user@example.com',
  password: 'password123'
};

const response = await apiClient.login(loginData);

// Token'ı ayarlama
if (response.token) {
  apiClient.setAuthToken(response.token);
}
```

### 3. API Çağrıları Yapma

```typescript
// Aktivite oluşturma
const activityData: CreateActivityCommand = {
  name: 'Morning Yoga',
  description: 'Relaxing yoga session',
  eventTime: '2024-01-15T08:00:00Z',
  location: 'Central Park',
  createdByUserId: 'user-uuid',
  category: 'Wellness'
};

const activity = await apiClient.createActivity(activityData);

// Aktiviteleri listeleme
const activities = await apiClient.getActivities({
  PageIndex: 0,
  PageSize: 10
});
```

## Mevcut API Kategorileri

### 🏃‍♀️ Activities (Aktiviteler)
- `createActivity()` - Yeni aktivite oluştur
- `updateActivity()` - Aktiviteyi güncelle
- `getActivities()` - Aktiviteleri listele
- `getActivityById()` - ID ile aktivite getir
- `deleteActivity()` - Aktiviteyi sil
- `getUserCreatedActivities()` - Kullanıcının oluşturduğu aktiviteler
- `getUserParticipatedActivities()` - Kullanıcının katıldığı aktiviteler
- `getUserActivityStats()` - Kullanıcı aktivite istatistikleri

### 👥 Activity Participations (Aktivite Katılımları)
- `createActivityParticipation()` - Aktiviteye katıl
- `updateActivityParticipation()` - Katılımı güncelle
- `getActivityParticipations()` - Katılımları listele
- `deleteActivityParticipation()` - Katılımı iptal et

### 🤖 AI Test (Yapay Zeka)
- `testChatGPT()` - ChatGPT ile test
- `createTestPost()` - Test gönderisi oluştur
- `checkPostAnalysis()` - Gönderi analizini kontrol et
- `checkUserMood()` - Kullanıcı ruh halini kontrol et
- `getEmotionTypes()` - Duygu türlerini getir

### 🔐 Auth (Kimlik Doğrulama)
- `login()` - Giriş yap
- `register()` - Kayıt ol
- `refreshToken()` - Token'ı yenile
- `sendPasswordResetCode()` - Şifre sıfırlama kodu gönder
- `resetPassword()` - Şifreyi sıfırla

### 🏆 Badges (Rozetler)
- `createBadge()` - Rozet oluştur
- `getBadges()` - Rozetleri listele
- `getBadgeById()` - ID ile rozet getir

### 💬 Chats (Sohbetler)
- `createChat()` - Sohbet oluştur
- `getUserChats()` - Kullanıcı sohbetlerini getir
- `getChatById()` - ID ile sohbet getir
- `updateChat()` - Sohbeti güncelle

### 📝 Comments (Yorumlar)
- `createComment()` - Yorum oluştur
- `updateComment()` - Yorumu güncelle
- `getCommentById()` - ID ile yorum getir
- `deleteComment()` - Yorumu sil

### 👥 Follows (Takipler)
- `createFollow()` - Kullanıcıyı takip et
- `deleteFollow()` - Takibi bırak
- `getFollows()` - Takipleri listele

### ❤️ Likes (Beğeniler)
- `createLike()` - Beğen
- `deleteLike()` - Beğeniyi kaldır
- `getLikeById()` - ID ile beğeniyi getir

### 📨 Messages (Mesajlar)
- `createMessage()` - Mesaj gönder
- `getChatMessages()` - Sohbet mesajlarını getir
- `updateMessage()` - Mesajı güncelle
- `deleteMessage()` - Mesajı sil

### 🔔 Notifications (Bildirimler)
- `createNotification()` - Bildirim oluştur
- `getUserNotifications()` - Kullanıcı bildirimlerini getir
- `markNotificationAsRead()` - Bildirimi okundu olarak işaretle
- `markAllNotificationsAsRead()` - Tüm bildirimleri okundu işaretle

### 📄 Posts (Gönderiler)
- `createPost()` - Gönderi oluştur
- `updatePost()` - Gönderiyi güncelle
- `getPosts()` - Gönderileri listele
- `getPostById()` - ID ile gönderi getir
- `getUserPosts()` - Kullanıcı gönderilerini getir
- `getFeedPosts()` - Ana sayfa gönderilerini getir

### 🔍 Search (Arama)
- `searchUsersAndPosts()` - Kullanıcı ve gönderi ara

### 👤 Users (Kullanıcılar)
- `getUserById()` - ID ile kullanıcı getir
- `getUserFromAuth()` - Mevcut kullanıcıyı getir
- `updateUser()` - Kullanıcıyı güncelle
- `getUserFollowers()` - Kullanıcı takipçilerini getir
- `getUserFollowing()` - Kullanıcının takip ettiklerini getir

## Yapılandırma

### Özel API İstemcisi Oluşturma

```typescript
import { ApiClient } from '@/lib/apiClient';

const customApiClient = new ApiClient({
  baseURL: 'https://custom-api.moodlink.com',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'custom-value'
  }
});
```

### Çevre Değişkenleri

`.env.local` dosyasında API base URL'ini ayarlayabilirsiniz:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.moodlink.com
```

## Hata Yönetimi

API istemcisi otomatik hata yönetimi sağlar:

```typescript
try {
  const response = await apiClient.getUserFromAuth();
} catch (error: any) {
  if (error.response?.status === 401) {
    // Kimlik doğrulama hatası
    console.log('Kullanıcı giriş yapmamış');
  } else if (error.response?.status === 403) {
    // Yetkilendirme hatası
    console.log('Kullanıcının bu işlem için yetkisi yok');
  } else if (error.response?.status >= 500) {
    // Sunucu hatası
    console.log('Sunucu hatası, lütfen tekrar deneyin');
  }
}
```

## Tip Güvenliği

Tüm API çağrıları tam TypeScript tip desteği ile gelir:

```typescript
import type { 
  CreateActivityCommand, 
  CreatedActivityResponse,
  PaginationParams 
} from '@/lib/types/api';

// Tip güvenli API çağrısı
const activityData: CreateActivityCommand = {
  name: 'Yoga Session',
  // TypeScript otomatik tamamlama ve tip kontrolü sağlar
};

const response: CreatedActivityResponse = await apiClient.createActivity(activityData);
```

## Örnekler

Detaylı kullanım örnekleri için `apiClient.example.ts` dosyasına bakın.

## Güncelleme

Swagger.json dosyası güncellendiğinde, tip tanımları ve API istemcisi manuel olarak güncellenmeli veya otomatik kod üretimi araçları kullanılmalıdır.
