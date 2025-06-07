import { User } from "./User";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  relatedEntityId?: string;
  createdAt: Date;

  user?: User;
}

export enum NotificationType {
  System = 0,
  NewFollower = 1,
  NewLike = 2,
  NewComment = 3,
  ActivityInvitation = 4,
  NewMessage = 5,
  NewBadge = 6,
}
