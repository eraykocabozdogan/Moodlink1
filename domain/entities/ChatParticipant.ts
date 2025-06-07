import { User } from "./User";

export interface ChatParticipant {
  id: string;
  chatId: string;
  userId: string;
  joinedAt: Date;
  lastReadMessageId?: string;
  role?: CommunityRole;

  user?: User;
}

export enum CommunityRole {
  Member = 0,
  Admin = 1,
}
