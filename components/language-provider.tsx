"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

// Desteklenen diller
export type Language = "tr" | "en" | "de" | "fr" | "es"

// Çeviriler için arayüz
interface Translations {
  [key: string]: {
    [key: string]: string
  }
}

// Dil bağlamı için tip
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string>) => string
}

// Türkçe çeviriler
const trTranslations = {
  // Sayfa başlıkları
  "title.home": "Ana Sayfa",
  "title.profile": "Profil",
  "title.notifications": "Bildirimler",
  "title.search": "Ara",
  "title.messages": "Mesajlar",
  "title.community": "Topluluk",
  "title.options": "Seçenekler (Ayarlar)",
  "title.theme": "Tema Seçimi",
  "title.language": "Dil Seçimi",
  "title.password": "Şifre Değiştir",
  "title.activities": "Etkinlikler",
  "title.moodReport": "Ruh Hali Raporu",
  
  // Profil ve kullanıcı bilgileri
  "profile.followers": "Takipçi",
  "profile.followingCount": "Takip Edilen",
  "profile.mood": "Mood",
  "profile.badges": "Rozetler",
  "profile.compatibility": "Mood Uyumu",
  "profile.compatibilityText": "Bu kullanıcıyla mood uyumunuz yüksek. Benzer etkinliklerden hoşlanıyorsunuz!",
  "profile.posts": "Gönderiler",
  "profile.noBadges": "Henüz rozet yok",
  "profile.noMood": "Henüz mood verisi yok",
  "profile.follow": "Takip Et",
  "profile.followingStatus": "Takip Ediliyor",
  "profile.message": "Mesaj Gönder",
  "profile.username": "Kullanıcı adı",
  "profile.handle": "Kullanıcı kodu",
  "profile.bio": "Biyografi",
  
  // Ana sayfa
  "home.forYou": "Sizin İçin",
  "home.following": "Takip Edilenler",
  
  // Seçenekler sayfası
  "options.languages": "Diller",
  "options.theme": "Tema",
  "options.notifications": "Bildirimler",
  "options.changePassword": "Şifre Değiştir",
  "options.logout": "Çıkış Yap",
  "options.currentPassword": "Mevcut Şifre",
  "options.newPassword": "Yeni Şifre",
  "options.confirmPassword": "Yeni Şifre Tekrar",
  "options.savePassword": "Şifreyi Değiştir",
  "options.cancel": "İptal",
  
  // Mesajlar ve sohbet
  "chat.send": "Gönder",
  "chat.typeMessage": "Mesaj yazın...",
  "chat.noMessages": "Henüz mesaj yok. İlk mesajı sen gönder! 👋",
  
  // Arama
  "search.placeholder": "Ara...",
  "search.suggestions": "Öneriler",
  "search.trending": "Gündem",
  "search.users": "Kullanıcılar",
  "search.communities": "Topluluklar",
  
  // Topluluk
  "community.create": "Topluluk Oluştur",
  "community.search": "Topluluk ara...",
  "community.joined": "Katıldığın Topluluklar",
  "community.discover": "Keşfet",
  "community.members": "üye",
  
  // Etkinlikler
  "activities.create": "Etkinlik Oluştur",
  "activities.all": "Tümü",
  "activities.upcoming": "Yaklaşan",
  "activities.completed": "Tamamlanan",
  "activities.sports": "Spor",
  "activities.culture": "Kültür",
  "activities.entertainment": "Eğlence",
  
  // Genel
  "general.back": "Geri",
  "general.save": "Kaydet",
  "general.cancel": "İptal",
  "general.create": "Oluştur",
  "general.join": "Katıl",
  "general.leave": "Ayrıl",
  "general.whatsHappening": "Neler oluyor?",
  "general.remove": "Kaldır",
  "general.send": "Gönder",
  "general.ctrlEnterToSend": "Ctrl+Enter ile gönder",
  "general.edit": "Düzenle",
  
  // Gönderiler
  "post.time.seconds": "{seconds}sn",
  "post.time.minutes": "{minutes}dk",
  "post.time.hours": "{hours}sa",
  "post.time.days": "{days}g",
  "post.time.now": "şimdi",
  "post.example.mood": "Bugün harika bir gün! #MoodLink ile paylaşmak istedim.",
  "post.example.activity": "Yeni bir etkinlik planı yapıyorum. Katılmak isteyen var mı?",
  "post.share": "Paylaş",
  "post.save": "Kaydet",
  "post.moodMatch": "Mood Uyumu",
  "post.writeComment": "Yorum yaz...",
  "post.linkCopied": "Link kopyalandı!",
  "post.comment.you": "Sen",
  "post.comment.example1": "Harika post!",
  "post.comment.example2": "Katılıyorum!",
  
  // Ruh halleri
  "mood.energetic": "Enerjik",
  "mood.happy": "Mutlu",
  "mood.calm": "Sakin",
  "mood.curious": "Meraklı",
  
  // Profil
  "profile.exampleBio": "{username} isimli kullanıcının profili. MoodLink kullanıcısı."
}

// İngilizce çeviriler
const enTranslations = {
  // Sayfa başlıkları
  "title.home": "Home",
  "title.profile": "Profile",
  "title.notifications": "Notifications",
  "title.search": "Search",
  "title.messages": "Messages",
  "title.community": "Community",
  "title.options": "Options (Settings)",
  "title.theme": "Theme Selection",
  "title.language": "Language Selection",
  "title.password": "Change Password",
  "title.activities": "Activities",
  "title.moodReport": "Mood Report",
  
  // Profil ve kullanıcı bilgileri
  "profile.followers": "Followers",
  "profile.followingCount": "Following",
  "profile.mood": "Mood",
  "profile.badges": "Badges",
  "profile.compatibility": "Mood Compatibility",
  "profile.compatibilityText": "You have high mood compatibility with this user. You enjoy similar activities!",
  "profile.posts": "Posts",
  "profile.noBadges": "No badges yet",
  "profile.noMood": "No mood data yet",
  "profile.follow": "Follow",
  "profile.followingStatus": "Following",
  "profile.message": "Send Message",
  "profile.username": "Username",
  "profile.handle": "Handle",
  "profile.bio": "Biography",
  
  // Ana sayfa
  "home.forYou": "For You",
  "home.following": "Following",
  
  // Seçenekler sayfası
  "options.languages": "Languages",
  "options.theme": "Theme",
  "options.notifications": "Notifications",
  "options.changePassword": "Change Password",
  "options.logout": "Log Out",
  "options.currentPassword": "Current Password",
  "options.newPassword": "New Password",
  "options.confirmPassword": "Confirm New Password",
  "options.savePassword": "Change Password",
  "options.cancel": "Cancel",
  
  // Mesajlar ve sohbet
  "chat.send": "Send",
  "chat.typeMessage": "Type a message...",
  "chat.noMessages": "No messages yet. Send the first one! 👋",
  
  // Arama
  "search.placeholder": "Search...",
  "search.suggestions": "Suggestions",
  "search.trending": "Trending",
  "search.users": "Users",
  "search.communities": "Communities",
  
  // Topluluk
  "community.create": "Create Community",
  "community.search": "Search communities...",
  "community.joined": "Your Communities",
  "community.discover": "Discover",
  "community.members": "members",
  
  // Etkinlikler
  "activities.create": "Create Activity",
  "activities.all": "All",
  "activities.upcoming": "Upcoming",
  "activities.completed": "Completed",
  "activities.sports": "Sports",
  "activities.culture": "Culture",
  "activities.entertainment": "Entertainment",
  
  // Genel
  "general.back": "Back",
  "general.save": "Save",
  "general.cancel": "Cancel",
  "general.create": "Create",
  "general.join": "Join",
  "general.leave": "Leave",
  "general.whatsHappening": "What's happening?",
  "general.remove": "Remove",
  "general.send": "Send",
  "general.ctrlEnterToSend": "Ctrl+Enter to send",
  "general.edit": "Edit",
  
  // Gönderiler
  "post.time.seconds": "{seconds}s",
  "post.time.minutes": "{minutes}m",
  "post.time.hours": "{hours}h",
  "post.time.days": "{days}d",
  "post.time.now": "just now",
  "post.example.mood": "What a wonderful day! Wanted to share it on #MoodLink.",
  "post.example.activity": "Planning a new activity. Anyone want to join?",
  "post.share": "Share",
  "post.save": "Save",
  "post.moodMatch": "Mood Match",
  "post.writeComment": "Write a comment...",
  "post.linkCopied": "Link copied!",
  "post.comment.you": "You",
  "post.comment.example1": "Great post!",
  "post.comment.example2": "I agree!",
  
  // Ruh halleri
  "mood.energetic": "Energetic",
  "mood.happy": "Happy",
  "mood.calm": "Calm",
  "mood.curious": "Curious",
  
  // Profil
  "profile.exampleBio": "{username}'s profile. MoodLink user."
}

// Almanca çeviriler
const deTranslations = {
  // Sayfa başlıkları
  "title.home": "Startseite",
  "title.profile": "Profil",
  "title.notifications": "Benachrichtigungen",
  "title.search": "Suchen",
  "title.messages": "Nachrichten",
  "title.community": "Gemeinschaft",
  "title.options": "Optionen (Einstellungen)",
  "title.theme": "Themenauswahl",
  "title.language": "Sprachauswahl",
  "title.password": "Passwort ändern",
  "title.activities": "Aktivitäten",
  "title.moodReport": "Stimmungsbericht",
  
  // Profil ve kullanıcı bilgileri
  "profile.followers": "Follower",
  "profile.followingCount": "Folgt",
  "profile.mood": "Stimmung",
  "profile.badges": "Abzeichen",
  "profile.compatibility": "Stimmungskompatibilität",
  "profile.compatibilityText": "Sie haben eine hohe Stimmungskompatibilität mit diesem Benutzer. Sie genießen ähnliche Aktivitäten!",
  "profile.posts": "Beiträge",
  "profile.noBadges": "Noch keine Abzeichen",
  "profile.noMood": "Noch keine Stimmungsdaten",
  "profile.follow": "Folgen",
  "profile.followingStatus": "Folgend",
  "profile.message": "Nachricht senden",
  "profile.username": "Benutzername",
  "profile.handle": "Handle",
  "profile.bio": "Biografie",
  
  // Ana sayfa
  "home.forYou": "Für Sie",
  "home.following": "Folgen",
  
  // Seçenekler sayfası
  "options.languages": "Sprachen",
  "options.theme": "Thema",
  "options.notifications": "Benachrichtigungen",
  "options.changePassword": "Passwort ändern",
  "options.logout": "Abmelden",
  "options.currentPassword": "Aktuelles Passwort",
  "options.newPassword": "Neues Passwort",
  "options.confirmPassword": "Neues Passwort bestätigen",
  "options.savePassword": "Passwort ändern",
  "options.cancel": "Abbrechen",
  
  // Mesajlar ve sohbet
  "chat.send": "Senden",
  "chat.typeMessage": "Nachricht eingeben...",
  "chat.noMessages": "Noch keine Nachrichten. Senden Sie die erste! 👋",
  
  // Arama
  "search.placeholder": "Suchen...",
  "search.suggestions": "Vorschläge",
  "search.trending": "Trending",
  "search.users": "Benutzer",
  "search.communities": "Gemeinschaften",
  
  // Topluluk
  "community.create": "Gemeinschaft erstellen",
  "community.search": "Gemeinschaften suchen...",
  "community.joined": "Ihre Gemeinschaften",
  "community.discover": "Entdecken",
  "community.members": "Mitglieder",
  
  // Etkinlikler
  "activities.create": "Aktivität erstellen",
  "activities.all": "Alle",
  "activities.upcoming": "Bevorstehend",
  "activities.completed": "Abgeschlossen",
  "activities.sports": "Sport",
  "activities.culture": "Kultur",
  "activities.entertainment": "Unterhaltung",
  
  // Genel
  "general.back": "Zurück",
  "general.save": "Speichern",
  "general.cancel": "Abbrechen",
  "general.create": "Erstellen",
  "general.join": "Beitreten",
  "general.leave": "Verlassen",
  "general.whatsHappening": "Was passiert?",
  "general.remove": "Entfernen",
  "general.send": "Senden",
  "general.ctrlEnterToSend": "Strg+Enter zum Senden",
  "general.edit": "Bearbeiten",
  
  // Gönderiler
  "post.time.seconds": "{seconds}s",
  "post.time.minutes": "{minutes}m",
  "post.time.hours": "{hours}h",
  "post.time.days": "{days}t",
  "post.time.now": "gerade eben",
  "post.example.mood": "Was für ein wunderbarer Tag! Wollte es auf #MoodLink teilen.",
  "post.example.activity": "Plane eine neue Aktivität. Möchte jemand teilnehmen?",
  "post.share": "Teilen",
  "post.save": "Speichern",
  "post.moodMatch": "Stimmungsübereinstimmung",
  "post.writeComment": "Kommentar schreiben...",
  "post.linkCopied": "Link kopiert!",
  "post.comment.you": "Sie",
  "post.comment.example1": "Toller Beitrag!",
  "post.comment.example2": "Ich stimme zu!",
  
  // Ruh halleri
  "mood.energetic": "Energisch",
  "mood.happy": "Glücklich",
  "mood.calm": "Ruhig",
  "mood.curious": "Neugierig",
  
  // Profil
  "profile.exampleBio": "Profil von {username}. MoodLink-Benutzer."
}

// Fransızca çeviriler
const frTranslations = {
  // Sayfa başlıkları
  "title.home": "Accueil",
  "title.profile": "Profil",
  "title.notifications": "Notifications",
  "title.search": "Recherche",
  "title.messages": "Messages",
  "title.community": "Communauté",
  "title.options": "Options (Paramètres)",
  "title.theme": "Sélection du thème",
  "title.language": "Sélection de la langue",
  "title.password": "Changer le mot de passe",
  "title.activities": "Activités",
  "title.moodReport": "Rapport d'humeur",
  
  // Profil ve kullanıcı bilgileri
  "profile.followers": "Abonnés",
  "profile.followingCount": "Abonnements",
  "profile.mood": "Humeur",
  "profile.badges": "Badges",
  "profile.compatibility": "Compatibilité d'humeur",
  "profile.compatibilityText": "Vous avez une haute compatibilité d'humeur avec cet utilisateur. Vous appréciez des activités similaires!",
  "profile.posts": "Publications",
  "profile.noBadges": "Pas encore de badges",
  "profile.noMood": "Pas encore de données d'humeur",
  "profile.follow": "Suivre",
  "profile.followingStatus": "Abonné",
  "profile.message": "Envoyer un message",
  "profile.username": "Nom d'utilisateur",
  "profile.handle": "Identifiant",
  "profile.bio": "Biographie",
  
  // Ana sayfa
  "home.forYou": "Pour vous",
  "home.following": "Abonnements",
  "options.languages": "Langues",
  "options.theme": "Thème",
  "options.notifications": "Notifications",
  "options.changePassword": "Changer le mot de passe",
  "options.logout": "Déconnexion",
  "options.currentPassword": "Mot de passe actuel",
  "options.newPassword": "Nouveau mot de passe",
  "options.confirmPassword": "Confirmer le nouveau mot de passe",
  "options.savePassword": "Changer le mot de passe",
  "options.cancel": "Annuler",
  
  // Mesajlar ve sohbet
  "chat.send": "Envoyer",
  "chat.typeMessage": "Écrivez un message...",
  "chat.noMessages": "Pas encore de messages. Envoyez le premier! 👋",
  
  // Arama
  "search.placeholder": "Rechercher...",
  "search.suggestions": "Suggestions",
  "search.trending": "Tendances",
  "search.users": "Utilisateurs",
  "search.communities": "Communautés",
  
  // Topluluk
  "community.create": "Créer une communauté",
  "community.search": "Rechercher des communautés...",
  "community.joined": "Vos communautés",
  "community.discover": "Découvrir",
  "community.members": "membres",
  
  // Etkinlikler
  "activities.create": "Créer une activité",
  "activities.all": "Tous",
  "activities.upcoming": "À venir",
  "activities.completed": "Terminées",
  "activities.sports": "Sports",
  "activities.culture": "Culture",
  "activities.entertainment": "Divertissement",
  
  // Genel
  "general.back": "Retour",
  "general.save": "Enregistrer",
  "general.cancel": "Annuler",
  "general.create": "Créer",
  "general.join": "Rejoindre",
  "general.leave": "Quitter",
  "general.whatsHappening": "Que se passe-t-il?",
  "general.remove": "Supprimer",
  "general.send": "Envoyer",
  "general.ctrlEnterToSend": "Ctrl+Entrée pour envoyer",
  "general.edit": "Modifier",
  
  // Gönderiler
  "post.time.seconds": "{seconds}s",
  "post.time.minutes": "{minutes}m",
  "post.time.hours": "{hours}h",
  "post.time.days": "{days}j",
  "post.time.now": "à l'instant",
  "post.example.mood": "Quelle belle journée! Je voulais la partager sur #MoodLink.",
  "post.example.activity": "Je planifie une nouvelle activité. Quelqu'un veut se joindre?",
  "post.share": "Partager",
  "post.save": "Enregistrer",
  "post.moodMatch": "Compatibilité d'humeur",
  "post.writeComment": "Écrire un commentaire...",
  "post.linkCopied": "Lien copié!",
  "post.comment.you": "Vous",
  "post.comment.example1": "Super publication!",
  "post.comment.example2": "Je suis d'accord!",
  
  // Ruh halleri
  "mood.energetic": "Énergique",
  "mood.happy": "Heureux",
  "mood.calm": "Calme",
  "mood.curious": "Curieux",
  
  // Profil
  "profile.exampleBio": "Profil de {username}. Utilisateur MoodLink."
}

// İspanyolca çeviriler
const esTranslations = {
  // Sayfa başlıkları
  "title.home": "Inicio",
  "title.profile": "Perfil",
  "title.notifications": "Notificaciones",
  "title.search": "Buscar",
  "title.messages": "Mensajes",
  "title.community": "Comunidad",
  "title.options": "Opciones (Ajustes)",
  "title.theme": "Selección de tema",
  "title.language": "Selección de idioma",
  "title.password": "Cambiar contraseña",
  "title.activities": "Actividades",
  "title.moodReport": "Informe de estado de ánimo",
  
  // Profil ve kullanıcı bilgileri
  "profile.followers": "Seguidores",
  "profile.followingCount": "Siguiendo",
  "profile.mood": "Estado de ánimo",
  "profile.badges": "Insignias",
  "profile.compatibility": "Compatibilidad de estado de ánimo",
  "profile.compatibilityText": "Tienes alta compatibilidad de estado de ánimo con este usuario. ¡Disfrutas de actividades similares!",
  "profile.posts": "Publicaciones",
  "profile.noBadges": "Aún no hay insignias",
  "profile.noMood": "Aún no hay datos de estado de ánimo",
  "profile.follow": "Seguir",
  "profile.followingStatus": "Siguiendo",
  "profile.message": "Enviar mensaje",
  "profile.username": "Nombre de usuario",
  "profile.handle": "Identificador",
  "profile.bio": "Biografía",
  
  // Seçenekler sayfası
  "options.languages": "Idiomas",
  "options.theme": "Tema",
  "options.notifications": "Notificaciones",
  "options.changePassword": "Cambiar contraseña",
  "options.logout": "Cerrar sesión",
  "options.currentPassword": "Contraseña actual",
  "options.newPassword": "Nueva contraseña",
  "options.confirmPassword": "Confirmar nueva contraseña",
  "options.savePassword": "Cambiar contraseña",
  "options.cancel": "Cancelar",
  
  // Mesajlar ve sohbet
  "chat.send": "Enviar",
  "chat.typeMessage": "Escribe un mensaje...",
  "chat.noMessages": "Aún no hay mensajes. ¡Envía el primero! 👋",
  
  // Arama
  "search.placeholder": "Buscar...",
  "search.suggestions": "Sugerencias",
  "search.trending": "Tendencias",
  "search.users": "Usuarios",
  "search.communities": "Comunidades",
  
  // Topluluk
  "community.create": "Crear comunidad",
  "community.search": "Buscar comunidades...",
  "community.joined": "Tus comunidades",
  "community.discover": "Descubrir",
  "community.members": "miembros",
  
  // Etkinlikler
  "activities.create": "Crear actividad",
  "activities.all": "Todos",
  "activities.upcoming": "Próximos",
  "activities.completed": "Completados",
  "activities.sports": "Deportes",
  "activities.culture": "Cultura",
  "activities.entertainment": "Entretenimiento",
  
  // Genel
  "general.back": "Atrás",
  "general.save": "Guardar",
  "general.cancel": "Cancelar",
  "general.create": "Crear",
  "general.join": "Unirse",
  "general.leave": "Salir",
  "general.whatsHappening": "¿Qué está pasando?",
  "general.remove": "Eliminar",
  "general.send": "Enviar",
  "general.ctrlEnterToSend": "Ctrl+Enter para enviar",
  "general.edit": "Editar",
  
  // Gönderiler
  "post.time.seconds": "{seconds}s",
  "post.time.minutes": "{minutes}m",
  "post.time.hours": "{hours}h",
  "post.time.days": "{days}d",
  "post.time.now": "ahora mismo",
  "post.example.mood": "¡Qué día tan maravilloso! Quería compartirlo en #MoodLink.",
  "post.example.activity": "Planeando una nueva actividad. ¿Alguien quiere unirse?",
  "post.share": "Compartir",
  "post.save": "Guardar",
  "post.moodMatch": "Compatibilidad de estado",
  "post.writeComment": "Escribe un comentario...",
  "post.linkCopied": "¡Enlace copiado!",
  "post.comment.you": "Tú",
  "post.comment.example1": "¡Gran publicación!",
  "post.comment.example2": "¡Estoy de acuerdo!",
  
  // Ruh halleri
  "mood.energetic": "Enérgico",
  "mood.happy": "Feliz",
  "mood.calm": "Tranquilo",
  "mood.curious": "Curioso",
  
  // Profil
  "profile.exampleBio": "Perfil de {username}. Usuario de MoodLink."
}

// Tüm çevirileri birleştir
const translations: Translations = {
  tr: trTranslations,
  en: enTranslations,
  de: deTranslations,
  fr: frTranslations,
  es: esTranslations,
}

// Dil bağlamını oluştur
const LanguageContext = createContext<LanguageContextType>({
  language: "tr",
  setLanguage: () => {},
  t: () => "",
})

// Dil sağlayıcı bileşeni
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("tr")
  
  // localStorage'dan dil tercihini al
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])
  
  // Dil değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("language", language)
    // Sayfa başlığı ve HTML lang özniteliğini güncelle
    document.documentElement.lang = language
  }, [language])
  
  // Çeviri fonksiyonu
  const t = (key: string, params?: Record<string, string>): string => {
    if (!translations[language]) return key
    
    let translatedText = translations[language][key] || key
    
    // Parametreleri değiştir
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translatedText = translatedText.replace(`{${paramKey}}`, paramValue)
      })
    }
    
    return translatedText
  }
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Dil bağlamını kullanmak için kanca
export const useLanguage = () => useContext(LanguageContext)
