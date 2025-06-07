import { User } from "./User";

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  sentAt: Date;
  isRead: boolean;

  sender?: User;
}
