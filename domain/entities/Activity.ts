export interface Activity {
  id: string;
  name: string;
  description: string;
  eventTime: Date;
  location?: string;
  createdByUserId: string;
  category?: string;
  targetMoodDescription?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt?: Date;

  createdByUser?: {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
  };

  participantCount?: number;
  isParticipating?: boolean;

  // For UI interaction state
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  likeId?: string;
}
